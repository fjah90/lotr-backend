import { z } from 'zod';

export const paginationSchema = z.object({
    page: z
        .string()
        .optional()
        .default('1')
        .transform(Number)
        .pipe(z.number().int().min(1, 'Page must be at least 1')),
    limit: z
        .string()
        .optional()
        .default('10')
        .transform(Number)
        .pipe(
            z
                .number()
                .int()
                .min(1, 'Limit must be at least 1')
                .max(100, 'Limit must not exceed 100')
        ),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;
