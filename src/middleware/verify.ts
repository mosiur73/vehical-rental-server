// import { NextFunction, Request, Response } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { secret } from "../modules/auth/auth.service";
// import { pool } from "../database/db";

// const auth = (...roles: ('admin' | 'user')[]) => {  
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization; 
//     if (!token) {
//       throw new Error("You are not authorized");
//     }
//     const decoded = jwt.verify(token, secret) as JwtPayload;
//     const user = await pool.query(
//       `
//       SELECT * FROM users WHERE email=$1
//       `,
//       [decoded.email]
//     );
//     if (user.rows.length === 0) {
//       throw new Error("User not found!");
//     }
//     req.user = decoded;
//     if (roles.length && !roles.includes(decoded.role)) {
//       throw new Error("You are not authorized");
//     }
//     next();
//   };
// };

// export default auth;
