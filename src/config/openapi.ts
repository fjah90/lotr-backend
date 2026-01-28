import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { z } from 'zod';

// Create base app with OpenAPI support
export const createOpenAPIApp = () => {
    const app = new OpenAPIHono();

    // OpenAPI documentation
    app.doc('/api/openapi.json', {
        openapi: '3.0.0',
        info: {
            title: 'Lord of the Rings API',
            version: '1.0.0',
            description: 'Backend API for Lord of the Rings data with review management',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local development server',
            },
        ],
        tags: [
            {
                name: 'Health',
                description: 'Health check endpoints',
            },
            {
                name: 'Movies',
                description: 'Movie data from The One API',
            },
            {
                name: 'Characters',
                description: 'Character data from The One API',
            },
            {
                name: 'Reviews',
                description: 'User reviews for movies',
            },
        ],
    });

    // Swagger UI
    app.get('/api/docs', swaggerUI({ url: '/api/openapi.json' }));

    return app;
};

// Common response schemas
export const ErrorResponseSchema = z.object({
    success: z.boolean(),
    error: z.object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.string(), z.unknown()).optional(),
    }),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.boolean(),
        data: z.array(dataSchema),
        total: z.number(),
        page: z.number(),
        limit: z.number(),
    });
