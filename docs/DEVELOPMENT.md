# Development Guide

This guide provides information for developers who want to contribute to or extend the fullstack starter project.

## Table of Contents

- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Adding Features](#adding-features)
- [Contributing](#contributing)

---

## Project Structure

```
fullstack-starter/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD pipeline
├── client/                     # Frontend React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images, fonts, etc.
│   │   ├── App.tsx             # Main app component
│   │   ├── App.css             # App styles
│   │   ├── index.css           # Global styles
│   │   └── main.tsx            # Entry point
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── tsconfig.json           # TypeScript config
│   └── vite.config.ts          # Vite config
├── server/                     # Backend Express application
│   ├── prisma/
│   │   ├── migrations/         # Database migrations
│   │   ├── schema.prisma       # Database schema
│   │   ├── quick-seed.js       # Seed script
│   │   └── README.md           # Prisma docs
│   ├── scripts/
│   │   └── prisma-start.js     # Production start script
│   ├── src/
│   │   ├── generated/          # Generated Prisma client
│   │   ├── lib/
│   │   │   ├── auth.ts         # JWT auth middleware
│   │   │   └── db.ts           # Prisma client instance
│   │   ├── routes/
│   │   │   ├── auth.ts         # Authentication routes
│   │   │   ├── projects.ts     # Project CRUD routes
│   │   │   └── oauth.ts        # OAuth routes (future)
│   │   └── index.ts            # Express app setup
│   ├── tests/
│   │   └── api.test.ts         # API integration tests
│   ├── .env.example            # Environment template
│   ├── jest.config.js          # Jest configuration
│   ├── package.json            # Backend dependencies
│   └── tsconfig.json           # TypeScript config
├── ml-service/                 # Machine learning service
│   ├── venv/                   # Python virtual environment
│   ├── app.py                  # FastAPI application
│   ├── train_model.py          # Model training script
│   ├── category_classifier.pkl # Trained model (generated)
│   ├── Dockerfile              # Docker configuration
│   └── requirements.txt        # Python dependencies
├── docs/                       # Documentation
│   ├── GETTING_STARTED.md      # Setup instructions
│   ├── API.md                  # API documentation
│   ├── ARCHITECTURE.md         # System design
│   ├── DEPLOYMENT.md           # Deployment guide
│   ├── TROUBLESHOOTING.md      # Common issues
│   └── DEVELOPMENT.md          # This file
├── Makefile                    # Development commands
├── .gitignore                  # Git ignore rules
├── package.json                # Root package (optional)
└── README.md                   # Project overview
```

---

## Development Workflow

### Branch Strategy

**Main Branches:**
- `main` - Production-ready code
- Feature branches - `feature/description` or `username/ISSUE-number`

**Workflow:**
1. Create a branch from `main`
2. Make changes
3. Write tests
4. Ensure tests pass locally
5. Push and create pull request
6. Wait for CI checks
7. Merge after approval

### Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(api): add project category field
fix(auth): resolve token expiration issue
docs: update getting started guide
test(api): add ML prediction endpoint tests
```

### Pull Request Process

1. **Create PR with clear description:**
   - What does this change?
   - Why is it needed?
   - How was it tested?

2. **Ensure CI passes:**
   - All tests pass
   - No linting errors
   - Builds successfully

3. **Request review:**
   - Tag relevant reviewers
   - Address feedback

4. **Merge:**
   - Squash and merge
   - Delete feature branch

---

## Code Style

### TypeScript/JavaScript

**Style Guide:**
- 2 spaces indentation
- Semicolons required
- Single quotes for strings
- Trailing commas in objects/arrays

**Linting:**
```bash
# Backend
cd server
npm run lint

# Frontend
cd client
npm run lint
```

**Example:**
```typescript
// Good
const getUserProjects = async (userId: string): Promise<Project[]> => {
  const projects = await db.project.findMany({
    where: { ownerId: userId },
  });
  return projects;
};

// Avoid
const getUserProjects = async (userId: string) => {
  const projects = await db.project.findMany({
    where: { ownerId: userId }
  })
  return projects
}
```

### Python

**Style Guide:**
- PEP 8 compliant
- 4 spaces indentation
- Type hints for function signatures

**Linting:**
```bash
cd ml-service
source venv/bin/activate
pip install flake8
flake8 app.py train_model.py
```

**Example:**
```python
# Good
def predict_category(text: str) -> dict:
    """Predict category for given text."""
    prediction = model.predict([text])[0]
    probabilities = model.predict_proba([text])[0]
    confidence = float(max(probabilities))
    
    return {
        "category": prediction,
        "confidence": confidence
    }
```

### Naming Conventions

**TypeScript:**
- Variables/Functions: `camelCase`
- Classes/Interfaces: `PascalCase`
- Constants: `UPPER_CASE`
- Files: `kebab-case.ts` or `PascalCase.tsx` for components

**Python:**
- Variables/Functions: `snake_case`
- Classes: `PascalCase`
- Constants: `UPPER_CASE`
- Files: `snake_case.py`

---

## Testing

### Backend Tests

**Run Tests:**
```bash
cd server
npm test                  # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
```

**Test Structure:**
```typescript
describe('Feature Name', () => {
  let authToken: string;
  
  beforeAll(async () => {
    // Setup (create test user, etc.)
  });
  
  afterAll(async () => {
    // Cleanup
  });
  
  test('should do something', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    
    expect(response.body).toHaveProperty('data');
  });
});
```

**Writing New Tests:**

1. **Create test file:**
   ```bash
   touch server/tests/new-feature.test.ts
   ```

2. **Import dependencies:**
   ```typescript
   import request from 'supertest';
   import app from '../src/index';
   ```

3. **Write test cases:**
   - Test happy path
   - Test error cases
   - Test edge cases
   - Test authentication/authorization

4. **Run and verify:**
   ```bash
   npm test
   ```

### Frontend Tests

Currently minimal. To add:

```bash
cd client
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

**Example test:**
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders welcome message', () => {
    render(<App />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});
```

### ML Service Tests

**Manual Testing:**
```bash
# Test prediction
curl -X POST http://localhost:5002/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"Build API endpoint"}'

# Test health
curl http://localhost:5002/health
```

**To add automated tests:**
```bash
cd ml-service
pip install pytest pytest-asyncio httpx

# Create tests/test_app.py
# Run with: pytest
```

---

## Adding Features

### Adding a Backend Endpoint

1. **Define route:**
   ```typescript
   // server/src/routes/my-feature.ts
   import { Router } from 'express';
   import { auth } from '../lib/auth';
   
   const router = Router();
   
   router.get('/my-endpoint', auth, async (req, res) => {
     try {
       // Implementation
       res.json({ data: 'result' });
     } catch (e: any) {
       res.status(500).json({ error: e.message });
     }
   });
   
   export default router;
   ```

2. **Register route:**
   ```typescript
   // server/src/index.ts
   import myFeatureRouter from './routes/my-feature';
   
   app.use('/api/my-feature', myFeatureRouter);
   ```

3. **Add tests:**
   ```typescript
   // server/tests/my-feature.test.ts
   describe('My Feature', () => {
     test('GET /api/my-feature/my-endpoint', async () => {
       // Test implementation
     });
   });
   ```

### Adding a Database Model

1. **Update Prisma schema:**
   ```prisma
   // server/prisma/schema.prisma
   model NewModel {
     id        String   @id @default(cuid())
     name      String
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. **Create migration:**
   ```bash
   cd server
   npx prisma migrate dev --name add_new_model
   ```

3. **Generate client:**
   ```bash
   npx prisma generate
   ```

4. **Use in code:**
   ```typescript
   import { db } from '../lib/db';
   
   const items = await db.newModel.findMany();
   ```

### Adding a Frontend Component

1. **Create component:**
   ```typescript
   // client/src/components/MyComponent.tsx
   import { useState } from 'react';
   
   interface MyComponentProps {
     title: string;
   }
   
   export function MyComponent({ title }: MyComponentProps) {
     const [count, setCount] = useState(0);
     
     return (
       <div>
         <h2>{title}</h2>
         <button onClick={() => setCount(count + 1)}>
           Count: {count}
         </button>
       </div>
     );
   }
   ```

2. **Import and use:**
   ```typescript
   // client/src/App.tsx
   import { MyComponent } from './components/MyComponent';
   
   function App() {
     return <MyComponent title="Hello" />;
   }
   ```

### Extending the ML Model

1. **Add training data:**
   ```python
   # ml-service/train_model.py
   training_data = [
       ("New example text", "Category"),
       # Add more examples
   ]
   ```

2. **Retrain model:**
   ```bash
   make ml-train
   ```

3. **Test predictions:**
   ```bash
   curl -X POST http://localhost:5002/predict \
     -H "Content-Type: application/json" \
     -d '{"text":"New example text"}'
   ```

4. **Deploy updated model:**
   ```bash
   git add ml-service/category_classifier.pkl
   git commit -m "Update ML model with new training data"
   git push
   ```

---

## Debugging

### Backend Debugging

**VS Code Launch Configuration:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "cwd": "${workspaceFolder}/server",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

**Add breakpoints:**
- Click left of line number in VS Code
- Run "Debug Backend" configuration

**Console logging:**
```typescript
console.log('Debug:', variable);
console.error('Error:', error);
```

### Frontend Debugging

**Browser DevTools:**
- Press F12
- Use Console, Network, and Elements tabs
- React DevTools extension recommended

**VS Code Debugging:**
Install "Debugger for Chrome" extension, then:
```json
// .vscode/launch.json
{
  "type": "chrome",
  "request": "launch",
  "name": "Debug Frontend",
  "url": "http://localhost:5173",
  "webRoot": "${workspaceFolder}/client/src"
}
```

### Database Debugging

**Prisma Studio:**
```bash
cd server
npx prisma studio
```

Opens GUI at http://localhost:5555 to browse/edit database

**SQL Logging:**
```typescript
// server/src/lib/db.ts
export const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

---

## Performance Optimization

### Backend

**Database Queries:**
```typescript
// Bad: N+1 query problem
const projects = await db.project.findMany();
for (const project of projects) {
  const owner = await db.user.findUnique({ where: { id: project.ownerId } });
}

// Good: Include relation
const projects = await db.project.findMany({
  include: { owner: true }
});
```

**Caching (Future):**
```typescript
// Example with Redis
const cachedData = await redis.get(key);
if (cachedData) return JSON.parse(cachedData);

const data = await db.query();
await redis.set(key, JSON.stringify(data), 'EX', 3600);
return data;
```

### Frontend

**Lazy Loading:**
```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**Debouncing:**
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [debouncedTerm, setDebouncedTerm] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedTerm(searchTerm);
  }, 500);
  
  return () => clearTimeout(timer);
}, [searchTerm]);

useEffect(() => {
  if (debouncedTerm) {
    // Make API call
  }
}, [debouncedTerm]);
```

---

## Contributing

### Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/fullstack-starter.git
   ```
3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/KeriCarpenterProg/fullstack-starter.git
   ```
4. **Create feature branch:**
   ```bash
   git checkout -b feature/my-feature
   ```

### Making Changes

1. **Keep branch updated:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Make your changes**
3. **Test thoroughly**
4. **Commit:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push:**
   ```bash
   git push origin feature/my-feature
   ```

6. **Create Pull Request:**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in description
   - Submit

### Code Review

**What we look for:**
- ✅ Code follows style guide
- ✅ Tests are included and passing
- ✅ Documentation is updated
- ✅ No breaking changes (or well-documented)
- ✅ Commit messages are clear

**Review Process:**
1. Automated CI checks run
2. Maintainers review code
3. Feedback provided
4. Changes requested if needed
5. Approval and merge

### Tips for Good PRs

- Keep PRs small and focused
- Write clear descriptions
- Include screenshots for UI changes
- Reference related issues
- Respond to feedback promptly
- Be open to suggestions

---

## Resources

### Documentation

- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [Prisma](https://www.prisma.io/docs)
- [FastAPI](https://fastapi.tiangolo.com/)
- [scikit-learn](https://scikit-learn.org/stable/)

### Tools

- [Postman](https://www.postman.com/) - API testing
- [Prisma Studio](https://www.prisma.io/studio) - Database GUI
- [React DevTools](https://react.dev/learn/react-developer-tools) - React debugging
- [Thunder Client](https://www.thunderclient.com/) - VS Code API client

### Learning

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Tutorial](https://react.dev/learn)
- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)

---

## Questions?

If you have questions about development:

1. Check existing documentation
2. Search closed issues/PRs
3. Ask in GitHub Discussions
4. Open an issue with "question" label
