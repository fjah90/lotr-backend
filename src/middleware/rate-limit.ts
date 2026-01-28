import { rateLimiter } from 'hono-rate-limiter';
import type { Context } from 'hono';

// General rate limiter: 100 requests per 15 minutes
export const generalRateLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Max 100 requests per window
    standardHeaders: 'draft-6', // Return standard rate limit headers
    keyGenerator: (c: Context) => {
        // Use IP address as the key
        return c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    },
    handler: (c: Context) => {
        return c.json(
            {
                success: false,
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: 'Too many requests. Please try again later.',
                    details: {
                        retryAfter: '15 minutes',
                    },
                },
            },
            429
        );
    },
});

// Strict rate limiter for POST endpoints: 10 requests per 15 minutes
export const strictRateLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // Max 10 requests per window
    standardHeaders: 'draft-6',
    keyGenerator: (c: Context) => {
        return c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    },
    handler: (c: Context) => {
        return c.json(
            {
                success: false,
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: 'Too many requests. Please try again later.',
                    details: {
                        retryAfter: '15 minutes',
                        limit: '10 requests per 15 minutes',
                    },
                },
            },
            429
        );
    },
});
