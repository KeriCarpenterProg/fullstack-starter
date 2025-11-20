# Getting Started

This guide will help you set up and run the fullstack starter project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/download/)
- **Python** (v3.9 or higher) - [Download](https://www.python.org/downloads/)
- **Docker** (optional, for ML service) - [Download](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download](https://git-scm.com/downloads)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/KeriCarpenterProg/fullstack-starter.git
cd fullstack-starter
```

### 2. Install All Dependencies

Use the Makefile to install all dependencies at once:

```bash
make all-install
```

This will:
- Install backend dependencies (`server/`)
- Install frontend dependencies (`client/`)
- Create Python virtual environment and install ML service dependencies (`ml-service/`)

### 3. Set Up Environment Variables

#### Backend Environment

1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and configure your settings:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   JWT_SECRET="your-secure-random-string-here"
   PORT=4000
   ML_SERVICE_URL="http://localhost:5002"
   ```

   **Important:**
   - Replace `username`, `password`, and `database_name` with your PostgreSQL credentials
   - Generate a secure random string for `JWT_SECRET` (e.g., using `openssl rand -base64 32`)

### 4. Set Up the Database

1. Create your PostgreSQL database:
   ```bash
   createdb your_database_name
   ```

2. Run database migrations:
   ```bash
   cd server
   npm run migrate
   ```

3. (Optional) Seed the database with sample data:
   ```bash
   npm run seed
   ```

### 5. Train the ML Model

Before running the ML service, you need to train the classification model:

```bash
make ml-train
```

This will create a `category_classifier.pkl` file in the `ml-service/` directory.

### 6. Start All Services

#### Option A: Using Makefile (Recommended)

Start all services with one command:

```bash
make dev-all
```

This starts:
- ML service on port 5002
- Backend server on port 4000
- Frontend client on port 5173

#### Option B: Manual Start (Separate Terminals)

**Terminal 1 - ML Service:**
```bash
make ml-run
```

**Terminal 2 - Backend:**
```bash
make dev-server
```

**Terminal 3 - Frontend:**
```bash
make dev-client
```

### 7. Access the Application

Once all services are running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000
- **ML Service:** http://localhost:5002

## Verify Installation

### Test Backend Health

```bash
curl http://localhost:4000/api/health
```

Expected response:
```json
{"ok": true}
```

### Test ML Service Health

```bash
curl http://localhost:5002/health
```

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Test ML Prediction

```bash
curl -X POST http://localhost:5002/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Build a new API endpoint"}'
```

Expected response:
```json
{
  "category": "Development",
  "confidence": 0.95
}
```

## Common Issues

### Database Connection Error

If you see `ECONNREFUSED` or database connection errors:

1. Ensure PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verify your `DATABASE_URL` in `server/.env`

3. Check that the database exists:
   ```bash
   psql -l
   ```

### ML Service Not Found

If the backend can't connect to the ML service:

1. Ensure the ML service is running on port 5002
2. Verify `ML_SERVICE_URL` is set correctly in `server/.env`
3. Check that the model file exists: `ml-service/category_classifier.pkl`

### Port Already in Use

If you see "port already in use" errors:

```bash
make stop-all
```

This will kill processes on ports 4000, 5002, and 5173.

## Next Steps

- Read the [API Documentation](./API.md) to understand available endpoints
- Check out [Architecture Overview](./ARCHITECTURE.md) to understand the system design
- See [Development Guide](./DEVELOPMENT.md) for contribution guidelines
- Review [Deployment Guide](./DEPLOYMENT.md) for production deployment

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Review closed issues on GitHub
3. Open a new issue with detailed error messages and steps to reproduce
