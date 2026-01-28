import pino from 'pino';
import { env } from './env.js';

const isDevelopment = env.NODE_ENV === 'development';

export const logger = pino({
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: isDevelopment
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },
});

export default logger;
