# API Documentation

This document describes all available API endpoints in the fullstack starter application.

**Base URL (Development):** `http://localhost:4000`

## Table of Contents

- [Authentication](#authentication)
- [Projects](#projects)
- [ML Prediction](#ml-prediction)
- [Debug Endpoints](#debug-endpoints)

---

## Authentication

All authentication endpoints return a JWT token that must be included in subsequent requests to protected endpoints.

### Sign Up

Create a new user account.

**Endpoint:** `POST /api/auth/signup`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cmi7zaqka0001u95g5zuqg3z2",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-11-20T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid input data
- `409 Conflict` - Email already exists

---

### Sign In

Authenticate an existing user.

**Endpoint:** `POST /api/auth/signin`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cmi7zaqka0001u95g5zuqg3z2",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-11-20T10:30:00.000Z"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Missing email or password

---

## Projects

All project endpoints require authentication. Include the JWT token in the `Authorization` header:

```
Authorization: Bearer <your-token-here>
```

### List Projects

Get all projects owned by the authenticated user.

**Endpoint:** `GET /api/projects`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
[
  {
    "id": "cmi7zaqka0001u95g5zuqg3z2",
    "title": "My Project",
    "description": "A sample project",
    "category": "Development",
    "ownerId": "cmhdpzkce0000u9h92xr2wl4s",
    "createdAt": "2025-11-20T10:30:00.000Z",
    "updatedAt": "2025-11-20T10:30:00.000Z"
  }
]
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token

---

### Get Project by ID

Retrieve a specific project by its ID.

**Endpoint:** `GET /api/projects/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
{
  "id": "cmi7zaqka0001u95g5zuqg3z2",
  "title": "My Project",
  "description": "A sample project",
  "category": "Development",
  "ownerId": "cmhdpzkce0000u9h92xr2wl4s",
  "createdAt": "2025-11-20T10:30:00.000Z",
  "updatedAt": "2025-11-20T10:30:00.000Z"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Project not found or user doesn't own it

---

### Create Project

Create a new project.

**Endpoint:** `POST /api/projects`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "New Project",
  "description": "Optional description",
  "category": "Development"
}
```

**Fields:**

- `title` (required) - Project title (min 1 character)
- `description` (optional) - Project description
- `category` (optional) - Project category (defaults to "uncategorized")

**Response:** `201 Created`

```json
{
  "id": "cmi7zaqka0001u95g5zuqg3z2",
  "title": "New Project",
  "description": "Optional description",
  "category": "Development",
  "ownerId": "cmhdpzkce0000u9h92xr2wl4s",
  "createdAt": "2025-11-20T10:30:00.000Z",
  "updatedAt": "2025-11-20T10:30:00.000Z"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token
- `400 Bad Request` - Invalid input data (e.g., missing title)

---

### Update Project

Update an existing project.

**Endpoint:** `PUT /api/projects/:id`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "Design"
}
```

All fields are optional. Only provided fields will be updated.

**Response:** `200 OK`

```json
{
  "id": "cmi7zaqka0001u95g5zuqg3z2",
  "title": "Updated Title",
  "description": "Updated description",
  "category": "Design",
  "ownerId": "cmhdpzkce0000u9h92xr2wl4s",
  "createdAt": "2025-11-20T10:30:00.000Z",
  "updatedAt": "2025-11-20T11:00:00.000Z"
}
```

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Project not found or user doesn't own it
- `400 Bad Request` - Invalid update data

---

### Delete Project

Delete a project.

**Endpoint:** `DELETE /api/projects/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:** `204 No Content`

No response body is returned on successful deletion.

**Error Responses:**

- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Project not found or user doesn't own it

---

## ML Prediction

### Predict Category

Get an ML-powered category prediction for text input.

**Endpoint:** `POST /api/ml/predict-category`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "text": "Build a new REST API endpoint"
}
```

**Response:** `200 OK`

```json
{
  "category": "Development",
  "confidence": 0.95
}
```

**Available Categories:**

- Development
- Marketing
- Design
- Research
- Operations

**Error Responses:**

- `400 Bad Request` - Missing or empty text field
- `503 Service Unavailable` - ML service is unavailable or timed out

**Notes:**

- This endpoint does not require authentication
- The request times out after 4 seconds with one retry attempt
- Confidence score ranges from 0 to 1

---

## Debug Endpoints

**⚠️ Warning:** These endpoints should be removed or secured in production environments.

### List All Users

Get a list of all users in the database.

**Endpoint:** `GET /api/debug/users`

**Response:** `200 OK`

```json
[
  {
    "id": "cmhdpzkce0000u9h92xr2wl4s",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-11-20T10:30:00.000Z"
  }
]
```

---

### List All Projects

Get a list of all projects with owner information.

**Endpoint:** `GET /api/debug/projects`

**Response:** `200 OK`

```json
[
  {
    "id": "cmi7zaqka0001u95g5zuqg3z2",
    "title": "My Project",
    "description": "A sample project",
    "category": "Development",
    "ownerId": "cmhdpzkce0000u9h92xr2wl4s",
    "owner": {
      "email": "user@example.com"
    },
    "createdAt": "2025-11-20T10:30:00.000Z",
    "updatedAt": "2025-11-20T10:30:00.000Z"
  }
]
```

---

### Health Check

Verify the backend server is running.

**Endpoint:** `GET /api/health`

**Response:** `200 OK`

```json
{
  "ok": true
}
```

---

## Example Usage

### Complete Workflow Example

Here's a complete example of creating a user, authenticating, and managing projects:

```bash
# 1. Sign up
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123",
    "name": "Test User"
  }'

# Response includes token, save it
# TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Create a project
curl -X POST http://localhost:4000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build Authentication System",
    "description": "Implement JWT-based auth"
  }'

# Response includes project with ID
# PROJECT_ID="cmi7zaqka0001u95g5zuqg3z2"

# 3. Get ML category suggestion
curl -X POST http://localhost:4000/api/ml/predict-category \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Build Authentication System"
  }'

# 4. Update project with suggested category
curl -X PUT http://localhost:4000/api/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Development"
  }'

# 5. List all projects
curl -X GET http://localhost:4000/api/projects \
  -H "Authorization: Bearer $TOKEN"

# 6. Delete project
curl -X DELETE http://localhost:4000/api/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. This should be added before deploying to production.

## CORS Configuration

The backend accepts requests from:

- `http://localhost:5173` (local development)
- `*.vercel.app` domains (deployed frontend)

Credentials (cookies, authorization headers) are enabled.
