"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = exports.AppError = void 0;
// Custom error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    let error;
    // If it's already an AppError, use it directly
    if (err instanceof AppError) {
        error = err;
    }
    else {
        // Convert regular errors to AppError
        error = new AppError(err.message || 'Server Error', 500);
    }
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error = new AppError('Resource not found', 404);
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = new AppError(`${field} already exists`, 400);
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((val) => val.message);
        error = new AppError(messages.join(', '), 400);
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new AppError('Invalid token', 401);
    }
    if (err.name === 'TokenExpiredError') {
        error = new AppError('Token expired', 401);
    }
    const response = {
        success: false,
        message: error.message
    };
    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = error.stack;
    }
    res.status(error.statusCode).json(response);
};
exports.errorHandler = errorHandler;
// 404 Not Found middleware
const notFound = (req, res, next) => {
    const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};
exports.notFound = notFound;
//# sourceMappingURL=errorHandler.js.map