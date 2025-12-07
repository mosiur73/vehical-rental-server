import express, { Request, Response , } from "express"
import config from "./config"
import initDB, { pool } from "./config/db"
import { vehicleRoute } from "./modules/vehicles/vehicles.routes"

import { authRoute } from "./modules/auth/auth.routes"
import { usersRoute } from "./modules/users/user.routes"
import { bookingRoute } from "./modules/bookings/bookings.routes"


const app = express()
const port =config.port

//parser
app.use(express.json())
initDB()

app.get('/', (req: Request, res: Response) => {
  res.send('Vehicles rental server is running')
})

//curd
app.use("/api/v1/vehicles", vehicleRoute)
app.use("/api/v1/auth",authRoute)
app.use("/api/v1/users",usersRoute)
app.use("/api/v1/bookings",bookingRoute)


app.listen(port, () => {
  console.log(`server is running  on port ${port}`)
})
