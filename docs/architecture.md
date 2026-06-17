# Arquitectura

## Resumen

DynQR genera un QR dinámico cada 30 segundos con un token único. Al escanearlo, el usuario accede al sistema de reservas (Acuity Scheduling) solo si el token es válido.

## Componentes

```
Backend (Express, puerto 5000)
  ├── Generador de tokens UUID (cada 30s)
  ├── GET  /api/qr
  ├── POST /api/validate-token
  └── GET  /api/health

Frontend (React)
  ├── /              → Página QR
  ├── /reservations  → Reservas (token válido) o error
  └── iframe Acuity Scheduling
```

## Flujo

1. Pantalla principal muestra QR con countdown
2. Usuario escanea QR → `/reservations?token=XXX`
3. Frontend valida token contra backend
4. Si válido → iframe de reservas; si no → pantalla de error

## Tokens

- Un token UUID válido a la vez
- Se regenera cada 30 segundos
- El anterior expira automáticamente
- Validación siempre en backend

## Seguridad

- No se confía en validación del cliente
- URL de reservas no accesible sin token válido
- QR codifica `FRONTEND_PUBLIC_URL/reservations?token=...`

## Producción típica

```
Usuario → NPM (443) → Node:5000 (Express sirve build + /api)
```

Con `SERVE_FRONTEND=true`, un solo proceso sirve frontend compilado y API.
