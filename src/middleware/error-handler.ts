import type { Context } from 'hono';
import { ZodError } from 'zod';
import logger from '../config/logger.js';

// Custom error classes
export class AppError extends Error {
    constructor(
        public code: string,
        public message: string,
        public statusCode: number = 500,
        public details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: Record<string, unknown>) {
        super('VALIDATION_ERROR', message, 400, details);
        this.name = 'ValidationError';
    }
}

export class ApiError extends AppError {
    constructor(message: string, details?: Record<string, unknown>) {
        super('API_ERROR', message, 502, details);
        this.name = 'ApiError';
    }
}

export class DatabaseError extends AppError {
    constructor(message: string, details?: Record<string, unknown>) {
        super('DATABASE_ERROR', message, 500, details);
        this.name = 'DatabaseError';
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super('NOT_FOUND', message, 404);
        this.name = 'NotFoundError';
    }
}

// Global error handler middleware
export const errorHandler = async (err: Error, c: Context) => {
    logger.error({ err }, 'Request error');

    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const details: Record<string, string> = {};
        err.errors.forEach((error) => {
            const path = error.path.join('.');
            details[path] = error.message;
        });

        return c.json(
            {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid input data',
                    details,
                },
            },
            400
        );
    }

    // Handle custom app errors
    if (err instanceof AppError) {
        return c.json(
            {
                success: false,
                error: {
                    code: err.code,
                    message: err.message,
                    details: err.details,
                },
            },
            err.statusCode as 400 | 404 | 500 | 502
        );
    }

    // Handle unknown errors
    return c.json(
        {
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred',
            },
        },
        500
    );
};
