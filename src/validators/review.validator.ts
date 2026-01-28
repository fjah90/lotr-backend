import { z } from 'zod';

export const createReviewSchema = z.object({
    movieId: z.string().min(1, 'Movie ID is required'),
    userName: z
        .string()
        .min(2, 'User name must be at least 2 characters')
        .max(100, 'User name must not exceed 100 characters')
        .trim(),
    rating: z
        .number()
        .int('Rating must be an integer')
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must not exceed 5'),
    comment: z
        .string()
        .max(1000, 'Comment must not exceed 1000 characters')
        .trim()
        .optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const updateReviewSchema = z.object({
    rating: z.number().int('Rating must be an integer').min(1).max(5).optional(),
    comment: z.string().max(1000).trim().optional(),
}).refine((data) => data.rating !== undefined || data.comment !== undefined, {
    message: 'At least one field (rating or comment) must be provided',
});

export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;

export const reviewIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/, 'Invalid review ID'),
});

export const getReviewsQuerySchema = z.object({
    movieId: z.string().optional(),
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).max(100).optional(),
});
