import pg from 'pg';
import { logger } from './logger.js';

// Database configuration - Supabase local development
const config: pg.PoolConfig = {
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'postgres',
    port: 54322,  // Supabase local port
};

logger.info({ config: { ...config, password: '***' } }, 'Database configuration');

export const pool = new pg.Pool(config);

export async function testConnection(): Promise<boolean> {
    try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        logger.info('✅ Database connection successful');
        return true;
    } catch (error) {
        logger.error({ err: error }, '❌ Database connection failed');
        return false;
    }
}
