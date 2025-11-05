import { logger } from "../utils/logger.js";
// Centralized error handler
export function errorHandler(err, req, res, next) {
    logger.error(err); // log full error
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
        timestamp: new Date().toISOString(),
    });
}
