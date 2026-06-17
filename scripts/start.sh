#!/bin/bash
# Iniciar DynQR en desarrollo (backend + frontend)
cd "$(dirname "$0")/.."

set -a
source .env
set +a

export BACKEND_PORT
export REACT_APP_PORT
export REACT_APP_API_URL
export FRONTEND_PUBLIC_URL
export CORS_ORIGINS
export PORT=$REACT_APP_PORT

echo "Iniciando DynQR..."
echo "Backend:  http://localhost:$BACKEND_PORT"
echo "Frontend: http://localhost:$REACT_APP_PORT"
echo ""

concurrently --kill-others \
  "node -r dotenv/config backend/server.js" \
  "cd frontend && PORT=$REACT_APP_PORT npm start"
