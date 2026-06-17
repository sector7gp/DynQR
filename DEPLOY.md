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
# o con PM2:
pm2 start "npm run backend" --name dynqr
```

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
