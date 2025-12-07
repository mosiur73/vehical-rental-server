import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const secret = "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password,phone, role } = payload;

  const hashPassword = await bcrypt.hash(password as string, 12);

  const result = await pool.query(
    `
      INSERT INTO users(name,email,phone,password,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,password,role`,
    [name, email,phone,hashPassword,role]
  );

    delete result.rows[0].password

  return result;
};

const loginUser =async (email:string, password:string)=>{
   const user = await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);
   
   if (user.rows.length === 0) {
    throw new Error("User not found!");
  }
   const matchPassowrd = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPassowrd) {
    throw new Error("Invalid Credentials!");
  }
  
  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role : user.rows[0].role,
  };
   
 const token = jwt.sign(jwtPayload, secret, { expiresIn: "7d" });
 delete user.rows[0].password
 delete user.rows[0].created_at
 delete user.rows[0].updated_at
   return {token,user :user.rows[0]};
}
export const authService ={
    createUser,
    loginUser
}