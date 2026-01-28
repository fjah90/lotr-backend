# Supabase Configuration

This project is linked to Supabase project: [YOUR_PROJECT_REF]

## Local Development

To link this project to your Supabase project:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

## Migrations

Migrations are stored in `supabase/migrations/` and are automatically applied when you push to Supabase.

To apply migrations:
```bash
supabase db push
```

## Environment Variables

Make sure to update your `.env` file with your Supabase database URL:
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```
