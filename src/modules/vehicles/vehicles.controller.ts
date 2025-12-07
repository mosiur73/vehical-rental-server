import { Request, Response } from "express"
import { pool } from "../../config/db"
import { vehicleService } from "./vehicles.service";


const createVehicle=async (req : Request, res: Response) =>{
  const {vehicle_name,type,registration_number,daily_rent_price,availability_status}= req.body;
    try {
    const result =await vehicleService.createVehicle(vehicle_name,type,registration_number,daily_rent_price,availability_status)
    // console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (error :any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const getAllVehicle=async(req : Request, res : Response) =>{
  try {
    const result =await vehicleService.getVehicle()
    res.status(200).json({
      success : true,
      message : "Vehicles retrieved successfully",
      data : result.rows,
    })
    
  } catch (error: any) {
     res.status(500).json({
      success :false,
      message : "No vehicles found",
      details :error
     })
  }
}

const getSingleVehicle=async(req : Request,   res: Response) =>{
  try {
    const result =await vehicleService.getSingleVehicle(req.params.vehicleId as string)
    if(result.rows.length ===0){
      res.status(404).json({
        success :false,
        message : "Vehicle not found"
      })
    }else{
      res.status(200).json({
         success : true,
      message : "Vehicle retrieved successfully",
      data : result.rows,
      })
    }    
  } catch (error: any) {
     res.status(500).json({
      success :false,
      message :error.message,
      details :error
     })
  }
}

const updateVehicle= async (req: Request, res: Response) => {
 
   const {vehicle_name,type,registration_number,daily_rent_price,availability_status}= req.body;

  try {
    const result = await vehicleService.updateVehicle(vehicle_name,type,registration_number,daily_rent_price,availability_status,req.params.vehicleId!)

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const deleteVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  try {
    const result = await vehicleService.deleteVehicle(vehicleId!)
     if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
      res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const vehicleController={
    createVehicle,
    getAllVehicle,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
}