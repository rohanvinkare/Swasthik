import express from "express";
import bodyParser from "body-parser";
import patientRoutes from "./routers/router.patient.js";
import vitalsRoutes from "./routers/router.vitals.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use patient routes
app.use("/patient", patientRoutes);
app.use("/vitals",vitalsRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on PORT:${port}`);
});