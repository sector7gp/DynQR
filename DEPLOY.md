# 🚀 Despliegue en Producción

## Problema común

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
