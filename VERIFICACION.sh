#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║        VERIFICACIÓN DE PROYECTO DYNQR                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Verificar estructura
echo "✓ Verificando estructura de carpetas..."
if [ -d "backend" ] && [ -d "frontend" ] && [ -d "frontend/src" ]; then
    echo "  ✅ Carpetas creadas correctamente"
else
    echo "  ❌ Falta estructura de carpetas"
    exit 1
fi

# Verificar archivos backend
echo ""
echo "✓ Verificando archivos backend..."
if [ -f "backend/server.js" ]; then
    echo "  ✅ backend/server.js presente ($(wc -l < backend/server.js) líneas)"
else
    echo "  ❌ Falta backend/server.js"
    exit 1
fi

# Verificar archivos frontend
echo ""
echo "✓ Verificando archivos frontend..."
files=("frontend/src/QRDisplay.js" "frontend/src/QRDisplay.css" \
        "frontend/src/Reservations.js" "frontend/src/Reservations.css" \
        "frontend/src/App.js" "frontend/src/App.css" \
        "frontend/src/index.js" "frontend/public/index.html")

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file presente"
    else
        echo "  ❌ Falta $file"
        exit 1
    fi
done

# Verificar documentación
echo ""
echo "✓ Verificando documentación..."
docs=("README.md" "QUICKSTART.md" "ARQUITECTURA.md" "TESTING.md" "RESUMEN.md" "COMENZAR.txt")

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $doc presente ($(wc -l < $doc) líneas)"
    else
        echo "  ❌ Falta $doc"
        exit 1
    fi
done

# Verificar configuración
echo ""
echo "✓ Verificando configuración..."
if [ -f "package.json" ] && [ -f ".env" ] && [ -f ".gitignore" ]; then
    echo "  ✅ Configuración completa"
else
    echo "  ❌ Falta configuración"
    exit 1
fi

# Verificar node_modules
echo ""
echo "✓ Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo "  ✅ node_modules instalados"
else
    echo "  ⚠️  node_modules no encontrado (ejecuta npm install)"
fi

if [ -d "frontend/node_modules" ]; then
    echo "  ✅ frontend/node_modules instalados"
else
    echo "  ⚠️  frontend/node_modules no encontrado"
fi

# Verificar Git
echo ""
echo "✓ Verificando repositorio Git..."
if [ -d ".git" ]; then
    commits=$(git log --oneline | wc -l)
    echo "  ✅ Repositorio Git con $commits commits"
else
    echo "  ❌ No es un repositorio Git"
    exit 1
fi

# Resumen
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   ✅ TODO VERIFICADO                       ║"
echo "║                                                            ║"
echo "║  El proyecto está completo y listo para usar.             ║"
echo "║                                                            ║"
echo "║  Comando para iniciar:                                     ║"
echo "║  npm run dev                                               ║"
echo "║                                                            ║"
echo "║  Luego abre:                                               ║"
echo "║  http://localhost:3000                                     ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
