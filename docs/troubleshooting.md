# Troubleshooting

## Desarrollo local

### Puerto ya en uso

```bash
bash scripts/cleanup-ports.sh
npm run dev
```

O cambiar puertos en `.env` con `bash scripts/configure-ports.sh`.

### El QR no carga

1. Backend corriendo en el puerto de `BACKEND_PORT`
2. Consola del navegador (F12) — buscar errores CORS o red
3. Probar: `curl http://localhost:5000/api/health`

### Frontend no toma variables `.env`

Las variables `REACT_APP_*` se embeben al compilar. En dev, reiniciar `npm run dev`. En producción, `npm run build`.

## `.env` y compilación

### `para: command not found` al hacer build

El script antiguo usaba `source .env` en bash. Valores con espacios sin comillas rompen la carga.

**Solución:** usar comillas:

```env
REACT_APP_QR_SUBTITLE="Texto con espacios y acentos"
```

El script `npm run build` usa `dotenv-cli` para evitar este problema.

### Archivo en ISO-8859 (sin acentos)

```bash
file .env
iconv -f ISO-8859-1 -t UTF-8 .env.backup -o .env
export LANG=es_AR.UTF-8
```

### Cambié el título pero sigue el default

1. Comillas en `.env` si hay espacios
2. `npm run build`
3. `pm2 restart dynqr`

Verificar en build:

```bash
grep -r "tu texto" frontend/build/static/js/
```

## Producción

Ver [deploy.md](./deploy.md) para Invalid Host header, error 500, y frontend apuntando a localhost.

### PM2 en `errored` pero `npm run prod` funciona

1. Detener proceso manual: Ctrl+C o `pm2 delete dynqr`
2. Puerto 5000 libre: `lsof -i :5000`
3. Reiniciar:

```bash
npm run build
npm run pm2:start
```

El `ecosystem.config.cjs` usa `exec_mode: 'fork'` (igual que `npm run prod`).

### PM2 logs vacíos

```bash
pm2 logs dynqr --lines 50 --nostream
cat logs/pm2-error.log
node -r dotenv/config backend/server.js   # probar sin PM2
```

## Checklist rápido

- [ ] `.env` en UTF-8, textos con espacios entre comillas
- [ ] `npm run build` después de cambiar `REACT_APP_*`
- [ ] NPM → puerto **5000** (no 3099)
- [ ] `SERVE_FRONTEND=true` en producción
- [ ] `curl http://127.0.0.1:5000/api/health` responde OK

## Scripts útiles

```bash
bash scripts/start.sh           # dev (alternativa a npm run dev)
bash scripts/cleanup-ports.sh
bash scripts/configure-ports.sh
bash scripts/verify.sh          # verificar estructura
```
