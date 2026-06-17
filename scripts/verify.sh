#!/bin/bash
# Verificar estructura del proyecto
cd "$(dirname "$0")/.."

echo "Verificando DynQR..."
errors=0

for dir in backend frontend frontend/src docs scripts deploy; do
  [ -d "$dir" ] || { echo "Falta: $dir"; errors=1; }
done

for file in backend/server.js ecosystem.config.cjs package.json .env.example; do
  [ -f "$file" ] || { echo "Falta: $file"; errors=1; }
done

for doc in docs/deploy.md docs/configuration.md docs/troubleshooting.md docs/architecture.md; do
  [ -f "$doc" ] || { echo "Falta: $doc"; errors=1; }
done

[ -f frontend/build/index.html ] && echo "Build de produccion presente" || echo "Build no generado (npm run build)"

if [ $errors -eq 0 ]; then
  echo "Proyecto OK. Iniciar con: npm run dev"
else
  echo "Hay problemas en la estructura."
  exit 1
fi
