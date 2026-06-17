#!/bin/bash

# Script para matar procesos en los puertos y limpiar

BACKEND_PORT=$(grep "^BACKEND_PORT=" .env | cut -d'=' -f2 || echo "5000")
REACT_APP_PORT=$(grep "^REACT_APP_PORT=" .env | cut -d'=' -f2 || echo "3000")

echo "🧹 Limpiando procesos en puertos..."
echo "Backend port: $BACKEND_PORT"
echo "Frontend port: $REACT_APP_PORT"
echo ""

# Matar procesos en puerto del backend
if lsof -Pi :$BACKEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "Matando proceso en puerto $BACKEND_PORT..."
    kill -9 $(lsof -t -i:$BACKEND_PORT) 2>/dev/null || true
fi

# Matar procesos en puerto del frontend
if lsof -Pi :$REACT_APP_PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "Matando proceso en puerto $REACT_APP_PORT..."
    kill -9 $(lsof -t -i:$REACT_APP_PORT) 2>/dev/null || true
fi

echo "✅ Puertos limpios"
echo ""
echo "Ahora puedes ejecutar: npm run dev"
