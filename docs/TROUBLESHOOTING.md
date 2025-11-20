# Troubleshooting Guide

This guide helps you diagnose and fix common issues when working with the fullstack starter application.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Database Issues](#database-issues)
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [ML Service Issues](#ml-service-issues)
- [Authentication Issues](#authentication-issues)
- [Deployment Issues](#deployment-issues)

---

## Installation Issues

### Node Modules Installation Fails

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and package-lock.json:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Use correct Node version:**
   ```bash
   node --version  # Should be 18.x or higher
   ```

   If version is wrong, install correct version:
   ```bash
   # Using nvm
   nvm install 18
   nvm use 18
   ```

---

### Python Virtual Environment Issues

**Symptoms:**
```
python: command not found
```

**Solutions:**

1. **Check Python installation:**
   ```bash
   python3 --version  # Should be 3.9 or higher
   ```

2. **Install Python if missing:**
   ```bash
   # macOS
   brew install python3
   
   # Ubuntu/Debian
   sudo apt-get install python3 python3-pip python3-venv
   ```

3. **Create virtual environment manually:**
   ```bash
   cd ml-service
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

---

## Database Issues

### Cannot Connect to Database

**Symptoms:**
```
Error: P1001: Can't reach database server at `localhost:5432`
```

**Solutions:**

1. **Check if PostgreSQL is running:**
   ```bash
   # macOS
   brew services list | grep postgresql
   
   # Linux
   sudo systemctl status postgresql
   ```

2. **Start PostgreSQL:**
   ```bash
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

3. **Verify DATABASE_URL in server/.env:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
   ```

4. **Test connection manually:**
   ```bash
   psql -h localhost -U username -d dbname
   ```

---

### Database Doesn't Exist

**Symptoms:**
```
Error: P1003: Database `mydb` does not exist
```

**Solutions:**

1. **Create the database:**
   ```bash
   createdb your_database_name
   ```

   Or via psql:
   ```sql
   CREATE DATABASE your_database_name;
   ```

2. **Verify it was created:**
   ```bash
   psql -l
   ```

---

### Migration Fails

**Symptoms:**
```
Error: P3005: The database schema is not empty
```

**Solutions:**

1. **For development, reset the database:**
   ```bash
   cd server
   npx prisma migrate reset
   ```

   **Warning:** This deletes all data!

2. **For production, baseline the migration:**
   ```bash
   cd server
   npx prisma migrate resolve --applied "migration_name"
   ```

3. **Check migration status:**
   ```bash
   npx prisma migrate status
   ```

---

### Prisma Client Out of Sync

**Symptoms:**
```
Error: @prisma/client did not initialize yet
```

**Solutions:**

1. **Regenerate Prisma Client:**
   ```bash
   cd server
   npx prisma generate
   ```

2. **Restart the dev server:**
   ```bash
   npm run dev
   ```

---

## Backend Issues

### Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solutions:**

1. **Use the make target to kill all processes:**
   ```bash
   make stop-all
   ```

2. **Or find and kill the process manually:**
   ```bash
   # Find process using port 4000
   lsof -ti tcp:4000
   
   # Kill it
   kill $(lsof -ti tcp:4000)
   ```

---

### Module Not Found Errors

**Symptoms:**
```
Error: Cannot find module 'express'
```

**Solutions:**

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Check if node_modules exists:**
   ```bash
   ls -la node_modules
   ```

3. **Verify package.json has the dependency listed**

---

### TypeScript Compilation Errors

**Symptoms:**
```
error TS2304: Cannot find name 'something'
```

**Solutions:**

1. **Install TypeScript type definitions:**
   ```bash
   npm install --save-dev @types/package-name
   ```

2. **Rebuild TypeScript:**
   ```bash
   npm run build
   ```

3. **Check tsconfig.json is present and valid**

---

### JWT_SECRET Not Set

**Symptoms:**
```
Warning: JWT_SECRET not configured
```

**Solutions:**

1. **Generate a secure secret:**
   ```bash
   openssl rand -base64 32
   ```

2. **Add to server/.env:**
   ```env
   JWT_SECRET="your-generated-secret-here"
   ```

3. **Restart the server**

---

## Frontend Issues

### Blank Page on Load

**Symptoms:**
- Browser shows blank page
- No console errors

**Solutions:**

1. **Check if backend is running:**
   ```bash
   curl http://localhost:4000/api/health
   ```

2. **Check browser console for errors:**
   - Press F12 → Console tab

3. **Verify API URL in axios configuration:**
   ```typescript
   // Should point to http://localhost:4000 in development
   ```

4. **Clear browser cache and reload:**
   - Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)

---

### CORS Errors

**Symptoms:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solutions:**

1. **Verify frontend URL in backend CORS config:**
   ```typescript
   // server/src/index.ts
   app.use(cors({ 
     origin: ["http://localhost:5173", ...],
     credentials: true 
   }));
   ```

2. **Check frontend is running on expected port:**
   ```bash
   # Should be 5173
   lsof -ti tcp:5173
   ```

3. **Restart both frontend and backend**

---

### Build Failures

**Symptoms:**
```
ERROR: Transform failed with 1 error
```

**Solutions:**

1. **Check for TypeScript errors:**
   ```bash
   cd client
   npx tsc --noEmit
   ```

2. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## ML Service Issues

### Model File Not Found

**Symptoms:**
```
FileNotFoundError: [Errno 2] No such file or directory: 'category_classifier.pkl'
```

**Solutions:**

1. **Train the model:**
   ```bash
   make ml-train
   ```

2. **Verify the file was created:**
   ```bash
   ls -la ml-service/category_classifier.pkl
   ```

3. **Check you're in the correct directory when running the service**

---

### Python Module Not Found

**Symptoms:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solutions:**

1. **Activate virtual environment:**
   ```bash
   cd ml-service
   source venv/bin/activate
   ```

2. **Install requirements:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Verify installation:**
   ```bash
   pip list | grep fastapi
   ```

---

### ML Service Won't Start

**Symptoms:**
```
Error: Address already in use
```

**Solutions:**

1. **Kill process on port 5002:**
   ```bash
   kill $(lsof -ti tcp:5002)
   ```

2. **Or use a different port:**
   ```bash
   PORT=5003 make ml-run
   ```

   And update `ML_SERVICE_URL` in `server/.env`:
   ```env
   ML_SERVICE_URL="http://localhost:5003"
   ```

---

### Cannot Connect to ML Service

**Symptoms:**
```
ML service error: fetch failed
ECONNREFUSED ::1:5002
```

**Solutions:**

1. **Check ML service is running:**
   ```bash
   curl http://localhost:5002/health
   ```

2. **Verify ML_SERVICE_URL in backend:**
   ```bash
   cd server
   cat .env | grep ML_SERVICE_URL
   ```

3. **Start ML service:**
   ```bash
   make ml-run
   ```

4. **Check firewall isn't blocking port 5002**

---

### Low Prediction Confidence

**Symptoms:**
- ML always returns low confidence scores
- Predictions seem random

**Solutions:**

1. **Retrain model with more data:**
   - Add more examples to `train_model.py`
   - Run `make ml-train`

2. **Check training data quality:**
   - Ensure examples are diverse
   - Verify categories are balanced

3. **Test prediction manually:**
   ```bash
   curl -X POST http://localhost:5002/predict \
     -H "Content-Type: application/json" \
     -d '{"text":"Build a new feature"}'
   ```

---

## Authentication Issues

### Token Expired

**Symptoms:**
```
401 Unauthorized
JWT expired
```

**Solutions:**

1. **Sign in again to get a new token:**
   ```bash
   curl -X POST http://localhost:4000/api/auth/signin \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"pass"}'
   ```

2. **Clear localStorage in browser:**
   ```javascript
   // In browser console
   localStorage.clear()
   ```

3. **Tokens expire after 7 days by default**

---

### Invalid Token

**Symptoms:**
```
401 Unauthorized
Invalid token
```

**Solutions:**

1. **Verify token format:**
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Check JWT_SECRET matches between environments:**
   - Must be the same secret used to sign the token

3. **Ensure Authorization header is correct:**
   ```
   Authorization: Bearer <token>
   ```
   (Note: "Bearer" with capital B and space before token)

---

### Cannot Sign Up

**Symptoms:**
```
409 Conflict
Email already exists
```

**Solutions:**

1. **Use a different email address**

2. **Or delete the existing user:**
   ```bash
   # Via debug endpoint (dev only)
   curl http://localhost:4000/api/debug/users
   
   # Then manually delete from database
   psql -d your_db -c "DELETE FROM \"User\" WHERE email='user@example.com';"
   ```

3. **Use signin instead if you already have an account**

---

## Deployment Issues

### Railway Deployment Fails

**Symptoms:**
```
Error: Railway deployment failed
```

**Solutions:**

1. **Check environment variables are set:**
   - Go to Railway dashboard
   - Verify `DATABASE_URL`, `JWT_SECRET`, `ML_SERVICE_URL`

2. **Check build logs in Railway:**
   - Look for specific error messages
   - Verify dependencies installed correctly

3. **Verify Railway CLI is authenticated:**
   ```bash
   railway whoami
   ```

4. **Re-link service:**
   ```bash
   railway link
   ```

---

### Vercel Deployment Fails

**Symptoms:**
```
Error: Build failed
```

**Solutions:**

1. **Check build command is correct:**
   - Should be `npm run build` or `vite build`

2. **Verify environment variables:**
   - `VITE_API_URL` should point to production backend

3. **Check Vercel logs:**
   - View detailed error messages in Vercel dashboard

4. **Test build locally:**
   ```bash
   cd client
   npm run build
   ```

---

### CI/CD Pipeline Fails

**Symptoms:**
- GitHub Actions workflow shows red X
- Tests fail in CI but pass locally

**Solutions:**

1. **Check GitHub Secrets are set:**
   - Go to repository Settings → Secrets
   - Verify `RAILWAY_API_KEY`, `VERCEL_TOKEN`, etc.

2. **Review workflow logs:**
   - Click on failed job in Actions tab
   - Look for specific error messages

3. **Ensure test database is accessible:**
   - PostgreSQL service should be running in CI

4. **Mock external services in tests:**
   - ML service should be mocked

---

## General Debugging Tips

### Enable Verbose Logging

**Backend:**
```typescript
// Add to src/index.ts
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

**ML Service:**
```python
# FastAPI automatically logs requests with uvicorn
# Start with --log-level debug
uvicorn app:app --log-level debug
```

---

### Check Service Health

```bash
# Backend
curl http://localhost:4000/api/health

# ML Service
curl http://localhost:5002/health

# Database
psql -U username -d dbname -c "SELECT 1;"
```

---

### Review Logs

**Backend:**
```bash
# If running in terminal, logs appear in console
# If running with systemd:
journalctl -u your-service-name -f
```

**ML Service:**
```bash
# Check terminal output where service is running
```

**Database:**
```bash
# PostgreSQL logs location varies by OS
# macOS (Homebrew):
tail -f /usr/local/var/log/postgres.log

# Linux:
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

---

## Still Having Issues?

If you're still experiencing problems:

1. **Search closed issues:** https://github.com/KeriCarpenterProg/fullstack-starter/issues
2. **Check discussions:** https://github.com/KeriCarpenterProg/fullstack-starter/discussions
3. **Open a new issue:** Include:
   - Error messages (full text)
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)
   - What you've already tried

4. **Debug systematically:**
   - Isolate the problem (frontend vs backend vs ML)
   - Check one thing at a time
   - Restart services after changes
   - Read error messages carefully

5. **Use the Makefile:**
   - `make stop-all` to clean up
   - `make dev-all` to restart everything
   - `make help` to see available commands
