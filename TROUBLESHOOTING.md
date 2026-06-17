# 🔧 Troubleshooting - Puertos y Ejecución

## Problema: "Something is already running on port 3000"

### Causa
React o Node.js está corriendo en el puerto 3000 de una ejecución anterior.

### Soluciones

#### Opción 1: Limpiar puertos (RECOMENDADO)
```bash
bash cleanup-ports.sh
npm run dev
```

#### Opción 2: Usar diferentes puertos
Edita `.env`:
```
BACKEND_PORT=5001
REACT_APP_PORT=3001
REACT_APP_API_URL=http://localhost:5001
```

Luego:
```bash
npm run dev
```

#### Opción 3: Matar procesos manualmente

**En macOS/Linux:**
```bash
# Ver qué está usando puerto 3000
lsof -i :3000

# Matar el proceso
kill -9 <PID>

# Lo mismo para puerto 5000
lsof -i :5000
kill -9 <PID>
```

**En Windows:**
```bash
# Ver qué está usando puerto 3000
netstat -ano | findstr :3000

# Matar el proceso
taskkill /PID <PID> /F

# Lo mismo para puerto 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### Opción 4: Usar el script de inicio personalizado
```bash
bash start.sh
```

Este script automáticamente:
- Lee la configuración de `.env`
- Pasa los puertos correctos a ambos servidores
- Usa concurrently para ejecutar ambos

## Problema: Frontend no lee `REACT_APP_API_URL`

### Causa
React necesita que las variables tengan el prefijo `REACT_APP_` y debe reiniciarse para leerlas.

### Solución
```bash
# Ctrl+C para detener
# Luego:
npm run dev
```

El script `start.sh` automáticamente:
1. Lee `.env`
2. Exporta todas las variables
3. Ejecuta ambos servidores con las variables correctas

## Problema: Backend no lee `BACKEND_PORT`

### Causa
El backend no está usando dotenv correctamente.

### Solución
```bash
# Asegúrate de que en package.json está:
"backend": "node -r dotenv/config backend/server.js"

# Luego ejecuta:
npm run backend
```

La opción `-r dotenv/config` carga el `.env` automáticamente.

## Problema: Puerto ya está en uso en producción

### Solución
Cambia los puertos usando el script:
```bash
bash configure-ports.sh
```

O edita `.env` directamente:
```
BACKEND_PORT=8080
REACT_APP_PORT=8081
REACT_APP_API_URL=http://tu-dominio.com:8080
```

## Scripts útiles

### Limpiar puertos
```bash
bash cleanup-ports.sh
```

### Configurar puertos interactivamente
```bash
bash configure-ports.sh
```

### Iniciar con configuración del .env
```bash
bash start.sh
```

### Iniciar normalmente
```bash
npm run dev
```

## Checklist de verificación

- [ ] `.env` existe y tiene valores
- [ ] `BACKEND_PORT` está configurado
- [ ] `REACT_APP_PORT` está configurado
- [ ] `REACT_APP_API_URL` apunta al puerto correcto del backend
- [ ] No hay procesos corriendo en esos puertos
- [ ] Has ejecutado `npm run install-all` al menos una vez
- [ ] React se compiló sin errores
- [ ] Backend inició sin errores

Si todo está en verde, el sistema debería funcionar perfectamente.
