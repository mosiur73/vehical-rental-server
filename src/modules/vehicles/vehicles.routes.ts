import express, { Request, Response } from "express"
import { pool } from "../../config/db";
import { vehicleController } from "./vehicles.controller";
import auth from "../../middleware/auth";


const router= express.Router()

router.post("/",auth("admin"), vehicleController.createVehicle)

router.get("/",vehicleController.getAllVehicle )
router.get("/:vehicleId",vehicleController.getSingleVehicle)
router.put("/:vehicleId",auth("admin"), vehicleController.updateVehicle )
router.delete("/:vehicleId",auth("admin"), vehicleController.deleteVehicle )

export const vehicleRoute =router;