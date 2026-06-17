# 🎬 DynQR - Solución Completa Instalada

## ✅ ¿Qué se instaló?

Tu solución **DynQR** está lista. Es un sistema completo que genera un **QR dinámico** que se refresca cada 30 segundos y que dirige a un **sistema de reservas** protegido, ambos con **estética Toy Story 5**.

---

## 📦 Estructura del Proyecto

```
DynQR/
├── 🔧 backend/
│   └── server.js                    # Servidor Express (puerto 5000)
│
├── 🎨 frontend/
│   ├── public/index.html            # HTML principal
│   └── src/
│       ├── QRDisplay.js             # Página del QR dinámico
│       ├── QRDisplay.css            # Estilos página QR
│       ├── Reservations.js          # Página de reservas + validación
│       ├── Reservations.css         # Estilos página reservas
│       ├── App.js                   # Componente principal
│       └── App.css                  # Estilos globales
│
├── 📖 Documentación
│   ├── README.md                    # Guía completa
│   ├── ARQUITECTURA.md              # Diagrama del sistema
│   └── TESTING.md                   # Guía de pruebas
│
└── ⚙️ Configuración
    ├── package.json                 # Dependencias raíz
    ├── .gitignore                   # Git configuración
    └── .env                         # Variables de entorno
```

---

## 🚀 Cómo Iniciar

### Opción 1: Ambos servidores simultáneamente (RECOMENDADO)
```bash
cd /Users/sector7gp/Code/DynQR
npm run dev
```

### Opción 2: Servidores por separado
**Terminal 1:**
```bash
npm run backend
```

**Terminal 2:**
```bash
npm run frontend
```

### ✅ Cuando esté listo verás:
- Backend: `🚀 Servidor corriendo en puerto 5000`
- Frontend: `Compiled successfully!` y accesible en `http://localhost:3000`

---

## 🎯 Cómo Funciona

### 1️⃣ **Página Principal** (http://localhost:3000)
- Muestra un **QR dinámico** 
- Se refresca automáticamente cada **30 segundos**
- Contador visual mostrando segundos restantes
- Decoraciones animadas con emojis de Toy Story

### 2️⃣ **Escanear el QR**
- El QR contiene una URL: `http://localhost:3000/reservations?token=UNIQUE_TOKEN`
- Cada QR tiene un token **único y temporal** (válido 30s)

### 3️⃣ **Página de Reservas** (acceso válido)
- Si el token es válido → Se muestra el **iframe de Acuity Scheduling**
- Usuario puede ver calendario y hacer reserva
- Diseño con estética Toy Story

### 4️⃣ **Página de Error** (acceso inválido)
- Si el token es inválido o expirado → Pantalla de error amigable
- Si acceden sin token → Pantalla de error
- Anima al usuario a escanear el QR válido

---

## 🔐 Seguridad

✅ **Tokens únicos por sesión**
- Cada 30 segundos se genera un UUID único
- Solo 1 token es válido a la vez
- El anterior se invalida automáticamente

✅ **Validación en servidor**
- No se confía en la validación del cliente
- Backend valida cada solicitud

✅ **Sin exposición directa**
- URL del iframe de reservas NO es accesible directamente
- Solo funciona con token válido del QR

---

## 🎨 Estética Toy Story 5

### Colores Vibrantes:
- 🎀 **Rosa**: #FF6B9D
- 💛 **Amarillo**: #FEC868  
- 🌊 **Azul**: #66D9EF
- ❤️ **Rojo**: #E74C3C
- ⭐ **Oro**: #FFD700

### Elementos Visuales:
- Fuentes redondeadas y amigables (Fredoka, Nunito)
- Bordes redondeados y suaves
- Animaciones fluidas (flotación, rebote, rotación)
- Emojis: 🤠 🚀 👽 🐷 🎬 🎫
- Gradientes coloridos

---

## 📱 Responsive Design

✅ Funciona perfecto en:
- 📱 Móviles (320px+)
- 📊 Tablets (768px+)
- 💻 Desktop (1200px+)

---

## 🔗 URLs Importantes

| Función | URL | Nota |
|---------|-----|------|
| Página Principal (QR) | http://localhost:3000 | Pública |
| Reservas (válido) | http://localhost:3000/reservations?token=XXX | Requiere token |
| Error (inválido) | http://localhost:3000/reservations | Sin token |
| API QR | http://localhost:5000/api/qr | Devuelve JSON |
| Validar Token | POST http://localhost:5000/api/validate-token | Backend |
| Health Check | http://localhost:5000/api/health | Estado servidor |

---

## 🧪 Cómo Probar

### Test Rápido (5 minutos)
1. Abre http://localhost:3000
2. Deberías ver un QR con contador de 30s
3. Copia el token de la API en DevTools
4. Ve a http://localhost:3000/reservations?token=TOKEN
5. Deberías ver el iframe de Acuity
6. Espera 35s e intenta acceder con token viejo
7. Deberías ver pantalla de error

### Test Completo
Ver archivo **TESTING.md** para todos los casos

---

## ⚙️ Personalización

### Cambiar el logo de Acuity
En `frontend/src/Reservations.js`, línea 40:
```javascript
<iframe 
  src="https://app.acuityscheduling.com/schedule.php?owner=39614611&ref=embedded_csp"
  // ↑ Cambia este ID por el tuyo
```

### Cambiar los colores
En `frontend/src/QRDisplay.css` y `Reservations.css`:
```css
background: linear-gradient(135deg, #FF6B9D 0%, #FEC868 50%, #66D9EF 100%);
/* Cambia estos colores hex */
```

### Cambiar emojis de decoración
En los archivos `.js`:
```jsx
<span className="toy">🤠</span>  {/* Cambia por otro emoji */}
```

### Cambiar tiempo de refresco (30 segundos)
En `backend/server.js`, línea 22:
```javascript
setInterval(() => {
  const newToken = uuidv4();
  // ...
}, 30000);  // ← Cambia este número (en milisegundos)
```

---

## 📊 Estadísticas del Sistema

- **Backend**: Express.js en Node.js
- **Frontend**: React 18
- **Generador QR**: librería `qrcode`
- **Tokens**: UUIDs únicos
- **Estilos**: CSS puro + Animations
- **Responsive**: Diseño mobile-first

---

## 🐛 Si Algo No Funciona

1. **Verifica que ambos servidores estén corriendo**
   - Backend en puerto 5000
   - Frontend en puerto 3000

2. **Limpia cache y recarga**
   - Ctrl+Shift+Delete (DevTools)
   - Recarga la página

3. **Revisa los logs**
   - Terminal backend: busca errores 🔴
   - Console navegador (F12): busca errores rojo

4. **Reinstala dependencias si necesario**
   ```bash
   npm run install-all
   ```

---

## 📚 Documentación Disponible

- **README.md** - Guía completa y exhaustiva
- **ARQUITECTURA.md** - Diagrama del sistema y flujos
- **TESTING.md** - Paso a paso para probar cada función

---

## 🎉 ¡Sistema Listo!

Tu solución DynQR está completamente funcional. 

### Próximos pasos:
1. Ejecuta `npm run dev`
2. Abre http://localhost:3000
3. Escanea el QR
4. ¡Disfruta del sistema!

**¿Preguntas? Revisa la documentación incluida o modifica según tus necesidades.** 🚀

---

*Proyecto generado con ❤️ - Estética Toy Story 5*
