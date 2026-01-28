import { Context as HonoContext } from 'hono';

// Extend Hono's Context to include validatedData
declare module 'hono' {
    interface ContextVariableMap {
        validatedData: unknown;
    }
}
