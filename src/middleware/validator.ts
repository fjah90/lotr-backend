import type { Context, Next } from 'hono';
import { ZodSchema } from 'zod';

type ValidationTarget = 'json' | 'query' | 'param';

export const validate = (schema: ZodSchema, target: ValidationTarget = 'json') => {
    return async (c: Context, next: Next) => {
        let data;

        switch (target) {
            case 'json':
                data = await c.req.json();
                break;
            case 'query':
                data = c.req.query();
                break;
            case 'param':
                data = c.req.param();
                break;
        }

        const result = schema.safeParse(data);

        if (!result.success) {
            throw result.error;
        }

        // Store validated data in context for use in route handlers
        c.set('validatedData', result.data);

        await next();
    };
};
