# 🎬 LOTR Backend API - Prueba Técnica

> **Backend API para el universo de El Señor de los Anillos**  
> Desarrollado con Node.js, Hono.js, TypeScript y PostgreSQL (Supabase)

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación con Docker](#-instalación-con-docker)
- [Instalación Manual](#-instalación-manual-desarrollo)
- [Documentación API (Swagger)](#-documentación-api-swagger)
- [Colección Postman](#-colección-postman)
- [Endpoints](#-endpoints)
- [Variables de Entorno](#-variables-de-entorno)

---

## 📖 Descripción

Backend que actúa como **proxy** para [The One API](https://the-one-api.dev) e implementa un sistema CRUD para **reseñas de películas**.

### Funcionalidades:

- ✅ **Películas**: Proxy a The One API
- ✅ **Personajes**: Proxy a The One API  
- ✅ **Reseñas (CRUD)**: Create, Read, Update, Delete
- ✅ **Validación**: Zod + TypeScript estricto (sin `any`)
- ✅ **Seguridad**: Rate limiting, headers seguros, sanitización XSS

---

## 🛠 Tecnologías

| Tecnología | Versión |
|------------|---------|
| Node.js | >= 18 |
| TypeScript | 5.x (strict) |
| Hono.js | 4.x |
| PostgreSQL | 17 (Supabase) |
| Docker | - |

---

## ⚙️ Requisitos Previos

- **Docker Desktop** instalado y corriendo
- **Node.js >= 18** y **pnpm**
- API Key de [The One API](https://the-one-api.dev) (registro gratuito)

---

## 🐳 Instalación con Docker

### 1. Clonar y configurar

```bash
git clone <URL_DEL_REPOSITORIO>
cd lotr-backend
pnpm install
cp .env.example .env
```

Editar `.env` y agregar tu API Key:

```env
ONE_API_KEY=tu_api_key_aqui
```

### 2. Iniciar Supabase (Base de Datos)

```bash
npx supabase start
```

Esto levanta PostgreSQL en el puerto `54322` y ejecuta las migraciones automáticamente.

### 3. Iniciar el Backend con Docker

```bash
docker-compose up -d --build
```

### 4. Verificar

```bash
# Estado de contenedores
docker-compose ps

# Probar API
curl http://localhost:3000/health
```

### Comandos útiles

```bash
# Ver logs del backend
docker-compose logs -f api

# Detener backend
docker-compose down

# Detener todo (incluyendo Supabase)
docker-compose down && npx supabase stop
```

---

## 💻 Instalación Manual (Desarrollo)

Para desarrollo local con hot reload:

```bash
# Instalar dependencias
pnpm install

# Iniciar Supabase
npx supabase start

# Ejecutar migraciones (primera vez)
npx supabase db push

# Iniciar servidor con hot reload
pnpm dev
```

---

## 📚 Documentación API (Swagger)

Una vez el servidor esté corriendo, accede a la documentación interactiva:

**🔗 URL: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

---

## 📬 Colección Postman

Importa la colección preconfigurada:

1. Abre **Postman**
2. Click **Import**
3. Selecciona: `docs/postman_collection.json`

---

## 📍 Endpoints

### Health
```http
GET /health
```

### Películas
```http
GET /api/v1/movies
GET /api/v1/movies/:id
```

### Personajes
```http
GET /api/v1/characters
GET /api/v1/characters/:id
```

### Reseñas (CRUD)
```http
POST   /api/v1/reviews          # Crear
GET    /api/v1/reviews          # Listar
GET    /api/v1/reviews/:id      # Obtener
PATCH  /api/v1/reviews/:id      # Actualizar
DELETE /api/v1/reviews/:id      # Eliminar
```

---

## 🔐 Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `PORT` | Puerto del servidor | No (default: 3000) |
| `DATABASE_URL` | URL PostgreSQL | ✅ Sí |
| `ONE_API_KEY` | API Key de The One API | ✅ Sí |

---

## 📁 Estructura

```
lotr-backend/
├── src/
│   ├── config/        # Configuración
│   ├── middleware/    # Middlewares
│   ├── routes/        # Rutas API
│   ├── services/      # Lógica de negocio
│   └── validators/    # Esquemas Zod
├── supabase/
│   ├── config.toml    # Config de Supabase
│   └── migrations/    # Migraciones SQL
├── docs/
│   └── postman_collection.json
├── docker-compose.yml # Solo backend
└── Dockerfile
```

---

MIT


---

## 🚀 Despliegue

*(Pendiente de definir servicio gratuito)*

