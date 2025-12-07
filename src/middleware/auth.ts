


import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { secret } from "../modules/auth/auth.service";
import { pool } from "../config/db";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

            if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
            }


        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided",
        });
        }

        const token = authHeader.split(" ")[1] as string; 

      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(token, secret) as JwtPayload;
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Invalid or expired token",
        });
      }
      
      const user = await pool.query(
        `SELECT * FROM users WHERE email=$1`,
        [decoded.email]
      );

      if (user.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not found",
        });
      }

      req.user = decoded;
        if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

export default auth;
