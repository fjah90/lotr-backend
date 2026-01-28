# UMIA Dev - Technical Test [Backend]
# Lord of the Rings API

Backend application built with Node.js, Hono.js, and TypeScript that serves as a proxy for The One API and manages movie reviews.

## 🚀 Features

- **Proxy Endpoints**: Access Lord of the Rings movies and characters data
- **Review System**: Create and retrieve movie reviews with validation
- **Type Safety**: Strict TypeScript implementation with Zod validation
- **Error Handling**: Global error middleware with consistent error responses
- **Database**: PostgreSQL for persistent review storage
- **Docker Ready**: Easy setup with Docker Compose

## 📋 Prerequisites

- Node.js >= 18.0.0
- Docker and Docker Compose (recommended)
- PostgreSQL (if not using Docker)
- The One API key from [the-one-api.dev](https://the-one-api.dev)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd lotr-backend
```

### 2. Install dependencies

> **Note**: This project uses **pnpm** as the package manager.

```bash
# Install pnpm globally if you don't have it
npm install -g pnpm

# Install project dependencies
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your The One API key:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://lotr_user:lotr_password@localhost:5432/lotr_db
ONE_API_KEY=your_actual_api_key_here
ONE_API_BASE_URL=https://the-one-api.dev/v2
```

### 4. Database Setup

### Option 1: Local PostgreSQL (Docker)

Start PostgreSQL using Docker:
```bash
docker-compose up -d
```

This will:
- Start PostgreSQL on port 5432
- Automatically create the database and schema
- Set up persistent volumes

Run migrations:
```bash
pnpm db:migrate
```

### Option 2: Supabase (Recommended for Production)

#### Quick Setup (Script-based)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your DATABASE_URL from Settings → Database
3. Update `.env`:
   ```bash
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
4. Run migration:
   ```bash
   pnpm db:migrate
   ```

#### Advanced Setup (Supabase CLI)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize (if not already done):
   ```bash
   supabase init
   ```

3. Link to your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. Push migrations:
   ```bash
   supabase db push
   ```

**Benefits of Supabase CLI:**
- Version-controlled migrations
- Automatic schema diffing
- Rollback capabilities
- Team collaboration

> 💡 **Note**: Migrations are stored in `supabase/migrations/` for CLI approach

### 5. Run the application

**Development mode with hot reload:**
```bash
pnpm dev
```

**Production build:**
```bash
pnpm build
pnpm start
```

The server will start on `http://localhost:3000`

## 📚 API Endpoints

### Health Check
```http
GET /health
```
Returns service health status and database connectivity.

### Movies

**List all movies:**
```http
GET /api/v1/movies
```

Query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Get specific movie:**
```http
GET /api/v1/movies/:id
```

### Characters

**List all characters:**
```http
GET /api/v1/characters
```

Query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Get specific character:**
```http
GET /api/v1/characters/:id
```

### Reviews

**Create a review:**
```http
POST /api/v1/reviews
Content-Type: application/json

{
  "movieId": "5cd95395de30eff6ebccde5c",
  "userName": "John Doe",
  "rating": 5,
  "comment": "Amazing movie!"
}
```

**Get reviews:**
```http
GET /api/v1/reviews?movieId=5cd95395de30eff6ebccde5c
```

Query parameters:
- `movieId` - Filter by movie ID
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Get specific review:**
```http
GET /api/v1/reviews/:id
```

## 🧪 Testing Endpoints

Use the included `api.http` file with REST Client (VS Code) or Insomnia:

1. Install REST Client extension in VS Code
2. Open `api.http`
3. Click "Send Request" above each request

## 🏗️ Project Structure

```
lotr-backend/
├── src/
│   ├── config/          # Configuration (env, database)
│   ├── db/              # Database schema and queries
│   ├── middleware/      # Error handling, validation
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic
│   ├── types/           # TypeScript interfaces
│   ├── validators/      # Zod validation schemas
│   └── index.ts         # Application entry point
├── docker-compose.yml   # Docker configuration
└── package.json        # Dependencies and scripts
```

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ONE_API_KEY` | The One API access token | Yes |
| `ONE_API_BASE_URL` | The One API base URL | Yes |

## 🚢 Deployment

### Option 1: Docker Deployment

Build and run the application container:

```bash
# Build the image
docker build -t lotr-backend .

# Run with docker-compose (includes database)
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Traditional Deployment

1. **Set up PostgreSQL** on your server (or use managed service like Supabase/Neon)
2. **Configure environment** variables for production
3. **Build the application:**
   ```bash
   pnpm build
   ```
4. **Run with a process manager:**
   ```bash
   pnpm add -g pm2
   pm2 start dist/index.js --name lotr-backend
   ```

### Database Migration

For production, run the schema manually:

```bash
psql $DATABASE_URL -f src/db/schema.sql
```

## 🛡️ Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "rating": "Rating must be between 1 and 5"
    }
  }
}
```

Error codes:
- `VALIDATION_ERROR` - Invalid request data
- `API_ERROR` - External API failure
- `DATABASE_ERROR` - Database operation failure
- `NOT_FOUND` - Resource not found
- `INTERNAL_ERROR` - Unexpected server error

## 📝 Development

**Type checking:**
```bash
pnpm type-check
```

**Linting:**
```bash
pnpm lint
```

**Formatting:**
```bash
pnpm format
```

## 📖 Additional Resources

- [Hono.js Documentation](https://hono.dev)
- [The One API Docs](https://the-one-api.dev/documentation)
- [Zod Documentation](https://zod.dev)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 📄 License

MIT
