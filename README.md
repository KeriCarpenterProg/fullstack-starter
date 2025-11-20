# 🚀 Full-Stack Project Manager

![CI/CD Pipeline](https://github.com/KeriCarpenterProg/fullstack-starter/actions/workflows/ci-cd.yml/badge.svg)

A modern, production-ready full-stack application with React, Express, PostgreSQL, and Machine Learning capabilities for intelligent project categorization.

## 🌟 Features

- 🔐 **Secure Authentication** - JWT-based user authentication with bcrypt password hashing
- 📊 **Project Management** - Full CRUD operations for managing projects
- 🤖 **ML-Powered Categorization** - Automatic project categorization using machine learning (Development, Marketing, Design, Research, Operations)
- 🎨 **Modern UI** - Beautiful, responsive React interface with gradient backgrounds
- 🚀 **Production Ready** - Deployed with CI/CD, environment configs, and monitoring
- 🧪 **Tested** - Comprehensive test coverage with Jest and Supertest
- 🐳 **Docker Support** - Containerized ML service for easy deployment
- ⚡ **Fast Development** - Hot reload, Makefile automation, type safety with TypeScript

## 🌐 Live Deployments

- **Frontend**: [Vercel Deployment](https://fullstack-starter-frontend.vercel.app)
- **Backend API**: [Railway Backend](https://endearing-heart-production.up.railway.app/api)
- **ML Service**: [Railway ML Service](https://fullstack-starter-production.up.railway.app)

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

| Document | Description |
|----------|-------------|
| **[Getting Started](./docs/GETTING_STARTED.md)** | Detailed setup instructions, prerequisites, and quick start guide |
| **[API Documentation](./docs/API.md)** | Complete API reference with request/response examples |
| **[Architecture](./docs/ARCHITECTURE.md)** | System design, data flow, and technology stack overview |
| **[Development Guide](./docs/DEVELOPMENT.md)** | Contributing guidelines, code style, and best practices |
| **[Deployment](./docs/DEPLOYMENT.md)** | Production deployment instructions for Railway and Vercel |
| **[Troubleshooting](./docs/TROUBLESHOOTING.md)** | Common issues and their solutions |

## 🛠️ Tech Stack

### Frontend (`client/`)
- **React 19.1** with TypeScript for type-safe UI development
- **Vite 7.1** for lightning-fast builds and hot reload
- **Axios** for HTTP requests
- **React Router** for client-side routing
- **CSS3** with modern gradients and responsive design

### Backend (`server/`)
- **Express 5** with TypeScript
- **Prisma ORM 6.18** for type-safe database access
- **PostgreSQL 15+** database
- **JWT** authentication with 7-day expiration
- **Zod** for runtime validation
- **Jest + Supertest** for integration testing

### ML Service (`ml-service/`)
- **FastAPI 0.104** for high-performance API
- **scikit-learn 1.3** for machine learning
- **Naive Bayes** text classification algorithm
- **TF-IDF** vectorization for feature extraction
- **Docker** containerization

### DevOps & Infrastructure
- **GitHub Actions** - Automated CI/CD pipeline
- **Railway** - Backend API, ML service, and PostgreSQL hosting
- **Vercel** - Frontend hosting with edge network
- **Docker** - ML service containerization

## 🏗️ Project Structure

```
fullstack-starter/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD pipeline
├── client/                     # React frontend
│   ├── src/
│   │   ├── App.tsx            # Main app component with routing
│   │   ├── App.css            # Styling
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Express backend
│   ├── src/
│   │   ├── index.ts           # Express app and ML proxy
│   │   ├── lib/
│   │   │   ├── auth.ts        # JWT middleware
│   │   │   └── db.ts          # Prisma client
│   │   └── routes/
│   │       ├── auth.ts        # Sign up/Sign in
│   │       └── projects.ts    # Project CRUD
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Migration history
│   ├── tests/
│   │   └── api.test.ts        # Integration tests
│   └── package.json
├── ml-service/                 # FastAPI ML service
│   ├── app.py                 # FastAPI application
│   ├── train_model.py         # Model training script
│   ├── category_classifier.pkl # Trained model
│   ├── Dockerfile             # Container config
│   └── requirements.txt
├── docs/                       # Comprehensive documentation
│   ├── GETTING_STARTED.md
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   ├── DEPLOYMENT.md
│   └── TROUBLESHOOTING.md
├── Makefile                    # Development task automation
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Python 3.9+
- Docker (optional, for ML service)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/KeriCarpenterProg/fullstack-starter.git
cd fullstack-starter

# 2. Install all dependencies
make all-install

# 3. Set up environment variables
cd server
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secret

# 4. Run database migrations
npm run migrate

# 5. Optional: Seed with sample data
npm run seed

# 6. Train the ML model
cd ../ml-service
make ml-train

# 7. Start all services
cd ..
make dev-all
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **ML Service**: http://localhost:5002

### Verify Everything Works

```bash
# Check backend health
curl http://localhost:4000/api/health

# Check ML service health
curl http://localhost:5002/health

# Test ML prediction
curl -X POST http://localhost:5002/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"Build a new REST API"}'
```

## 🎯 Available Commands

```bash
# Development
make help              # Show all available commands
make all-install       # Install all dependencies
make dev-all           # Start all services (ML, backend, frontend)
make stop-all          # Stop all services

# Individual services
make dev-server        # Start backend only
make dev-client        # Start frontend only
make ml-run            # Start ML service only

# ML service
make ml-train          # Train/retrain the ML model
make ml-health         # Check ML service health

# Testing
cd server && npm test              # Run backend tests
cd server && npm run test:watch    # Watch mode
cd server && npm run test:coverage # With coverage

# Database
cd server && npm run migrate       # Run migrations
cd server && npm run seed          # Seed database
cd server && npx prisma studio     # Open Prisma Studio GUI
```

## 🔧 Environment Variables

### Backend (`server/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secure-random-string"
PORT=4000
ML_SERVICE_URL="http://localhost:5002"
```

### Frontend (development)
```env
VITE_API_URL="http://localhost:4000"
```

## 📖 Key Features Explained

### Authentication Flow
1. User signs up with email/password
2. Password is hashed with bcrypt
3. JWT token issued with 7-day expiration
4. Token stored in localStorage
5. Protected routes require valid token

### ML-Powered Categorization
1. User types project description
2. Frontend debounces request (500ms)
3. Backend proxies to ML service with timeout/retry
4. ML service predicts category with confidence score
5. Suggestion displayed to user
6. User can accept or override suggestion

### Project Management
- Create projects with title, description, and category
- View all your projects
- Update project details
- Delete projects
- Category suggestions via ML

## 🧪 Testing

### Backend Tests

```bash
cd server
npm test
```

**Test Coverage:**
- ✅ Health check endpoint
- ✅ User signup and signin
- ✅ JWT authentication
- ✅ Protected routes (authorization)
- ✅ Project CRUD operations
- ✅ ML prediction endpoint (mocked)

### Manual Testing

See [API Documentation](./docs/API.md) for curl examples and test workflows.

## 🚢 Deployment

The application is configured for automated deployment:

**On push to `main` branch:**
1. GitHub Actions runs tests
2. Backend deployed to Railway
3. Frontend deployed to Vercel
4. ML service deployed to Railway
5. Health checks verify deployment

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please read the [Development Guide](./docs/DEVELOPMENT.md) before contributing.

**Process:**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Ensure tests pass locally
6. Create a pull request

## 🐛 Troubleshooting

Having issues? Check the [Troubleshooting Guide](./docs/TROUBLESHOOTING.md) for common problems and solutions:

- Database connection errors
- ML service not responding
- Port conflicts
- Authentication issues
- Deployment failures

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with modern web technologies and best practices:
- React team for the amazing framework
- Prisma for excellent DX with databases
- FastAPI for high-performance Python APIs
- Railway and Vercel for reliable hosting

## 📬 Support

- 📖 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/KeriCarpenterProg/fullstack-starter/issues)
- 💬 [Discussions](https://github.com/KeriCarpenterProg/fullstack-starter/discussions)

---

**Built with ❤️ by Keri Carpenter**
