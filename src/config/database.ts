import pg from 'pg';
import { env } from './env.js';
import { logger } from './logger.js';

// Database configuration
const config: pg.PoolConfig = {
    connectionString: env.DATABASE_URL,
};

// Log config (masking password if present in connection string)
const safeConfig = { ...config, connectionString: '***' };
logger.info({ config: safeConfig }, 'Database configuration');

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
