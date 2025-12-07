import { Request, Response } from "express";
import { authService } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUser(req.body)
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const loginUser= async (req: Request, res: Response)=>{
     try {
     const result = await authService.loginUser(req.body.email,req.body.password)
    return res.status(201).json({
      success: true,
      message: "Login successful",
      data:result
    });
        
     } catch (error : any) {
        return res.status(500).json({
      success: true,
      message: error.message,
    });
     }
}

export const authController={
    createUser,
    loginUser
}