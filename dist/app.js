import express from "express";
import smsRoutes from "./routes/smsRoutes.js";
import registerRoute from "./routes/register.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";
export const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// Register routes
app.use("/sms", smsRoutes);
app.use("/api/register", registerRoute);
// Error handling middleware
app.use(errorHandler);
