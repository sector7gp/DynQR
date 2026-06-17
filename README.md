# DynQR

Sistema de QR dinámico (refresh cada 30s) que dirige a un sistema de reservas protegido por token. Estética Toy Story 5.

## Inicio rápido

```bash
npm run install-all
cp .env.example .env
npm run dev
```

Abrir `http://localhost:3000` (puertos configurables en `.env`).

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo (backend + frontend) |
| `npm run build` | Compilar frontend |
| `npm run prod` | Build + backend en producción |
| `npm run backend` | Solo backend |
| `npm run pm2:start` | Iniciar con PM2 |
| `npm run pm2:restart` | Reiniciar PM2 |

## Flujo

1. Usuario ve el QR en pantalla
2. Escanea con el móvil
3. Backend valida el token
4. Si es válido → reservas (Acuity); si no → error

## Documentación

- [Despliegue](docs/deploy.md) — NPM, PM2, producción
- [Configuración](docs/configuration.md) — variables `.env`, puertos, textos QR
- [Troubleshooting](docs/troubleshooting.md) — errores comunes
- [Arquitectura](docs/architecture.md) — flujo y componentes

## Estructura

```
DynQR/
├── backend/server.js
├── frontend/src/
├── docs/
├── scripts/
├── deploy/
├── ecosystem.config.cjs
└── .env
```

## API

`GET /api/qr` · `POST /api/validate-token` · `GET /api/health`

Detalle en [docs/configuration.md](docs/configuration.md).
