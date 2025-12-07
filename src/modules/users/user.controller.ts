import { Request, Response } from "express";
import { userService } from "./user.service";


const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers()
    return res.status(201).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};


//update user
const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const payload = req.body;
    const currentUser = req.user; 

    const updatedUser = await userService.updateUser(userId,payload,currentUser);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//delete user
const deleteUser =async (req: Request, res: Response) => {
  await userService.deleteUser(Number(req.params.userId));
  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
}


export const userController ={
    getAllUser,
    updateUser,
    deleteUser
}