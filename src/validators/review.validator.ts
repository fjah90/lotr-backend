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
