#!/bin/bash
# startup.sh - Script to run OpenExchange frontend and backend

echo "🚀 Starting OpenExchange Setup..."

# Navigate to client directory and install dependencies
echo "📦 Setting up frontend..."
cd client
echo "Installing frontend dependencies..."
npm i --legacy-peer-deps
echo "✅ Frontend dependencies installed"

# Start frontend in background
echo "🌐 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

# Return to root directory
cd ..

# Navigate to backend directory
echo "📦 Setting up backend..."
cd OpenEx-Backend
echo "Updating Go dependencies..."
go mod tidy
echo "✅ Backend dependencies updated"

# Start backend
echo "🚀 Starting backend server..."
echo "Backend logs will appear below:"
echo "--------------------------------------"
go run cmd/api/main.go

# This part will only execute if the backend server stops
echo "Backend server stopped"

# Kill frontend server if it's still running
if ps -p $FRONTEND_PID > /dev/null; then
  echo "Stopping frontend server..."
  kill $FRONTEND_PID
fi

echo "📣 All servers stopped"