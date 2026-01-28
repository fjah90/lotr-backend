import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

export async function testConnection(): Promise<boolean> {
    try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error instanceof Error ? error.message : error);
        return false;
    }
}
