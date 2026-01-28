import { Hono } from 'hono';
import { reviewService } from '../services/review.service.js';
import { validate } from '../middleware/validator.js';
import { createReviewSchema, updateReviewSchema } from '../validators/review.validator.js';
import { paginationSchema } from '../validators/query.validator.js';
import { z } from 'zod';
import type { CreateReviewDto, ReviewQueryParams, UpdateReviewDto } from '../types/review.types.js';
import { strictRateLimiter } from '../middleware/rate-limit.js';

const reviewRoutes = new Hono();

// POST /api/v1/reviews - Create a new review
reviewRoutes.post('/', strictRateLimiter, validate(createReviewSchema, 'json'), async (c) => {
    const data = c.get('validatedData') as CreateReviewDto;
    const review = await reviewService.createReview(data);

    return c.json(
        {
            success: true,
            data: review,
        },
        201
    );
});

// GET /api/v1/reviews - Get reviews with optional filtering
const reviewQuerySchema = paginationSchema.extend({
    movieId: z.string().optional(),
});

reviewRoutes.get('/', validate(reviewQuerySchema, 'query'), async (c) => {
    const params = c.get('validatedData') as ReviewQueryParams;
    const result = await reviewService.getReviews(params);

    return c.json(result);
});

// GET /api/v1/reviews/:id - Get specific review
reviewRoutes.get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'), 10);

    if (isNaN(id)) {
        return c.json(
            {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid review ID',
                },
            },
            400
        );
    }

    const review = await reviewService.getReviewById(id);

    return c.json({
        success: true,
        data: review,
    });
});

// PATCH /api/v1/reviews/:id - Update review
reviewRoutes.patch('/:id', strictRateLimiter, validate(updateReviewSchema, 'json'), async (c) => {
    const id = parseInt(c.req.param('id'), 10);

    if (isNaN(id)) {
        return c.json(
            {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid review ID',
                },
            },
            400
        );
    }

    const data = c.get('validatedData') as UpdateReviewDto;

    try {
        const updatedReview = await reviewService.updateReview(id, data);
        return c.json({
            success: true,
            data: updatedReview,
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Review not found') {
            return c.json(
                {
                    success: false,
                    error: {
                        code: 'REVIEW_NOT_FOUND',
                        message: 'Review not found',
                    },
                },
                404
            );
        }
        throw error;
    }
});

// DELETE /api/v1/reviews/:id - Delete review
reviewRoutes.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'), 10);

    if (isNaN(id)) {
        return c.json(
            {
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid review ID',
                },
            },
            400
        );
    }

    const deleted = await reviewService.deleteReview(id);

    if (!deleted) {
        return c.json(
            {
                success: false,
                error: {
                    code: 'REVIEW_NOT_FOUND',
                    message: 'Review not found',
                },
            },
            404
        );
    }

    return c.json({
        success: true,
        message: 'Review deleted successfully',
    });
});

export default reviewRoutes;
