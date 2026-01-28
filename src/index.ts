import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { pinoLogger } from 'hono-pino';
import { swaggerUI } from '@hono/swagger-ui';
import appLogger from './config/logger.js';
import { env } from './config/env.js';
import { testConnection } from './config/database.js';
import { errorHandler } from './middleware/error-handler.js';
import { generalRateLimiter } from './middleware/rate-limit.js';

// Routes
import healthRoutes from './routes/health.routes.js';
import movieRoutes from './routes/movie.routes.js';
import characterRoutes from './routes/character.routes.js';
import reviewRoutes from './routes/review.routes.js';

const app = new Hono();

// Middleware
app.use('*', pinoLogger({ pino: appLogger as any }));
app.use('*', secureHeaders());
app.use(
    '*',
    cors({
        origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
        credentials: true,
    })
);
app.use('*', generalRateLimiter);

// Routes
app.route('/health', healthRoutes);
app.route('/api/v1/movies', movieRoutes);
app.route('/api/v1/characters', characterRoutes);
app.route('/api/v1/reviews', reviewRoutes);

// API Documentation
app.get(
    '/api/docs',
    swaggerUI({
        url: '/api/openapi.json',
    })
);

app.get('/api/openapi.json', (c) => {
    return c.json({
        openapi: '3.0.0',
        info: {
            title: 'Lord of the Rings API',
            version: '1.0.0',
            description: 'Backend API for LOTR data with review management. Proxy for The One API with custom review functionality.',
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}`,
                description: 'Local development',
            },
        ],
        tags: [
            { name: 'Health', description: 'Health check' },
            { name: 'Movies', description: 'Movie data from The One API' },
            { name: 'Characters', description: 'Character data from The One API' },
            { name: 'Reviews', description: 'User reviews for movies' },
        ],
        paths: {
            '/health': {
                get: {
                    tags: ['Health'],
                    summary: 'Health check',
                    responses: {
                        '200': {
                            description: 'Service is healthy',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            status: { type: 'string', example: 'ok' },
                                            timestamp: { type: 'string' },
                                            uptime: { type: 'number' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '/api/v1/movies': {
                get: {
                    tags: ['Movies'],
                    summary: 'Get all movies',
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
                    ],
                    responses: {
                        '200': {
                            description: 'List of movies',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            data: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: { type: 'string' },
                                                        name: { type: 'string' },
                                                        runtimeInMinutes: { type: 'number' },
                                                        budgetInMillions: { type: 'number' },
                                                        boxOfficeRevenueInMillions: { type: 'number' },
                                                        academyAwardNominations: { type: 'number' },
                                                        academyAwardWins: { type: 'number' },
                                                        rottenTomatoesScore: { type: 'number' },
                                                    },
                                                },
                                            },
                                            total: { type: 'number' },
                                            page: { type: 'number' },
                                            limit: { type: 'number' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '/api/v1/characters': {
                get: {
                    tags: ['Characters'],
                    summary: 'Get all characters',
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
                    ],
                    responses: {
                        '200': {
                            description: 'List of characters',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            data: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        _id: { type: 'string' },
                                                        name: { type: 'string' },
                                                        height: { type: 'string' },
                                                        race: { type: 'string' },
                                                        gender: { type: 'string' },
                                                        birth: { type: 'string' },
                                                        death: { type: 'string' },
                                                    },
                                                },
                                            },
                                            total: { type: 'number' },
                                            page: { type: 'number' },
                                            limit: { type: 'number' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            '/api/v1/reviews': {
                get: {
                    tags: ['Reviews'],
                    summary: 'Get reviews',
                    parameters: [
                        { name: 'movieId', in: 'query', schema: { type: 'string' } },
                        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                        { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
                    ],
                    responses: {
                        '200': {
                            description: 'List of reviews',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            data: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        id: { type: 'string' },
                                                        movieId: { type: 'string' },
                                                        userName: { type: 'string' },
                                                        rating: { type: 'integer', minimum: 1, maximum: 5 },
                                                        comment: { type: 'string' },
                                                        createdAt: { type: 'string', format: 'date-time' },
                                                    },
                                                },
                                            },
                                            total: { type: 'number' },
                                            page: { type: 'number' },
                                            limit: { type: 'number' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                post: {
                    tags: ['Reviews'],
                    summary: 'Create a review',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['movieId', 'userName', 'rating'],
                                    properties: {
                                        movieId: { type: 'string', description: 'Movie ID from The One API' },
                                        userName: { type: 'string', minLength: 3, maxLength: 100 },
                                        rating: { type: 'integer', minimum: 1, maximum: 5 },
                                        comment: { type: 'string', maxLength: 1000 },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        '201': {
                            description: 'Review created',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            data: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'string' },
                                                    movieId: { type: 'string' },
                                                    userName: { type: 'string' },
                                                    rating: { type: 'integer' },
                                                    comment: { type: 'string' },
                                                    createdAt: { type: 'string' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        '429': {
                            description: 'Rate limit exceeded',
                        },
                    },
                },
            },
        },
    });
});

// Root endpoint
app.get('/', (c) => {
    return c.json({
        message: 'Lord of the Rings API',
        version: '1.0.0',
        documentation: `http://localhost:${env.PORT}/api/docs`,
        endpoints: {
            health: '/health',
            movies: '/api/v1/movies',
            characters: '/api/v1/characters',
            reviews: '/api/v1/reviews',
            docs: '/api/docs',
            openapi: '/api/openapi.json',
        },
    });
});

// Global error handler
app.onError(errorHandler);

// Start server
const startServer = async () => {
    appLogger.info('🚀 Starting Lord of the Rings API...\n');

    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
        appLogger.error('❌ Failed to connect to database. Exiting...');
        process.exit(1);
    }

    appLogger.info(`\n🎬 Server running on http://localhost:${env.PORT}`);
    appLogger.info(`📚 Environment: ${env.NODE_ENV}\n`);

    serve({
        fetch: app.fetch,
        port: env.PORT,
        hostname: '0.0.0.0'
    });
};

startServer();
