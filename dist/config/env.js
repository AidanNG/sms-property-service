import { logger } from "../utils/logger.js";
import dotenvSafe from "dotenv-safe";
dotenvSafe.config({
    example: ".env.example", // Ensures all required variables exist
    allowEmptyValues: false, // Forces non-empty values for required vars
});
// Centralized env export
export const env = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
    SENDGRID_TO_EMAIL: process.env.SENDGRID_TO_EMAIL,
    ATTOM_API_KEY: process.env.ATTOM_API_KEY,
};
// Log summary (hide sensitive data)
logger.info("Environment variables validated successfully", {
    PORT: env.PORT,
});
