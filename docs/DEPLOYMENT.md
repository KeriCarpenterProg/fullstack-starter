# Deployment Guide

This guide explains how to deploy the fullstack starter application to production.

## Deployment Options

This application is configured to deploy to:
- **Backend:** Railway
- **Frontend:** Vercel  
- **ML Service:** Railway
- **Database:** Railway (PostgreSQL addon)

## Prerequisites

Before deploying, ensure you have:

1. Accounts created on:
   - [Railway](https://railway.app/)
   - [Vercel](https://vercel.com/)
   - [GitHub](https://github.com/)

2. Command-line tools installed:
   ```bash
   npm install -g @railway/cli
   npm install -g vercel
   ```

3. Repository pushed to GitHub

---

## Initial Setup

### 1. Create Railway Project

1. Go to https://railway.app/new
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Railway will create a project ID - save this

### 2. Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically set `DATABASE_URL` for your services

### 3. Create Railway Services

Create three services in Railway:

**Backend Service:**
1. Click "+ New" → "GitHub Repo"
2. Select your repository
3. Name it "backend"
4. Set root directory: `/server`
5. Set build command: `npm install && npm run build`
6. Set start command: `npm start`

**ML Service:**
1. Click "+ New" → "GitHub Repo"
2. Select your repository
3. Name it "ml-service"
4. Set root directory: `/ml-service`
5. Railway will auto-detect Dockerfile

### 4. Create Vercel Project

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

## Environment Variables

### Backend (Railway)

Set these in Railway dashboard for the backend service:

```env
DATABASE_URL        # Auto-set by Railway when you add PostgreSQL
JWT_SECRET          # Generate with: openssl rand -base64 32
ML_SERVICE_URL      # URL of ML service (e.g., https://ml-service-production.up.railway.app)
PORT                # Auto-set by Railway
```

**How to set:**
1. Click on backend service
2. Go to "Variables" tab
3. Click "New Variable"
4. Add key and value
5. Click "Add"

### Frontend (Vercel)

Set these in Vercel dashboard:

```env
VITE_API_URL        # URL of backend (e.g., https://backend-production.up.railway.app)
```

**How to set:**
1. Go to project settings
2. Click "Environment Variables"
3. Add variable for Production environment
4. Redeploy if already deployed

### ML Service (Railway)

No additional environment variables required. Railway auto-sets `PORT`.

---

## GitHub Secrets

For CI/CD automation, set these secrets in your GitHub repository:

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each of the following:

```
RAILWAY_API_KEY         # From Railway account settings
RAILWAY_PROJECT_ID      # From Railway project settings
VERCEL_TOKEN            # From Vercel account settings
BACKEND_PUBLIC_URL      # Full URL of deployed backend
ML_SERVICE_URL          # Full URL of deployed ML service
```

**Getting Railway API Key:**
1. Go to https://railway.app/account/tokens
2. Click "Create token"
3. Copy and save securely

**Getting Railway Project ID:**
1. Open your Railway project
2. Go to Settings
3. Copy "Project ID"

**Getting Vercel Token:**
1. Go to https://vercel.com/account/tokens
2. Create a new token
3. Copy and save securely

---

## Manual Deployment

### Deploy Backend

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link <project-id>

# Link to backend service
railway link --service backend

# Deploy
railway up
```

### Deploy Frontend

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
cd client
vercel --prod
```

### Deploy ML Service

```bash
# Link to ML service
railway link --service ml-service

# Deploy
railway up
```

---

## Automated Deployment (CI/CD)

Once GitHub secrets are configured, deployments happen automatically:

**Trigger:** Push to `main` branch

**Pipeline Steps:**
1. Run backend tests
2. Build frontend
3. Deploy backend to Railway
4. Deploy frontend to Vercel
5. Deploy ML service to Railway
6. Run health checks

**View Progress:**
- Go to your GitHub repository
- Click "Actions" tab
- Watch workflow execution

**If Deployment Fails:**
1. Click on failed job
2. Review error logs
3. Fix the issue
4. Push again to retry

---

## Database Migrations

### Initial Migration (First Deploy)

Railway will run migrations automatically if you have this in your start script:

```json
// server/package.json
{
  "scripts": {
    "start": "npm run build && node scripts/prisma-start.js"
  }
}
```

The `prisma-start.js` script handles migrations before starting the server.

### Subsequent Migrations

When you add new migrations:

1. Create migration locally:
   ```bash
   cd server
   npx prisma migrate dev --name add_new_field
   ```

2. Commit and push to GitHub:
   ```bash
   git add prisma/migrations
   git commit -m "Add new migration"
   git push origin main
   ```

3. Railway will automatically run the new migration on deploy

### Manual Migration (if needed)

```bash
# Using Railway CLI
railway link --service backend
railway run npx prisma migrate deploy
```

---

## Post-Deployment Verification

### 1. Check Backend Health

```bash
curl https://your-backend-url.up.railway.app/api/health
```

Expected response:
```json
{"ok": true}
```

### 2. Check ML Service Health

```bash
curl https://your-ml-service-url.up.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### 3. Check Frontend

Visit your Vercel URL in a browser and:
- Sign up for an account
- Create a project
- Verify ML suggestions work

### 4. Test Full Flow

```bash
# Sign up
curl -X POST https://your-backend-url/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "name": "Test User"
  }'

# Save the token from response

# Create project with ML prediction
curl -X POST https://your-backend-url/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "Testing deployment"
  }'
```

---

## Monitoring

### Railway Logs

**View Logs:**
1. Go to Railway dashboard
2. Click on a service
3. Click "Deployments" tab
4. Click on latest deployment
5. View logs in real-time

**Or via CLI:**
```bash
railway logs --service backend
```

### Vercel Logs

**View Logs:**
1. Go to Vercel dashboard
2. Click on your project
3. Click "Deployments"
4. Click on latest deployment
5. View build and runtime logs

### Health Check Monitoring

Set up automated health checks (optional):

**Using UptimeRobot:**
1. Sign up at https://uptimerobot.com
2. Add monitors for:
   - `https://your-backend-url/api/health`
   - `https://your-ml-service-url/health`
   - `https://your-frontend-url/`
3. Configure alerts for downtime

---

## Scaling

### Railway Scaling

**Vertical Scaling:**
1. Go to service settings
2. Adjust resources under "Settings" → "Resources"
3. Increase memory/CPU as needed

**Horizontal Scaling:**
- Railway Pro plan required
- Contact Railway support for multi-instance setup

### Database Scaling

**Connection Pooling:**
Already configured via Prisma. Adjust pool size in Prisma schema if needed:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Add connection pool configuration
}
```

**Database Upgrades:**
1. Go to Railway database service
2. Upgrade to larger instance
3. Railway handles migration automatically

---

## Cost Estimates

### Railway (Backend + ML + Database)

**Free Tier:**
- $5 credit per month
- Good for testing

**Pro Plan:**
- $20/month
- Includes $20 usage credit
- Pay-as-you-go after credits

**Typical Costs:**
- Backend: ~$5-10/month
- ML Service: ~$5-10/month
- PostgreSQL: ~$5-10/month
- **Total: ~$15-30/month**

### Vercel (Frontend)

**Hobby Tier:**
- Free for personal projects
- 100GB bandwidth/month

**Pro Tier:**
- $20/month
- 1TB bandwidth/month

**Typical Costs:**
- Free for most personal projects
- Pro if you need more bandwidth

### Total Estimated Cost

**Minimal Setup:** $15-30/month (Railway Pro + Vercel Free)
**Production Setup:** $35-50/month (Railway Pro + Vercel Pro)

---

## Rollback Strategy

### Railway Rollback

**Via Dashboard:**
1. Go to service
2. Click "Deployments"
3. Find previous working deployment
4. Click "..." → "Redeploy"

**Via CLI:**
```bash
railway rollback
```

### Vercel Rollback

**Via Dashboard:**
1. Go to project
2. Click "Deployments"
3. Find previous working deployment
4. Click "..." → "Promote to Production"

---

## Security Best Practices

### Environment Variables

- ✅ Never commit `.env` files
- ✅ Use strong random strings for `JWT_SECRET`
- ✅ Rotate secrets regularly
- ✅ Use different secrets for dev/prod

### Database

- ✅ Use Railway's managed PostgreSQL (auto-secured)
- ✅ Don't expose database publicly
- ✅ Regular backups (Railway handles this)

### API Security

- ✅ CORS configured for specific origins only
- ✅ HTTPS enabled by default on Railway/Vercel
- ✅ JWT tokens with expiration
- ✅ Password hashing with bcrypt

### Additional Recommendations

- Add rate limiting (future enhancement)
- Implement request logging
- Set up error tracking (Sentry, Datadog)
- Regular security audits
- Keep dependencies updated

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check error logs
- Monitor health checks
- Review performance metrics

**Monthly:**
- Update dependencies
- Check for security vulnerabilities
- Review costs

**Quarterly:**
- Rotate secrets/tokens
- Database backup verification
- Performance optimization review

### Dependency Updates

```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Or use automated tools
npx npm-check-updates -u
npm install

# Test thoroughly before deploying!
```

---

## Backup and Recovery

### Database Backups

**Railway:**
- Automatic daily backups
- Restore via Railway dashboard:
  1. Go to database service
  2. Click "Backups"
  3. Select backup to restore

**Manual Backup:**
```bash
# Export database
railway run pg_dump -F c -b -v -f backup.dump

# Restore database
railway run pg_restore -v -d database_name backup.dump
```

### Code Backups

- Code is in Git (primary backup)
- GitHub maintains repository history
- Can redeploy any commit

---

## Support Resources

### Documentation

- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)

### Community

- Railway Discord
- Vercel Discussions
- GitHub Issues

### Professional Support

- Railway Pro includes priority support
- Vercel Pro includes email support
