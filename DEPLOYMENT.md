# Drone Cleaning Marketplace - Deployment Guide

## Overview
This guide will help you deploy your Drone Cleaning Marketplace to production using free hosting services.

## Backend Deployment (Render.com)

### Step 1: Set up Render.com Account
1. Go to [render.com](https://render.com) and create a free account
2. Connect your GitHub repository

### Step 2: Deploy Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `drone-marketplace-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Set Environment Variables
Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=your-postgresql-connection-string
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### Step 4: Set up PostgreSQL Database
1. In Render dashboard, create a new PostgreSQL database
2. Copy the connection string and add it as `DATABASE_URL`
3. The database will be automatically created

## Frontend Deployment (Vercel.com)

### Step 1: Set up Vercel Account
1. Go to [vercel.com](https://vercel.com) and create a free account
2. Connect your GitHub repository

### Step 2: Deploy Frontend
1. Click "New Project"
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 3: Set Environment Variables
Add this environment variable in Vercel dashboard:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

Replace `your-backend-url` with your actual Render backend URL.

## Database Setup

### Step 1: Run Database Migrations
After your backend is deployed, you'll need to run database migrations:

1. Go to your Render backend service
2. Click on "Shell" tab
3. Run: `npm run migrate`

### Step 2: Create Admin User (Optional)
You can create an admin user by running the seed script:

```bash
npm run seed
```

## Domain Setup (Optional)

### Custom Domain
1. In Vercel, go to your project settings
2. Add your custom domain (e.g., `dronemarketplace.com`)
3. Update DNS records as instructed

## Environment Variables Reference

### Backend (.env)
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=postgresql://username:password@host:port/database
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Database is connected and migrations are run
- [ ] Frontend is deployed and accessible
- [ ] API calls from frontend to backend work
- [ ] User registration and login work
- [ ] All features are functional
- [ ] SSL certificates are working
- [ ] Environment variables are set correctly

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend CORS settings include your frontend URL
2. **Database Connection**: Verify your DATABASE_URL is correct
3. **Build Failures**: Check that all dependencies are in package.json
4. **Environment Variables**: Ensure all required variables are set in deployment platform

### Support
- Render.com: [docs.render.com](https://docs.render.com)
- Vercel.com: [vercel.com/docs](https://vercel.com/docs)

## URLs After Deployment

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Health Check**: `https://your-backend.onrender.com/health` 