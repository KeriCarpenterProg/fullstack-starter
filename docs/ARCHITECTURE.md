# Architecture Overview

This document provides a high-level overview of the fullstack starter application architecture.

## System Architecture

```
┌─────────────────┐
│                 │
│   Frontend      │
│   (React +      │
│    Vite)        │
│   Port: 5173    │
│                 │
└────────┬────────┘
         │ HTTP/REST
         │ (axios)
         ▼
┌─────────────────┐
│                 │
│   Backend API   │
│   (Express +    │
│    TypeScript)  │
│   Port: 4000    │
│                 │
└────┬───────┬────┘
     │       │
     │       │ HTTP
     │       ▼
     │  ┌────────────────┐
     │  │                │
     │  │  ML Service    │
     │  │  (FastAPI +    │
     │  │   Python)      │
     │  │  Port: 5002    │
     │  │                │
     │  └────────────────┘
     │
     │ Prisma ORM
     ▼
┌─────────────────┐
│                 │
│   PostgreSQL    │
│   Database      │
│   Port: 5432    │
│                 │
└─────────────────┘
```

## Technology Stack

### Frontend (`client/`)

- **Framework:** React 19.1
- **Build Tool:** Vite 7.1
- **Language:** TypeScript 5.9
- **HTTP Client:** Axios 1.13
- **Routing:** React Router DOM 7.9
- **Styling:** CSS (App.css, index.css)

**Key Features:**
- JWT-based authentication
- Protected routes
- ML-powered category suggestions
- Debounced API calls for real-time predictions

### Backend (`server/`)

- **Framework:** Express 5.1
- **Language:** TypeScript 5.9
- **Database ORM:** Prisma 6.18
- **Authentication:** JWT (jsonwebtoken 9.0)
- **Password Hashing:** bcryptjs 3.0
- **Validation:** Zod 4.1
- **Testing:** Jest 30.2 + Supertest 7.1

**Key Features:**
- RESTful API design
- JWT authentication middleware
- Protected route authorization
- ML service proxy with timeout/retry logic
- Database migrations with Prisma
- Comprehensive test coverage

### ML Service (`ml-service/`)

- **Framework:** FastAPI 0.104
- **Server:** Uvicorn 0.24
- **ML Library:** scikit-learn 1.3
- **Data Processing:** pandas 2.1, numpy 1.26
- **Model Persistence:** joblib 1.3

**Key Features:**
- Text classification using Naive Bayes
- TF-IDF vectorization
- RESTful prediction API
- Health check endpoint
- Model persistence for fast startup

### Database

- **Engine:** PostgreSQL 15+
- **ORM:** Prisma (Type-safe database access)
- **Migrations:** Managed by Prisma Migrate

**Schema:**
- `User` - User accounts with authentication
- `Project` - User projects with ML-predicted categories

---

## Application Flow

### 1. User Registration & Authentication

```
User → Frontend → POST /api/auth/signup → Backend
                                          ↓
                                    Hash Password
                                          ↓
                                    Store in DB
                                          ↓
                                   Generate JWT
                                          ↓
Frontend ← JSON (token + user) ← Backend
```

### 2. Creating a Project with ML Prediction

```
User Types Text → Frontend (debounced)
                     ↓
              POST /api/ml/predict-category
                     ↓
                  Backend
                     ↓ (proxy request)
              POST /predict
                     ↓
               ML Service
                     ↓ (predict category)
            Return category + confidence
                     ↓
            Frontend (display suggestion)
                     ↓
       User Confirms/Edits Category
                     ↓
         POST /api/projects (with token)
                     ↓
                  Backend
                     ↓ (validate JWT)
               Verify User
                     ↓
            Save to Database
                     ↓
         Return Created Project
                     ↓
            Frontend (update UI)
```

### 3. Protected Route Access

```
User Request → Frontend
                  ↓
         Check JWT in localStorage
                  ↓
        Include in Authorization Header
                  ↓
         API Request with Bearer Token
                  ↓
              Backend
                  ↓
          Auth Middleware
                  ↓
        Verify & Decode JWT
                  ↓
    ┌─────────────┴─────────────┐
    │                           │
Valid Token              Invalid Token
    │                           │
Continue                   Return 401
to Handler                      │
    │                    Frontend ← Error
Return Data
    │
Frontend ← JSON
```

---

## Security Model

### Authentication

- **Method:** JWT (JSON Web Tokens)
- **Storage:** Client-side (localStorage)
- **Token Expiration:** 7 days
- **Password Hashing:** bcrypt with salt rounds

### Authorization

- **Protected Endpoints:** All `/api/projects` routes
- **Middleware:** Custom `auth` middleware verifies JWT
- **User Context:** Decoded user ID attached to request
- **Row-Level Security:** Users can only access their own projects

### CORS Policy

- **Allowed Origins:**
  - `http://localhost:5173` (development)
  - `*.vercel.app` (production frontend)
- **Credentials:** Enabled for cookie/token support

### Data Validation

- **Backend:** Zod schemas validate all incoming requests
- **Database:** Prisma ensures type safety
- **Frontend:** Form validation before submission

---

## Database Schema

### User Table

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String
  password  String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  projects  Project[]
}
```

### Project Table

```prisma
model Project {
  id          String   @id @default(cuid())
  title       String
  description String?
  category    String   @default("uncategorized")
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([ownerId])
}
```

**Relationships:**
- One User → Many Projects
- Cascade delete: Deleting a user deletes all their projects

---

## ML Service Design

### Model Architecture

**Algorithm:** Multinomial Naive Bayes
- Suitable for text classification
- Fast training and prediction
- Probabilistic output (confidence scores)

**Feature Extraction:** TF-IDF Vectorization
- Converts text to numerical features
- Max 1000 features
- N-gram range: (1, 2) for unigrams and bigrams

### Training Data

Categories and examples:
- **Development:** API endpoints, bug fixes, coding tasks
- **Marketing:** Campaigns, content, SEO
- **Design:** UI/UX, mockups, visual design
- **Research:** Analysis, investigation, benchmarking
- **Operations:** Infrastructure, monitoring, deployment

### Model Persistence

- **Format:** Joblib pickle file
- **Location:** `ml-service/category_classifier.pkl`
- **Loading:** On service startup
- **Retraining:** Run `make ml-train` after updating training data

### Prediction API

**Endpoint:** `/predict`
- **Method:** POST
- **Input:** `{"text": "string"}`
- **Output:** `{"category": "string", "confidence": float}`
- **Timeout:** 4 seconds (backend)
- **Retry:** 1 attempt on failure

---

## Deployment Architecture

### CI/CD Pipeline

**Trigger:** Push to `main` branch

**Jobs:**
1. **test-backend** - Run backend tests with PostgreSQL service
2. **test-frontend** - Build frontend to verify no errors
3. **deploy-backend** - Deploy to Railway using CLI
4. **deploy-frontend** - Deploy to Vercel using CLI
5. **deploy-ml-service** - Deploy to Railway using CLI
6. **post-deploy-verification** - Health checks on all services

### Production Environments

**Backend:** Railway
- Automatic deployments from main
- Environment variables configured
- PostgreSQL addon attached
- Health endpoint: `/api/health`

**Frontend:** Vercel
- Automatic deployments from main
- Environment variables for API URL
- CDN distribution
- HTTPS enabled

**ML Service:** Railway
- Dockerfile-based deployment
- Model included in container
- Health endpoint: `/health`
- Port: 5002

### Environment Variables

**Backend (Railway):**
```
DATABASE_URL - PostgreSQL connection string (auto-set by Railway)
JWT_SECRET - Secure random string
ML_SERVICE_URL - https://fullstack-starter-production.up.railway.app
PORT - 4000 (auto-set by Railway)
```

**Frontend (Vercel):**
```
VITE_API_URL - https://endearing-heart-production.up.railway.app
```

---

## Development Workflow

### Local Development

1. **Start ML Service:** `make ml-run` (port 5002)
2. **Start Backend:** `make dev-server` (port 4000)
3. **Start Frontend:** `make dev-client` (port 5173)

Or use `make dev-all` to start everything at once.

### Testing

**Backend Tests:**
```bash
cd server
npm test
```

Tests include:
- Health check
- Authentication (signup, signin)
- Protected routes
- Project CRUD operations
- ML prediction proxy

**Test Environment:**
- In-memory PostgreSQL or test database
- Mocked ML service responses
- JWT secrets for testing only

### Database Migrations

**Create Migration:**
```bash
cd server
npx prisma migrate dev --name description_of_change
```

**Apply in Production:**
```bash
npx prisma migrate deploy
```

**Reset Database (Dev Only):**
```bash
npx prisma migrate reset
```

---

## Performance Considerations

### Backend

- **Connection Pooling:** Prisma manages PostgreSQL connections
- **ML Request Timeout:** 4 seconds to prevent long waits
- **ML Request Retry:** Single retry on failure
- **JWT Verification:** Fast symmetric key validation

### Frontend

- **Debounced ML Requests:** 500ms delay to reduce API calls
- **Lazy Loading:** Consider code splitting for larger apps
- **Asset Optimization:** Vite handles bundling and minification

### ML Service

- **Model Preloading:** Model loaded on startup, not per request
- **Fast Inference:** Naive Bayes is computationally efficient
- **Stateless Design:** Each request is independent

---

## Scalability

### Current Limitations

- Single instance of each service
- No caching layer
- No rate limiting
- Synchronous ML predictions

### Future Improvements

- **Load Balancing:** Multiple backend/ML instances
- **Caching:** Redis for frequently accessed data
- **Async ML:** Queue-based predictions for batch processing
- **Database Optimization:** Read replicas, indexing strategies
- **Rate Limiting:** Prevent abuse and ensure fair usage
- **Monitoring:** Application performance monitoring (APM)
- **Logging:** Centralized logging (e.g., Datadog, LogRocket)

---

## Error Handling

### Backend

- **Validation Errors:** 400 Bad Request with Zod error details
- **Authentication Errors:** 401 Unauthorized
- **Authorization Errors:** 404 Not Found (don't reveal existence)
- **Server Errors:** 500 Internal Server Error (logged, generic message to client)
- **ML Service Errors:** 503 Service Unavailable

### Frontend

- **Network Errors:** Display user-friendly messages
- **Authentication Errors:** Redirect to login
- **Validation Errors:** Show inline form errors

### ML Service

- **Invalid Input:** 400 Bad Request
- **Model Not Loaded:** 503 Service Unavailable
- **Prediction Errors:** 500 Internal Server Error

---

## Monitoring and Observability

### Health Checks

- **Backend:** `GET /api/health` → `{ok: true}`
- **ML Service:** `GET /health` → `{status: "healthy", model_loaded: true}`

### Logging

- **Backend:** Console logs for development, structured logs for production
- **ML Service:** FastAPI request/response logging
- **Frontend:** Console errors, consider error tracking service

### Metrics (Future)

- Request duration
- Error rates
- ML prediction confidence distribution
- User activity patterns
