#!/bin/bash

echo "🚀 Starting deployment setup..."

# Check if we're in production
if [ "$NODE_ENV" = "production" ]; then
    echo "📊 Production environment detected"
    
    # Set default port if not provided
    if [ -z "$PORT" ]; then
        export PORT=10000
        echo "🔧 Set PORT to $PORT"
    fi
    
    # Check if DATABASE_URL is set
    if [ -z "$DATABASE_URL" ]; then
        echo "❌ DATABASE_URL is not set. Please set it in your environment variables."
        exit 1
    fi
    
    echo "✅ Environment variables configured"
    
    # Run database migrations
    echo "🗄️ Running database migrations..."
    npm run migrate
    
    # Start the server
    echo "🚀 Starting server..."
    npm start
else
    echo "🔧 Development environment detected"
    npm start
fi 