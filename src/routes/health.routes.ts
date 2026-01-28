import { Hono } from 'hono';
import { testConnection } from '../config/database.js';

const healthRoutes = new Hono();

healthRoutes.get('/', async (c) => {
    const dbHealthy = await testConnection();

    const health = {
        status: dbHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
            database: dbHealthy ? 'connected' : 'disconnected',
        },
    };

    return c.json(health, dbHealthy ? 200 : 503);
});

export default healthRoutes;
