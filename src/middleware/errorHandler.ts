import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

// Custom error interface for better typing
export interface AppError extends Error {
  statusCode?: number;
}

// Centralized error handler
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err); // log full error

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
  });
}