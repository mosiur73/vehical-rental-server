import { pool } from "../../config/db";



const createBooking = async (payload: any) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    //Check customer exists
    const customer = await pool.query(
      `SELECT id FROM users WHERE id=$1`,
      [customer_id]
    );

    if (customer.rows.length === 0) {
      throw new Error("Customer not found");
    }

    //Check vehicle exists
    const vehicle = await pool.query(
      `SELECT * FROM vehicles WHERE id=$1`,
      [vehicle_id]
    );

    if (vehicle.rows.length === 0) {
      throw new Error("Vehicle not found");
    }

    //Check availability
    if (vehicle.rows[0].availability_status === "booked") {
      throw new Error("Vehicle is already booked");
    }

    // Calculate total price
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);

    const diffInMs = end.getTime() - start.getTime();
    const numberOfDays = diffInMs / (1000 * 60 * 60 * 24);

    if (numberOfDays <= 0) {
      throw new Error("End date must be after start date");
    }

    const total_price = numberOfDays * vehicle.rows[0].daily_rent_price;

    // Insert booking
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

    //Update vehicle availability
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


  // Get all bookings 
const getAllBookings=async () => {
  
  const bookingsResult = await pool.query(`
    SELECT id, customer_id, vehicle_id, rent_start_date, rent_end_date, 
           total_price, status
    FROM bookings
    ORDER BY id DESC
  `);

  const bookings = bookingsResult.rows;

  
  const finalData = [];

  for (const booking of bookings) {
   
    const customerRes = await pool.query(
      `SELECT name, email FROM users WHERE id = $1`,
      [booking.customer_id]
    );

    
    const vehicleRes = await pool.query(
      `SELECT vehicle_name, registration_number 
       FROM vehicles WHERE id = $1`,
      [booking.vehicle_id]
    );

    finalData.push({
      ...booking,
      customer: customerRes.rows[0],
      vehicle: vehicleRes.rows[0],
    });
  }

  return finalData;
};



//update booking
const updateBooking = async (bookingId: string, status: string) => {
  
  const bookingData = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingData.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingData.rows[0];

  
  const updated = await pool.query(
    `UPDATE bookings 
     SET status = $1, updated_at = NOW() 
     WHERE id = $2
     RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
    [status, bookingId]
  );

  const updatedBooking = updated.rows[0];

 
  if (status === "cancelled") {
    await pool.query(
      `UPDATE vehicles 
       SET availability_status = 'available' 
       WHERE id = $1`,
      [booking.vehicle_id]
    );
  }

  return updatedBooking;
};



  export const bookingService={
    createBooking,
    getAllBookings,
    updateBooking
  }
