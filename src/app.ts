import express from "express";
import dotenv from "dotenv";
import smsRoutes from "./routes/smsRoutes.js";

dotenv.config();

export const app = express();
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use("/sms", smsRoutes);