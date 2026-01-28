import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import logger from '../src/config/logger.js';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
    // Get database URL from environment
    const DATABASE_URL = process.env.DATABASE_URL;

    if (!DATABASE_URL) {
        logger.error('DATABASE_URL environment variable is required');
        process.exit(1);
    }

    logger.info('🔄 Starting database migration...\n');

    const pool = new Pool({
        connectionString: DATABASE_URL,
    });

    try {
        // Test connection
        const client = await pool.connect();
        logger.info('✅ Database connection successful');
        client.release();

        // Read schema file
        const schemaPath = join(__dirname, '../src/db/schema.sql');
        const schema = readFileSync(schemaPath, 'utf-8');

        logger.info('📄 Read schema file: src/db/schema.sql');

        // Execute schema
        await pool.query(schema);

        logger.info('✅ Schema applied successfully\n');
        logger.info('📊 Tables created:');
        logger.info('   - reviews (with indexes and triggers)');

        process.exit(0);
    } catch (error) {
        logger.error({ err: error }, '❌ Migration failed');
        process.exit(1);
    } finally {
        await pool.end();
    }
}

runMigration();
