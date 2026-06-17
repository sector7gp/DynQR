# 🚀 Despliegue en Producción

## ⚠️ Error "Invalid Host header"

Este error aparece cuando NPM apunta al **servidor de desarrollo de React** (`npm start` / puerto **3099**).

Webpack bloquea peticiones cuyo `Host` es `dynqr.sector7gp.com` porque solo espera `localhost`.

**No uses `npm run dev` ni `npm start` en producción.**

### Solución

1. Compilar el frontend:
   ```bash
   npm run build
   ```

2. En `.env`:
   ```env
   SERVE_FRONTEND=true
   FRONTEND_PUBLIC_URL=https://dynqr.sector7gp.com
   REACT_APP_API_URL=
   ```

3. Iniciar **solo el backend** (sirve frontend + API):
   ```bash
   npm run backend
   ```

4. En NPM cambiar **Forward Port: 3099 → 5000**

5. Detener el proceso React dev que corre en 3099:
   ```bash
   pm2 stop dynqr-frontend   # o kill del proceso en 3099
   ```

---

## ⚠️ Error 500 con OpenResty / Nginx Proxy Manager

Si ves **500 Internal Server Error**, casi siempre es una de estas causas:

| Causa | Solución |
|-------|----------|
| Proxy apunta al puerto **3099** (React dev) | Cambiar a puerto **5000** (backend) |
| nginx intenta servir `/var/www/.../build` que **no existe** | Usar Opción A (proxy todo a Node) |
| Backend no tiene el build | `npm run build` + `SERVE_FRONTEND=true` |
| Mezclaste proxy completo + config estática | Elegir **solo una** opción |

---

## Opción A: Nginx Proxy Manager / OpenResty (RECOMENDADA)

La más simple. El proxy envía **todo** el tráfico al backend Node en puerto 5000.

### 1. En el servidor — `.env`

```env
BACKEND_PORT=5000
BACKEND_HOST=0.0.0.0
FRONTEND_PUBLIC_URL=https://dynqr.sector7gp.com
REACT_APP_API_URL=
SERVE_FRONTEND=true
```

### 2. Compilar e iniciar

```bash
git pull
npm run build
npm run backend
```

Para producción con PM2, ver la sección [Despliegue con PM2](#despliegue-con-pm2-producción) más abajo.

### 3. En Nginx Proxy Manager

| Campo | Valor |
|-------|-------|
| Domain Names | `dynqr.sector7gp.com` |
| Forward Hostname | `127.0.0.1` (o `10.10.7.10`) |
| Forward Port | **5000** |
| Scheme | `http` |
| Websockets | OFF |

**No agregues** locations custom de `/api/` en Advanced — no hace falta.

### 4. Verificar

```bash
curl http://127.0.0.1:5000/api/health
curl https://dynqr.sector7gp.com/api/health
```

---

## Despliegue con PM2 (producción)

PM2 mantiene el proceso Node corriendo, lo reinicia si falla y permite ver logs fácilmente.

### Requisitos

```bash
npm install -g pm2
```

### 1. Configurar `.env`

```env
BACKEND_PORT=5000
BACKEND_HOST=0.0.0.0
FRONTEND_PUBLIC_URL=https://dynqr.sector7gp.com
REACT_APP_API_URL=
SERVE_FRONTEND=true
NODE_ENV=production
```

### 2. Primera instalación en el servidor

```bash
cd /opt/apps/DynQR          # ruta donde clonaste el repo
git clone https://github.com/sector7gp/DynQR.git .   # solo la primera vez

npm run install-all
cp .env.example .env        # editar con tus valores
npm run build
mkdir -p logs
```

### 3. Iniciar con PM2

**Opción A — archivo ecosystem (recomendado):**

```bash
pm2 start ecosystem.config.cjs
```

**Opción B — npm script:**

```bash
npm run pm2:start
```

**Opción C — comando directo:**

```bash
pm2 start backend/server.js --name dynqr --node-args="-r dotenv/config"
```

### 4. Persistir tras reinicio del servidor

```bash
pm2 save
pm2 startup
# PM2 mostrará un comando sudo — copialo y ejecutalo
```

### 5. Nginx Proxy Manager

| Campo | Valor |
|-------|-------|
| Forward Hostname | `127.0.0.1` o IP del servidor |
| Forward Port | **5000** |
| Scheme | `http` |

No uses el puerto 3099 (React dev) en producción.

### Comandos útiles

```bash
pm2 status              # estado de procesos
pm2 logs dynqr          # logs en tiempo real
pm2 logs dynqr --lines 100
npm run pm2:restart     # reiniciar tras cambios en backend
npm run pm2:stop        # detener
npm run pm2:delete      # eliminar de PM2
```

### Actualizar la app (redeploy)

Cada vez que subas cambios a Git:

```bash
cd /opt/apps/DynQR
git pull
npm run install-all     # solo si cambiaron dependencias
npm run build             # obligatorio si cambió el frontend
pm2 restart dynqr
pm2 logs dynqr --lines 50
```

Si cambiaste variables `REACT_APP_*` en `.env`, **siempre** hay que volver a compilar:

```bash
npm run build
pm2 restart dynqr
```

### Verificar que todo funciona

```bash
pm2 status
curl http://127.0.0.1:5000/api/health
curl https://dynqr.sector7gp.com/api/health
```

Respuesta esperada:

```json
{"status":"ok","tokensActive":1,"timestamp":"..."}
```

### Solución de problemas con PM2

| Problema | Qué hacer |
|----------|-----------|
| `errored` o reinicios constantes | `pm2 logs dynqr --err` |
| Puerto 5000 en uso | `lsof -i :5000` y matar el proceso, o cambiar `BACKEND_PORT` |
| Frontend no carga | Verificar `npm run build` y `SERVE_FRONTEND=true` |
| QR apunta a localhost | Recompilar con `FRONTEND_PUBLIC_URL` correcto en `.env` |
| Invalid Host header | NPM no debe apuntar al puerto 3099 (React dev) |

### Detener procesos viejos

Si antes corrías frontend y backend por separado:

```bash
pm2 list
pm2 delete dynqr-frontend   # o el nombre que tuviera
pm2 delete all              # cuidado: borra todos los procesos PM2
pm2 start ecosystem.config.cjs
pm2 save
```

---

## Opción B: nginx manual (estáticos + /api)

Solo si tenés acceso directo al nginx y **no** usás NPM para el proxy principal.

Ver `nginx.example.conf` — Opción B comentada.

**Importante:** la ruta `root` debe existir y tener `index.html`:
```bash
ls frontend/build/index.html
```

---

## Problema común: frontend apunta a localhost

Si ves en la consola:
```
Fetching QR from: http://localhost:5000/api/qr
CORS blocked...
```

El frontend fue compilado **sin la configuración correcta**. En React, `REACT_APP_*` se embebe al hacer `npm run build`. Hay que **recompilar** después de configurar.

---

## Opción A: Mismo dominio con nginx (RECOMENDADO)

Ejemplo: `https://dynqr.sector7gp.com`

### 1. Configurar `.env` en el servidor

```env
BACKEND_PORT=5000
BACKEND_HOST=0.0.0.0
FRONTEND_PUBLIC_URL=https://dynqr.sector7gp.com
REACT_APP_API_URL=
```

`REACT_APP_API_URL` vacío = el frontend usa `/api/...` (mismo dominio, sin CORS).

### 2. Compilar frontend

```bash
cd frontend
npm run build
```

### 3. Configurar nginx

Usa `nginx.example.conf` como referencia:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:5000/api/;
}

location / {
    root /ruta/a/DynQR/frontend/build;
    try_files $uri $uri/ /index.html;
}
```

### 4. Iniciar backend

```bash
npm run backend
```

O con PM2:
```bash
pm2 start backend/server.js --name dynqr-api
```

---

## Opción B: Frontend y backend en puertos distintos

Ejemplo: frontend en `http://10.10.7.10:3099`, backend en `http://10.10.7.10:5000`

### 1. Configurar `.env`

```env
BACKEND_PORT=5000
BACKEND_HOST=0.0.0.0
REACT_APP_PORT=3099
FRONTEND_PUBLIC_URL=http://10.10.7.10:3099
REACT_APP_API_URL=http://10.10.7.10:5000
CORS_ORIGINS=http://10.10.7.10:3099,https://dynqr.sector7gp.com
```

### 2. Recompilar frontend (obligatorio)

```bash
cd frontend
REACT_APP_API_URL=http://10.10.7.10:5000 npm run build
```

### 3. Iniciar servicios

```bash
npm run dev
# o por separado:
npm run backend
# y servir frontend/build con nginx o serve
```

---

## Checklist rápido para dynqr.sector7gp.com

1. [ ] `.env` con `FRONTEND_PUBLIC_URL=https://dynqr.sector7gp.com`
2. [ ] `REACT_APP_API_URL` vacío si nginx hace proxy de `/api`
3. [ ] `npm run build` en frontend **después** de configurar
4. [ ] nginx proxy `/api/` → `localhost:5000`
5. [ ] Backend corriendo en puerto 5000
6. [ ] Probar: `https://dynqr.sector7gp.com/api/health`

---

## Verificación

```bash
# Backend OK
curl https://dynqr.sector7gp.com/api/health

# Debe responder: {"status":"ok",...}
```

En el navegador (F12 → Console), deberías ver:
```
Fetching QR from: /api/qr
```
o
```
Fetching QR from: https://dynqr.sector7gp.com/api/qr
```

**Nunca** debería decir `localhost:5000` en producción.
