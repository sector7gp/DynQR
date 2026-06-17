#!/bin/bash

# Script para configurar los puertos de DynQR

echo "🎬 Configurador de Puertos - DynQR"
echo "===================================="
echo ""

# Leer valores actuales del .env
BACKEND_PORT=$(grep "^BACKEND_PORT=" .env | cut -d'=' -f2 || echo "5000")
REACT_APP_PORT=$(grep "^REACT_APP_PORT=" .env | cut -d'=' -f2 || echo "3000")
REACT_APP_API_URL=$(grep "^REACT_APP_API_URL=" .env | cut -d'=' -f2 || echo "http://localhost:5000")

echo "Configuración actual:"
echo "  Backend Port: $BACKEND_PORT"
echo "  Frontend Port: $REACT_APP_PORT"
echo "  API URL: $REACT_APP_API_URL"
echo ""

# Preguntar nuevos valores
read -p "Nuevo puerto para Backend (actual: $BACKEND_PORT): " new_backend_port
new_backend_port=${new_backend_port:-$BACKEND_PORT}

read -p "Nuevo puerto para Frontend (actual: $REACT_APP_PORT): " new_frontend_port
new_frontend_port=${new_frontend_port:-$REACT_APP_PORT}

new_api_url="http://localhost:$new_backend_port"

# Actualizar .env
echo "Actualizando .env..."
sed -i.bak "s/^BACKEND_PORT=.*/BACKEND_PORT=$new_backend_port/" .env
sed -i.bak "s/^REACT_APP_PORT=.*/REACT_APP_PORT=$new_frontend_port/" .env
sed -i.bak "s|^REACT_APP_API_URL=.*|REACT_APP_API_URL=$new_api_url|" .env
rm .env.bak

# Actualizar frontend/.env.local
echo "Actualizando frontend/.env.local..."
sed -i.bak "s|^REACT_APP_API_URL=.*|REACT_APP_API_URL=$new_api_url|" frontend/.env.local
sed -i.bak "s/^PORT=.*/PORT=$new_frontend_port/" frontend/.env.local
rm frontend/.env.local.bak

echo ""
echo "✅ Configuración actualizada:"
echo "  Backend Port: $new_backend_port"
echo "  Frontend Port: $new_frontend_port"
echo "  API URL: $new_api_url"
echo ""
echo "Los cambios tomarán efecto cuando reinicies los servidores."
echo "Ejecuta: npm run dev"
