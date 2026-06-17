# Despliegue en producción

Guía para desplegar DynQR con Nginx Proxy Manager (NPM) y PM2.

## Requisitos

- Node.js 16+
- PM2: `npm install -g pm2`
- NPM apuntando al servidor

## Configuración `.env`

```env
BACKEND_PORT=5000
BACKEND_HOST=0.0.0.0
FRONTEND_PUBLIC_URL=https://tu-dominio.com
REACT_APP_API_URL=
SERVE_FRONTEND=true
NODE_ENV=production
```

`REACT_APP_API_URL` vacío = el frontend usa `/api/...` en el mismo dominio (sin CORS).

## Primera instalación

```bash
cd /opt/apps/DynQR
git clone https://github.com/sector7gp/DynQR.git .   # solo la primera vez
npm run install-all
cp .env.example .env   # editar con tus valores
npm run build
mkdir -p logs
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup            # ejecutar el comando sudo que muestre
```

## Nginx Proxy Manager

| Campo | Valor |
|-------|-------|
| Forward Hostname | `127.0.0.1` o IP del servidor |
| Forward Port | **5000** |
| Scheme | `http` |
| Websockets | OFF |

**No uses el puerto 3099** (React dev). **No agregues** locations custom en Advanced.

Ver también [deploy/nginx.example.conf](../deploy/nginx.example.conf) para nginx manual.

## PM2

```bash
npm run pm2:start      # iniciar
npm run pm2:restart    # reiniciar
npm run pm2:logs       # ver logs
npm run pm2:stop       # detener
```

Si `npm run prod` funciona pero PM2 queda en `errored`, el ecosystem usa `exec_mode: 'fork'` para evitar problemas de cluster.

Alternativa manual:

```bash
pm2 start backend/server.js --name dynqr --node-args="-r dotenv/config"
```

**No uses** `pm2 start npm -- run prod` — recompila en cada restart.

## Actualizar (redeploy)

```bash
git pull
npm run install-all    # solo si cambiaron dependencias
npm run build            # obligatorio si cambió frontend o REACT_APP_*
pm2 restart dynqr
```

## Verificación

```bash
pm2 status
curl http://127.0.0.1:5000/api/health
curl https://tu-dominio.com/api/health
```

Respuesta esperada: `{"status":"ok","tokensActive":1,...}`

En el navegador (F12), el QR debe pedir `/api/qr` o la URL del dominio — **nunca** `localhost:5000`.

## Errores frecuentes en producción

### Invalid Host header

NPM apunta al puerto **3099** (React dev). Cambiar a **5000**, compilar con `npm run build`, usar `SERVE_FRONTEND=true`.

### Error 500 (OpenResty/NPM)

| Causa | Solución |
|-------|----------|
| Proxy al puerto 3099 | Cambiar a 5000 |
| Build no generado | `npm run build` |
| Mezclar proxy NPM + nginx estático | Elegir solo una opción |

### Frontend apunta a localhost

Recompilar después de configurar `.env`: `npm run build && pm2 restart dynqr`.

## nginx manual (alternativa)

Solo si **no** usás NPM como proxy principal. Opción A (recomendada): proxy todo a puerto 5000. Opción B: estáticos + `/api/` — ver comentarios en `deploy/nginx.example.conf`.
