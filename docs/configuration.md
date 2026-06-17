# Configuración

Todas las variables van en `.env` en la raíz del proyecto. Copiá `.env.example` como base.

## Backend

| Variable | Descripción | Default |
|----------|-------------|---------|
| `BACKEND_PORT` | Puerto del servidor Express | `5000` |
| `BACKEND_HOST` | Host de escucha (`0.0.0.0` en producción) | `localhost` |
| `FRONTEND_PUBLIC_URL` | URL pública del sitio (va dentro del QR) | — |
| `SERVE_FRONTEND` | Express sirve `frontend/build` | `true` |
| `CORS_ORIGINS` | Orígenes permitidos, separados por coma | auto |
| `NODE_ENV` | Entorno (`production` en prod) | — |

## Frontend (requieren `npm run build`)

| Variable | Descripción | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | URL del API. Vacío = `/api` mismo origen | vacío |
| `REACT_APP_PORT` | Puerto dev de React | `3000` |
| `REACT_APP_QR_TITLE` | Título de la página QR | `Escanea para Reservar` |
| `REACT_APP_QR_SUBTITLE` | Subtítulo / bienvenida | `¡Bienvenido a Toy Story Universe!` |
| `REACT_APP_SHOW_COUNTDOWN` | Mostrar cuadro contador (`true`/`false`) | `true` |

### Textos con espacios o acentos

Usá comillas en `.env`:

```env
REACT_APP_QR_SUBTITLE="¡Bienvenido a Toy Story Universe!"
```

El archivo debe estar en **UTF-8** (no ISO-8859):

```bash
file .env   # debe decir: UTF-8 Unicode text
iconv -f ISO-8859-1 -t UTF-8 .env.backup -o .env
```

### Cambios en `REACT_APP_*`

Siempre recompilar:

```bash
npm run build
pm2 restart dynqr   # en producción
```

## Puertos

```bash
bash scripts/configure-ports.sh   # interactivo
bash scripts/cleanup-ports.sh      # liberar puertos ocupados
```

Ejemplo manual:

```env
BACKEND_PORT=8080
REACT_APP_PORT=3001
REACT_APP_API_URL=http://localhost:8080
```

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/qr` | QR actual + token |
| POST | `/api/validate-token` | Validar token `{ "token": "..." }` |
| GET | `/api/health` | Estado del servidor |

## Ejemplo producción

```env
BACKEND_PORT=5000
BACKEND_HOST=0.0.0.0
FRONTEND_PUBLIC_URL=https://dynqr.sector7gp.com
REACT_APP_API_URL=
SERVE_FRONTEND=true
REACT_APP_QR_TITLE="Escanea para Reservar"
REACT_APP_QR_SUBTITLE="¡Bienvenido a Toy Story Universe!"
REACT_APP_SHOW_COUNTDOWN=true
```
