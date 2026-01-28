# Quick Start Scripts

## Supabase Local Development

### Start Supabase locally
```bash
pnpm supabase:start
```

### Check status
```bash
pnpm supabase:status
```

### Apply migrations
```bash
pnpm supabase:migrate
```

### Stop Supabase
```bash
pnpm supabase:stop
```

## What's Running?

When you run `supabase start`, you get:

- **PostgreSQL**: `localhost:54322`
- **Studio (UI)**: `http://localhost:54323`
- **API**: `http://localhost:54321`
- **Auth**: Built-in authentication
- **Storage**: File storage
- **Realtime**: WebSocket subscriptions

## Workflow

```
1. supabase start          → Starts all services
2. Update .env             → DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
3. pnpm dev                → Run your API
4. Open Studio             → http://localhost:54323
5. supabase stop           → Stop when done
```

## Troubleshooting

**Port conflicts?**
```bash
supabase stop
docker ps  # Check for running containers
```

**Reset database?**
```bash
supabase db reset
```

**Services not starting?**
- Make sure Docker Desktop is running
- Check `supabase status` for details
