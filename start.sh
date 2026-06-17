#!/bin/bash

# Script para iniciar DynQR leyendo la configuración de puertos desde .env

set -a
source .env
set +a

export BACKEND_PORT
export REACT_APP_PORT
export REACT_APP_API_URL
export FRONTEND_PUBLIC_URL
export CORS_ORIGINS
export PORT=$REACT_APP_PORT

echo "🎬 Iniciando DynQR..."
echo "📍 Backend: http://localhost:$BACKEND_PORT"
echo "📍 Frontend: http://localhost:$REACT_APP_PORT"
echo "📍 API URL: ${REACT_APP_API_URL:-/api (mismo origen)}"
echo "📍 Frontend público (QR): ${FRONTEND_PUBLIC_URL:-http://localhost:$REACT_APP_PORT}"
echo ""

# Ejecutar los servidores
concurrently --kill-others \
  "node -r dotenv/config backend/server.js" \
  "cd frontend && PORT=$REACT_APP_PORT npm start"
