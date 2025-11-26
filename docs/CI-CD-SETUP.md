# CI/CD Setup Guide

This repository is configured with GitHub Actions for automated testing and deployment.

## What the CI/CD Pipeline Does

### On Every Push/PR:

1. **Backend Tests**: Runs your API tests against a PostgreSQL database
2. **Frontend Build**: Ensures the React app builds successfully
3. **Code Quality**: Validates that everything compiles and works

### On Main Branch Push (after tests pass):

1. **Deploy Backend**: Automatically deploys to Railway
2. **Deploy Frontend**: Automatically deploys to Vercel

## Required GitHub Secrets

To enable automatic deployment, add these secrets in your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

### Railway Deployment Secrets:

- `RAILWAY_API_KEY`: Get from Railway dashboard → Account Settings → Tokens
- `RAILWAY_PROJECT_ID`: Get from your Railway project URL or dashboard

### Vercel Deployment Secrets:

- `VERCEL_TOKEN`: Get from Vercel dashboard → Settings → Tokens
- `VERCEL_ORG_ID`: Get from Vercel dashboard → Settings → General
- `VERCEL_PROJECT_ID`: Get from your Vercel project settings

## How to Get the Secrets

### Railway API Key:

1. Go to https://railway.app/account/tokens
2. Create a new token
3. Copy the token value

### Railway Project ID:

1. Go to your Railway project dashboard
2. The project ID is in the URL: `railway.app/project/{PROJECT_ID}`

### Vercel Tokens:

1. Go to https://vercel.com/account/tokens
2. Create a new token
3. Copy the token value

### Vercel Project Info:

1. Go to your Vercel project
2. Settings → General
3. Copy the Project ID and Team ID (Org ID)

## Local Development

The pipeline uses the same commands you run locally:

```bash
# Backend tests
cd server
npm test

# Frontend build
cd client
npm run build
```

## Benefits

- ✅ **Catch bugs early**: Tests run automatically on every change
- ✅ **Prevent broken deployments**: Only deploy if tests pass
- ✅ **Automated deployment**: No manual steps needed
- ✅ **Team collaboration**: Tests run on PRs from other developers
- ✅ **Deployment history**: Track what was deployed when

## Workflow Status

You can see the status of your CI/CD pipeline:

- On your repository's "Actions" tab
- As status checks on pull requests
- In the README badges (coming soon!)
