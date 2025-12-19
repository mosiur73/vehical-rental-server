Project Name : vehical-rental-server
Live API Base URL: https://rental-server-sand.vercel.app/

Features
👥 User Management

User registration & secure login with JWT

Password hashing using bcrypt

Role-based permissions: admin, customer

Update user (Admin or Own profile)

Delete user (Only admin & only when no active bookings)

🚗 Vehicle Management

Add new vehicles

Update vehicle details (price, status, info)

Delete vehicle (only if no active bookings)

View all vehicles & single vehicle

📅 Booking Management

Create a new booking
Auto price calculation
Vehicle auto status update


Technology Stack
Backend
Node.js
Express.js
TypeScript
PostgreSQL
pg (node-postgres)
JWT Authentication
bcrypt.js
REST API Architecture

Other Tools
Postman
dotenv
NeonDB

Installation & Setup
✔️ 1. Clone the repository
git clone https://github.com/mosiur73/vehical-rental-server
cd your-repo

✔️ 2. Install dependencies
npm install

✔️ 3. Create .env file
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key

4. Start developer server
npm run dev
