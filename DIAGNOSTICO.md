# 🔍 Diagnóstico - QR No Carga

## Checklist de Verificación

### 1. Backend está corriendo?
```bash
# En terminal, deberías ver:
🎬 Token inicial generado: XXXX...
🚀 Servidor corriendo en puerto 5000
📱 QR disponible en http://localhost:5000/api/qr
```

### 2. Frontend está corriendo?
```bash
# En terminal, deberías ver:
Compiled successfully!
Local:            http://localhost:3000
```

### 3. Abrir DevTools en el navegador
Presiona: F12

### 4. En la pestaña "Console"
Busca líneas con:
- ✅ "Fetching QR from: http://localhost:5000/api/qr"
- ✅ "QR Response:" (seguido de datos)

Si hay error rojo, copiar el mensaje completo

### 5. En la pestaña "Network"
1. Refresca la página (F5)
2. Busca una solicitud a "api/qr"
3. Ver Status: debería ser 200
4. Ver Response: debería tener "qrImage": "data:image/jpeg;base64,..."

## Solución Rápida

Si todo está corriendo pero no carga el QR:

```bash
# Detén ambos servidores (Ctrl+C en ambas terminales)

# Limpia caché
cd /Users/sector7gp/Code/DynQR
rm -rf node_modules/.cache
rm -rf frontend/node_modules/.cache

# Reinicia
npm run dev
```

Luego recarga la página en el navegador con Ctrl+Shift+Delete (limpiar caché).

