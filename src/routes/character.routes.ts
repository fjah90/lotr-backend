import { Hono } from 'hono';
import { oneApiService } from '../services/oneapi.service.js';
import { validate } from '../middleware/validator.js';
import { paginationSchema } from '../validators/query.validator.js';
import type { PaginationParams } from '../types/common.types.js';

const characterRoutes = new Hono();

// GET /api/v1/characters - List all characters
characterRoutes.get('/', validate(paginationSchema, 'query'), async (c) => {
    const { page, limit } = c.get('validatedData') as PaginationParams;

    const response = await oneApiService.getCharacters(page, limit);

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

// GET /api/v1/characters/:id - Get specific character
characterRoutes.get('/:id', async (c) => {
    const id = c.req.param('id');
    const character = await oneApiService.getCharacterById(id);

    return c.json({
        success: true,
        data: character,
    });
});

export default characterRoutes;
