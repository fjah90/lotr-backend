import pg from 'pg';
import { env } from './env.js';
import logger from './logger.js';

const { Pool } = pg;

export const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

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
