import { pool } from "../../config/db";


const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users ORDER BY id`
  );
  return result;
};

const updateUser = async (
  userId: number,
  payload: Record<string, unknown>,
  currentUser: any
) => {
  // 1. Check: Admin can update anyone, User can update only own profile
  if (currentUser.role !== "admin" && currentUser.id != userId) {
    throw new Error("You are not allowed to update another user's profile");
  }

  // 2. Filter only fields that are provided
  const allowedFields = ["name", "email", "phone", "role"];
  const updates: string[] = [];
  const values: any[] = [];

  let index = 1;

  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      updates.push(`${key} = $${index}`);
      values.push(payload[key]);
      index++;
    }
  }

  if (updates.length === 0) {
    throw new Error("No fields provided for update");
  }

  values.push(userId); // id → last param

  const query = `
      UPDATE users 
      SET ${updates.join(", ")},
      updated_at = NOW()
      WHERE id = $${index}
      RETURNING id, name, email, phone, role
  `;

  const result = await pool.query(query, values);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

const deleteUser = async (userId: number) => {
  // Check active bookings
  const activeUser = await pool.query(
    `SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [userId]
  );

  if (activeUser.rows.length > 0) {
    throw new Error('Cannot delete user with active bookings');
  }

  const result = await pool.query(
    'DELETE FROM users WHERE id = $1 RETURNING id',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return { message: 'User deleted successfully' };
};


export const userService ={
    getAllUsers,
    updateUser,
    deleteUser
}