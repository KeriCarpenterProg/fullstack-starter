# Fullstack Starter - Important Commands

## Prerequisites

- Node.js (with npm or volta)
- Git

## Initial Setup

### 1. Clone and install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

2.  Database Setup
cd server

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with test data
npm run seed

3. Environment Variables

DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=4000

## Development Commands

### Start Backend Server

cd server
npm run dev
# Server runs on http://localhost:4000

### Start Frontend Development Server
cd client
npm run dev
# Client runs on http://localhost:5173

### Run Both (Development)
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev

### API Testing
Test Authentication

# Health check
curl http://localhost:4000/api/health

# Sign up new user
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"User Name"}'

# Sign in existing user
curl -X POST http://localhost:4000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

## Database Commands

cd server

# View database in Prisma Studio
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name migration_name

# Reseed database
npm run seed

### Build for Production
Backend
cd server
npm run build
npm start

Frontend
cd client
npm run build
# Outputs to client/dist/

Project Structure
client - React/Vite frontend
server - Node.js/Express backend
lib - Shared utilities (database, auth)
routes - API endpoints
prisma - Database schema and migrations


This covers all the essential commands for development, testing, and deployment of your fullstack application! 🚀This covers all the essential commands for development, testing, and deployment of your fullstack application! 🚀

Directory Diagram with detailed comments

fullstack-starter/
├── client/                         ← React/Vite frontend application
│   ├── public/                     ← Static assets (favicon, images, etc.)
│   └── src/                        ← React source code
│       └── assets/                 ← Frontend assets (images, icons, styles)
│
└── server/                         ← Node.js/Express backend API
    ├── prisma/                     ← Database schema and migration files
    │   └── migrations/             ← Database version control/schema changes
    │       └── 20251026201140_init/ ← Initial database setup migration
    └── src/                        ← TypeScript server source code
        ├── lib/                    ← ✅ Shared utilities and helpers
        ├── routes/                 ← ✅ API endpoint handlers (auth, projects, etc.)
        └── generated/              ← Auto-generated Prisma client code
            └── prisma/             ← Prisma ORM generated files
                ├── internal/       ← Internal Prisma type definitions
                └── models/         ← Database model types and interfaces
```
