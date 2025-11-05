import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize, errors } = format;
// Custom log format for console
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return stack
        ? `${timestamp} [${level}]: ${stack}` // print stack trace if error
        : `${timestamp} [${level}]: ${message}`;
});
export const logger = createLogger({
    level: "info", // default level
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), logFormat),
    transports: [
        new transports.Console({
            format: combine(colorize(), logFormat),
        }),
        // Optional: you can add file transports for error and combined logs
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/combined.log" }),
    ],
});
// Example usage:
// logger.info("Server started");
// logger.error(new Error("Something failed"));
