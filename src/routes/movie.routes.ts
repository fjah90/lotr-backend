import { Hono } from 'hono';
import { oneApiService } from '../services/oneapi.service.js';
import { validate } from '../middleware/validator.js';
import { paginationSchema } from '../validators/query.validator.js';
import type { PaginationParams } from '../types/common.types.js';

const movieRoutes = new Hono();

// GET /api/v1/movies - List all movies
movieRoutes.get('/', validate(paginationSchema, 'query'), async (c) => {
    const { page, limit } = c.get('validatedData') as PaginationParams;

    const response = await oneApiService.getMovies(page, limit);

    return c.json({
        success: true,
        data: response.docs,
        pagination: {
            total: response.total,
            page,
            limit,
            pages: response.pages || Math.ceil(response.total / limit),
        },
    });
});

// GET /api/v1/movies/:id - Get specific movie
movieRoutes.get('/:id', async (c) => {
    const id = c.req.param('id');
    const movie = await oneApiService.getMovieById(id);

    return c.json({
        success: true,
        data: movie,
    });
});

export default movieRoutes;
