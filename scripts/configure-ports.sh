#!/bin/bash
# Configurar puertos interactivamente
cd "$(dirname "$0")/.."

BACKEND_PORT=$(grep "^BACKEND_PORT=" .env | cut -d'=' -f2 || echo "5000")
REACT_APP_PORT=$(grep "^REACT_APP_PORT=" .env | cut -d'=' -f2 || echo "3000")

echo "Configurador de puertos - DynQR"
echo "Backend: $BACKEND_PORT | Frontend: $REACT_APP_PORT"
echo ""

read -p "Nuevo puerto Backend [$BACKEND_PORT]: " new_backend_port
new_backend_port=${new_backend_port:-$BACKEND_PORT}

read -p "Nuevo puerto Frontend [$REACT_APP_PORT]: " new_frontend_port
new_frontend_port=${new_frontend_port:-$REACT_APP_PORT}

new_api_url="http://localhost:$new_backend_port"

sed -i.bak "s/^BACKEND_PORT=.*/BACKEND_PORT=$new_backend_port/" .env
sed -i.bak "s/^REACT_APP_PORT=.*/REACT_APP_PORT=$new_frontend_port/" .env
sed -i.bak "s|^REACT_APP_API_URL=.*|REACT_APP_API_URL=$new_api_url|" .env
rm -f .env.bak

if [ -f frontend/.env.local ]; then
  sed -i.bak "s|^REACT_APP_API_URL=.*|REACT_APP_API_URL=$new_api_url|" frontend/.env.local
  sed -i.bak "s/^PORT=.*/PORT=$new_frontend_port/" frontend/.env.local
  rm -f frontend/.env.local.bak
fi

echo "Actualizado. Reinicia con: npm run dev"
