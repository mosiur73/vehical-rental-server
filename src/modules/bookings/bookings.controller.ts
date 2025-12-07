import { Request, Response } from "express";
import { bookingService } from "./bookings.service";


 const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.createBooking(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found",
      });
    }

    const bookings = await bookingService.getAllBookings(user);

    const message =
      user.role === "admin"
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully";

    res.status(200).json({
      success: true,
      message,
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingController={
    createBooking,
    getAllBookings
}