import { pool } from "../../config/db";


const createBooking = async (payload: any) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    // STEP 1 — Check customer exists
    const customer = await pool.query(
      `SELECT id FROM users WHERE id=$1`,
      [customer_id]
    );

    if (customer.rows.length === 0) {
      throw new Error("Customer not found");
    }

    // STEP 2 — Check vehicle exists
    const vehicle = await pool.query(
      `SELECT * FROM vehicles WHERE id=$1`,
      [vehicle_id]
    );

    if (vehicle.rows.length === 0) {
      throw new Error("Vehicle not found");
    }

    // STEP 3 — Check availability
    if (vehicle.rows[0].availability_status === "booked") {
      throw new Error("Vehicle is already booked");
    }

    // STEP 4 — Calculate total price
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);

    const diffInMs = end.getTime() - start.getTime();
    const numberOfDays = diffInMs / (1000 * 60 * 60 * 24);

    if (numberOfDays <= 0) {
      throw new Error("End date must be after start date");
    }

    const total_price = numberOfDays * vehicle.rows[0].daily_rent_price;

    // STEP 5 — Insert booking
    const booking = await pool.query(
      `
        INSERT INTO bookings(
          customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
        )
        VALUES($1,$2,$3,$4,$5,'active')
        RETURNING *
      `,
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
      ]
    );

    // STEP 6 — Update vehicle availability
    await pool.query(
      `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
      [vehicle_id]
    );
     
    delete booking.rows[0].created_at;
    delete booking.rows[0].updated_at;

    return {
      ...booking.rows[0],
      vehicle: {
        vehicle_name: vehicle.rows[0].vehicle_name,
        daily_rent_price: vehicle.rows[0].daily_rent_price,
      },
    };
  }


  // Get all bookings (role-based)
const getAllBookings = async (user: any) => {
  let query, values: any[] | undefined;
  if (user.role === 'admin') {
    query = `
      SELECT b.*, 
             u.name AS customer_name, u.email AS customer_email,
             v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `;
    values = [];
  } else {
    query = `
      SELECT b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date,
             b.total_price, b.status,
             v.vehicle_name, v.registration_number, v.type
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.id DESC
    `;
    values = [user.id];
  }

  const result = await pool.query(query, values);
  return result.rows;
};


  export const bookingService={
    createBooking,
    getAllBookings
  }
