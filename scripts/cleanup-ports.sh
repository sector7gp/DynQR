#!/bin/bash
# Liberar puertos configurados en .env
cd "$(dirname "$0")/.."

BACKEND_PORT=$(grep "^BACKEND_PORT=" .env | cut -d'=' -f2 || echo "5000")
REACT_APP_PORT=$(grep "^REACT_APP_PORT=" .env | cut -d'=' -f2 || echo "3000")

echo "Limpiando procesos en puertos..."
echo "Backend: $BACKEND_PORT | Frontend: $REACT_APP_PORT"

if lsof -Pi :$BACKEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    kill -9 $(lsof -t -i:$BACKEND_PORT) 2>/dev/null || true
fi

if lsof -Pi :$REACT_APP_PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    kill -9 $(lsof -t -i:$REACT_APP_PORT) 2>/dev/null || true
fi

echo "Puertos liberados. Ejecuta: npm run dev"
