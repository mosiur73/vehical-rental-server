import express from "express"
import { bookingController } from "./bookings.controller";
import auth from "../../middleware/auth";

const router= express.Router()

router.post("/",bookingController.createBooking)
router.get("/",auth("admin","customer"),bookingController.getAllBookings)
router.put("/:bookingId",auth("admin","customer"),bookingController.updateBooking )

export const bookingRoute =router;