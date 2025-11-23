import express from "express";
import smsRoutes from "./routes/smsRoutes.js";
import registerRoute from "./routes/register.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use("/sms", smsRoutes);
app.use("/register", registerRoute);

// Error handling middleware
app.use(errorHandler);