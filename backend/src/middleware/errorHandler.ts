import { Request, Response, NextFunction } from 'express';

// Error response interface
interface ErrorResponse {
    success: false;
    message: string;
    errors?: any[];
    stack?: string;
}

// Custom error class
export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Global error handler middleware
export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let error: AppError;

    // If it's already an AppError, use it directly
    if (err instanceof AppError) {
        error = err;
    } else {
        // Convert regular errors to AppError
        error = new AppError(err.message || 'Server Error', 500);
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error = new AppError('Resource not found', 404);
    }

    // Mongoose duplicate key
    if ((err as any).code === 11000) {
        const field = Object.keys((err as any).keyValue)[0];
        error = new AppError(`${field} already exists`, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values((err as any).errors).map((val: any) => val.message);
        error = new AppError(messages.join(', '), 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new AppError('Invalid token', 401);
    }

    if (err.name === 'TokenExpiredError') {
        error = new AppError('Token expired', 401);
    }

    const response: ErrorResponse = {
        success: false,
        message: error.message
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = error.stack;
    }

    res.status(error.statusCode).json(response);
};

// 404 Not Found middleware
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};
