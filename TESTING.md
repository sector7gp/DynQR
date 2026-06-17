# 🧪 Guía de Pruebas - DynQR

Aquí están todos los pasos para probar correctamente el sistema dinámico de QR y reservas.

## 🚀 Iniciar el Sistema

### Paso 1: Terminal 1 - Iniciar Backend
```bash
npm run backend
```

Verás algo como:
```
🚀 Servidor corriendo en puerto 5000
📱 QR disponible en http://localhost:5000/api/qr
🎬 Token inicial generado: a1b2c3d4-...
```

### Paso 2: Terminal 2 - Iniciar Frontend
```bash
npm run frontend
```

Verás compilación de React y luego:
```
Compiled successfully!
You can now view dynqr-frontend in your browser...
Local: http://localhost:3000
```

### Paso 3: Abrir en navegador
Ve a `http://localhost:3000`

---

## ✅ Test 1: Página Principal del QR

### Qué deberías ver:
- ✅ Título: "🎬 Escanea para Reservar"
- ✅ Subtítulo: "¡Bienvenido a Toy Story Universe!"
- ✅ Un código QR cuadrado en el centro
- ✅ Contador "⏰ Se refresca en: 30s" (cuenta hacia atrás)
- ✅ Emojis animados flotando: 🤠 🚀 👽 🐷
- ✅ Fondo con gradiente colorido (rosa → amarillo → azul)

### Acciones a probar:
1. **Espera 30 segundos** - El QR debe cambiar visualmente (aunque es difícil de notar)
2. **El contador debe llegar a 0 y reiniciar** a 30
3. **Las animaciones deben ser suaves** - Los emojis suben y bajan constantemente

---

## ✅ Test 2: QR Dinámico (Escaneo simulado)

### Opción A: Escanear con teléfono real
1. Abre la cámara de tu teléfono
2. Apunta al QR en la pantalla
3. Debería abrirse el navegador con la URL

### Opción B: Simular escaneo (sin teléfono)
1. Abre las DevTools (F12)
2. Ve a Console
3. Copia el QR actual de la API:
```javascript
fetch('http://localhost:5000/api/qr')
  .then(r => r.json())
  .then(d => console.log(d.token))
```

4. Verás un UUID como: `a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p`
5. Ve a: `http://localhost:3000/reservations?token=a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p`

---

## ✅ Test 3: Acceso Válido a Reservas

### Caso: Escanea QR dentro de 30 segundos
1. En la API, obtén el token actual
2. Ve a `http://localhost:3000/reservations?token=TOKEN_ACTUAL`

### Qué deberías ver:
- ✅ Título: "🎫 Sistema de Reservas"
- ✅ Subtítulo: "Bienvenido a Toy Story Universe"
- ✅ El iframe de Acuity Scheduling cargado
- ✅ Puedes interactuar con el calendario
- ✅ Emojis animados al pie: 🤠 🚀 👽
- ✅ Diseño colorido con estética Toy Story

### Acciones:
1. **Intenta hacer una reserva** (si el sistema de Acuity lo permite)
2. **Verifica que el iframe sea responsivo** en diferentes tamaños
3. **Zoom y zoom out** - Debe verse bien en cualquier tamaño

---

## ❌ Test 4: Token Expirado

### Caso: Esperar más de 30s y luego acceder

1. Obtén el token actual de la API
2. Anota la hora (ej: 13:23:45)
3. **Espera 35-40 segundos**
4. Intenta acceder con ese token viejo:
   `http://localhost:3000/reservations?token=TOKEN_VIEJO`

### Qué deberías ver:
- ✅ Pantalla de error roja
- ✅ Icono de error: ❌
- ✅ Título: "¡Acceso Denegado!"
- ✅ Mensaje: "Token expirado o inválido"
- ✅ Explicación: "Este sistema de reservas solo es accesible..."
- ✅ Emojis que se mecen: 🚫 🎬 🚫
- ✅ Footer con mensaje de contacto

---

## ❌ Test 5: Sin Token

### Caso: Acceder a /reservations sin token en URL

1. Ve directamente a: `http://localhost:3000/reservations`

### Qué deberías ver:
- ✅ Misma pantalla de error que Test 4
- ✅ Mensaje: "No se proporcionó un token válido"

---

## ❌ Test 6: Token Incorrecto

### Caso: Poner un UUID falso en la URL

1. Ve a: `http://localhost:3000/reservations?token=00000000-0000-0000-0000-000000000000`

### Qué deberías ver:
- ✅ Pantalla de error
- ✅ Mensaje: "Token inválido o inválido"

---

## ⏱️ Test 7: Ciclo Completo de Token

### Objetivo: Ver que los tokens se renuevan

1. **En la consola del backend**, verás:
```
🎬 Token inicial generado: abc-123-...
✨ Nuevo token QR generado: xyz-789-...
✨ Nuevo token QR generado: def-456-...
```

2. **Cada 30 segundos**, el backend genera un nuevo token
3. **El QR anterior ya no funciona**
4. **Solo el token más reciente es válido**

---

## 🔍 Test 8: API Endpoints Directos

### Test GET /api/qr
```bash
curl http://localhost:5000/api/qr | jq .
```

Respuesta esperada:
```json
{
  "success": true,
  "qrImage": "data:image/jpeg;base64,...",
  "token": "uuid-string"
}
```

### Test POST /api/validate-token (Token válido)
```bash
curl -X POST http://localhost:5000/api/validate-token \
  -H "Content-Type: application/json" \
  -d '{"token":"ACTUAL_TOKEN"}' | jq .
```

Respuesta esperada:
```json
{
  "valid": true,
  "message": "Token válido"
}
```

### Test POST /api/validate-token (Token inválido)
```bash
curl -X POST http://localhost:5000/api/validate-token \
  -H "Content-Type: application/json" \
  -d '{"token":"00000000-0000-0000-0000-000000000000"}' | jq .
```

Respuesta esperada:
```json
{
  "valid": false,
  "message": "Token inválido o expirado"
}
```

### Test GET /api/health
```bash
curl http://localhost:5000/api/health | jq .
```

Respuesta esperada:
```json
{
  "status": "ok",
  "tokensActive": 1,
  "timestamp": "2026-06-17T16:23:00.000Z"
}
```

---

## 📱 Test 9: Responsive Design

### En Desktop (1920x1080)
- ✅ QR debe estar centrado
- ✅ Debe haber espacio alrededor
- ✅ Texto debe ser legible

### En Tablet (768x1024)
1. Abre DevTools (F12)
2. Activa Device Emulation
3. Selecciona iPad
- ✅ QR debe ser más pequeño
- ✅ Debe reducirse proporcionalmente
- ✅ No debe haber scroll horizontal

### En Móvil (375x667)
1. Selecciona iPhone SE en DevTools
- ✅ QR aún debe ser visible
- ✅ Debe ocupar ~60% del ancho
- ✅ Todo debe ser tocable
- ✅ Emojis deben ser visibles

---

## 🎨 Test 10: Estética y Animaciones

### Colores esperados:
- ✅ Fondo principal: Gradiente Rosa→Amarillo→Azul
- ✅ Cajas: Blanco puro con bordes redondeados
- ✅ Bordes: Dorado brillante (#FFD700)
- ✅ Texto títulos: Rojo energético (#E74C3C)

### Animaciones esperadas:
- ✅ Los emojis flotan suavemente arriba y abajo
- ✅ El contador marca cada segundo
- ✅ El spinner de carga gira suavemente
- ✅ En error: los emojis se mecen
- ✅ Fade-in suave al cargar

---

## 🐛 Troubleshooting

### Problema: "Cannot GET /reservations"
**Solución:** Frontend no está corriendo. Ejecuta `npm run frontend`

### Problema: QR no se ve
**Solución:** 
1. Verifica en DevTools (F12) → Console
2. Busca errores CORS
3. Verifica que backend esté en puerto 5000

### Problema: Iframe de Acuity no carga
**Solución:**
1. Verifica conexión a internet
2. Verifica que el ID 39614611 sea correcto
3. Verifica permisos de CORS en servidor Acuity

### Problema: Animaciones muy lentas
**Solución:**
1. Cierra otras pestañas
2. Desactiva extensiones del navegador
3. Intenta con otro navegador (Chrome, Firefox, Safari)

---

## ✨ Resumen de Tests

| # | Caso | Resultado Esperado | Estado |
|---|------|-------------------|--------|
| 1 | Página Principal | QR visible con contador | ✅ |
| 2 | Escaneo QR | URL con token | ✅ |
| 3 | Token válido | Reservas cargadas | ✅ |
| 4 | Token expirado | Error mostrado | ✅ |
| 5 | Sin token | Error mostrado | ✅ |
| 6 | Token falso | Error mostrado | ✅ |
| 7 | Ciclo de tokens | Nuevos cada 30s | ✅ |
| 8 | APIs directas | JSON correcto | ✅ |
| 9 | Responsive | Se ve bien en móvil | ✅ |
| 10 | Estética | Colores y animaciones | ✅ |

---

## 📸 Captura de Pantallas Esperadas

### Página Principal
```
╔════════════════════════════════════════╗
║  🎬 Escanea para Reservar              ║
║  ¡Bienvenido a Toy Story Universe!     ║
║                                        ║
║        ┌──────────────────┐            ║
║        │   QR CODE HERE   │            ║
║        │     (cuadrado)   │            ║
║        └──────────────────┘            ║
║                                        ║
║    ⏰ Se refresca en: 25s               ║
║    El código QR se actualiza...        ║
║                                        ║
║      🤠  🚀  👽  🐷                    ║
╚════════════════════════════════════════╝
```

### Página de Reservas
```
╔════════════════════════════════════════╗
║  🎫 Sistema de Reservas                ║
║  Bienvenido a Toy Story Universe       ║
║                                        ║
║  ┌──────────────────────────────────┐  ║
║  │                                  │  ║
║  │   IFRAME ACUITY SCHEDULING HERE  │  ║
║  │   (Calendario de disponibilidad) │  ║
║  │                                  │  ║
║  └──────────────────────────────────┘  ║
║                                        ║
║         🤠  🚀  👽                     ║
╚════════════════════════════════════════╝
```

### Página de Error
```
╔════════════════════════════════════════╗
║            ❌                           ║
║        ¡Acceso Denegado!               ║
║                                        ║
║    Token expirado o inválido           ║
║                                        ║
║    Este sistema de reservas solo...    ║
║    es accesible escaneando el QR...    ║
║                                        ║
║       🚫  🎬  🚫                       ║
║                                        ║
║   Si crees que esto es un error,       ║
║   contacta con soporte                 ║
╚════════════════════════════════════════╝
```

---

**¿Todos los tests pasaron? ¡Sistema listo para usar! 🎉**
