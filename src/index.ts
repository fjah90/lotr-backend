import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from './config/env.js';
import { testConnection } from './config/database.js';
import { errorHandler } from './middleware/error-handler.js';

// Routes
import healthRoutes from './routes/health.routes.js';
import movieRoutes from './routes/movie.routes.js';
import characterRoutes from './routes/character.routes.js';
import reviewRoutes from './routes/review.routes.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Routes
app.route('/health', healthRoutes);
app.route('/api/v1/movies', movieRoutes);
app.route('/api/v1/characters', characterRoutes);
app.route('/api/v1/reviews', reviewRoutes);

// Root endpoint
app.get('/', (c) => {
    return c.json({
        message: 'Lord of the Rings API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            movies: '/api/v1/movies',
            characters: '/api/v1/characters',
            reviews: '/api/v1/reviews',
        },
    });
});

// Global error handler
app.onError(errorHandler);

// Start server
const startServer = async () => {
    console.log('🚀 Starting Lord of the Rings API...\n');

    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
        console.error('❌ Failed to connect to database. Exiting...');
        process.exit(1);
    }

    console.log(`\n🎬 Server running on http://localhost:${env.PORT}`);
    console.log(`📚 Environment: ${env.NODE_ENV}\n`);

    serve({
        fetch: app.fetch,
        port: env.PORT,
    });
};

startServer();
