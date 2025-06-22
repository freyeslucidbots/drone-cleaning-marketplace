# Drone Cleaning Marketplace

A modern marketplace connecting property managers with certified drone pilots for exterior building cleaning services.

## 🚀 Live Demo

- **Frontend**: [Deploy to Vercel](https://vercel.com)
- **Backend**: [Deploy to Render](https://render.com)

## ✨ Features

- **User Authentication**: Secure signup/login for property managers and pilots
- **Job Posting**: Property managers can post cleaning jobs with detailed requirements
- **Bidding System**: Pilots can bid on jobs with competitive pricing
- **Pilot Directory**: Browse certified and insured drone pilots
- **Subscription Management**: Stripe-powered subscription system for pilots
- **Real-time Updates**: Live job status and bid notifications
- **Mobile Responsive**: Works perfectly on all devices

## 🛠 Tech Stack

### Frontend
- React 19
- React Router DOM
- CSS3 with modern styling
- Responsive design

### Backend
- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT Authentication
- Stripe Integration
- CORS enabled

## 🚀 Quick Deployment

### Prerequisites
- GitHub account
- Render.com account (free)
- Vercel.com account (free)

### 1. Backend Deployment (Render.com)

1. Fork/clone this repository
2. Go to [render.com](https://render.com) and create account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `drone-marketplace-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Add environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key
   DATABASE_URL=your-postgresql-connection-string
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   ```

7. Create PostgreSQL database in Render dashboard

### 2. Frontend Deployment (Vercel.com)

1. Go to [vercel.com](https://vercel.com) and create account
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

### 3. Database Setup

1. In Render backend service, go to "Shell" tab
2. Run: `npm run migrate`
3. Optional: Run `npm run seed` to create admin user

## 📁 Project Structure

```
├── backend/
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context
│   │   └── App.js       # Main app component
│   └── package.json
└── DEPLOYMENT.md        # Detailed deployment guide
```

## 🔧 Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🌐 API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/users/profile` - Get user profile
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create new job
- `GET /api/pilots` - List all pilots
- `POST /api/bids` - Submit bid on job
- `GET /api/subscriptions` - Get subscription info

## 🔐 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://localhost:5432/drone_marketplace
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## 📝 License

MIT License - feel free to use this project for your own marketplace!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For deployment help, check the [DEPLOYMENT.md](./DEPLOYMENT.md) file for detailed instructions. 