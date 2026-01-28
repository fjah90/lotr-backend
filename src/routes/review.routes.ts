import { Hono } from 'hono';
import { reviewService } from '../services/review.service.js';
import { validate } from '../middleware/validator.js';
import { createReviewSchema } from '../validators/review.validator.js';
import { paginationSchema } from '../validators/query.validator.js';
import { z } from 'zod';

const reviewRoutes = new Hono();

// POST /api/v1/reviews - Create a new review
reviewRoutes.post('/', validate(createReviewSchema, 'json'), async (c) => {
    const data = c.get('validatedData');
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
    const params = c.get('validatedData');
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

export default reviewRoutes;
