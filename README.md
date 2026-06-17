# 🎬 DynQR - Sistema Dinámico de Reservas con QR

Un sistema moderno y lúdico con **estética Toy Story 5** que genera un QR dinámico que se refresca cada 30 segundos y dirige a un sistema de reservas accesible SOLO mediante el código QR válido.

## 🎯 Características

✨ **QR Dinámico**: Se genera automáticamente cada 30 segundos con un token único
🔐 **Sistema de Tokens**: Validación en tiempo real - solo el QR válido permite acceder
📱 **Sistema de Reservas Embebido**: Iframe de Acuity Scheduling integrado
🚫 **Protección de Acceso**: Pantalla de error si intentan acceder sin token válido
🎨 **Estética Toy Story 5**: Colores vibrantes, animaciones y diseño amigable

## 🚀 Instalación

### Requisitos
- Node.js 16+ 
- npm 8+

### Pasos de instalación

1. **Clonar el repositorio**
```bash
cd /Users/sector7gp/Code/DynQR
```

2. **Instalar todas las dependencias**
```bash
npm run install-all
```

Esto instalará las dependencias del backend y frontend automáticamente.

## 🏃 Ejecución

### Opción 1: Ejecutar ambos servidores simultáneamente (RECOMENDADO)
```bash
npm run dev
```

Esto usará automáticamente los puertos configurados en `.env`.

### Opción 2: Ejecutar servidores por separado

**Terminal 1 - Backend**
```bash
npm run backend
```

**Terminal 2 - Frontend**
```bash
npm run frontend
```

## 📋 Estructura del Proyecto

```
DynQR/
├── backend/
│   └── server.js              # Servidor Express con generación de QR
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML principal
│   └── src/
│       ├── QRDisplay.js       # Componente página QR
│       ├── QRDisplay.css      # Estilos página QR
│       ├── Reservations.js    # Componente página reservas
│       ├── Reservations.css   # Estilos página reservas
│       ├── App.js             # Componente principal
│       ├── App.css            # Estilos globales
│       └── index.js           # Punto de entrada React
├── package.json               # Dependencias del proyecto
├── .env                       # Variables de entorno
└── README.md                  # Este archivo

```

## 🔌 Endpoints de la API

### GET `/api/qr`
Obtiene el QR actual con imagen en formato DataURL

**Respuesta:**
```json
{
  "success": true,
  "qrImage": "data:image/jpeg;base64,...",
  "token": "uuid-token-string"
}
```

### POST `/api/validate-token`
Valida si un token es actualmente válido

**Request:**
```json
{
  "token": "uuid-token-string"
}
```

**Respuesta:**
```json
{
  "valid": true,
  "message": "Token válido"
}
```

### GET `/api/health`
Verifica el estado del servidor

**Respuesta:**
```json
{
  "status": "ok",
  "tokensActive": 1,
  "timestamp": "2026-06-17T16:23:00.000Z"
}
```

## 🎨 Páginas

### 1. Página Principal (QR) - `http://localhost:3000/`
- Muestra el código QR dinámico
- Cuenta regresiva de 30 segundos hasta el siguiente QR
- Decoraciones animadas con personajes de Toy Story
- Estética colorida y amigable

### 2. Página de Reservas - `http://localhost:3000/reservations?token=TOKEN`
- Accesible SOLO con un token válido
- Embebe el iframe de Acuity Scheduling
- Diseño limpio con estética Toy Story

### 3. Página de Error (No Autorizado)
- Se muestra cuando:
  - No hay token en la URL
  - El token es inválido o expirado
- Mensaje claro y decoraciones animadas
- Invita al usuario a escanear el QR válido

## 🔐 Seguridad

- **Tokens únicos por sesión**: Cada 30 segundos se genera un nuevo token
- **Validación en servidor**: No se confía en validación del lado del cliente
- **Tokens de corta duración**: Se eliminan automáticamente después de 30 segundos
- **Sin exposición de URL**: El iframe de reservas no es accesible directamente

## 🎨 Paleta de Colores (Toy Story 5)

- **Rosa Vibrante**: #FF6B9D
- **Amarillo Cálido**: #FEC868
- **Azul Cielo**: #66D9EF
- **Rojo Energético**: #E74C3C
- **Oro Brillante**: #FFD700
- **Azul Profundo**: #3498DB

## 📱 Responsive Design

Ambas páginas están optimizadas para:
- 📱 Dispositivos móviles (320px+)
- 🖥️ Tablets (768px+)
- 💻 Escritorio (1200px+)

## 🎯 Flujo de Usuario

1. Usuario ve la página principal con el QR
2. Usuario escanea el QR con su dispositivo móvil
3. Sistema valida el token
4. Usuario es dirigido a la página de reservas
5. Usuario ve el iframe de Acuity Scheduling y puede reservar
6. Cada 30 segundos, se genera un nuevo QR (el anterior expira)

## ⚙️ Configuración

### Variables de Entorno

**Backend** (`.env`):
```
BACKEND_PORT=5000
BACKEND_HOST=localhost
```

**Frontend** (`.env.local`):
```
REACT_APP_API_URL=http://localhost:5000
PORT=3000
```

### Cambiar Puertos

#### Opción 1: Usar script interactivo (RECOMENDADO)
```bash
bash configure-ports.sh
```

#### Opción 2: Editar `.env` manualmente
```
BACKEND_PORT=8080
REACT_APP_PORT=3000
REACT_APP_API_URL=http://localhost:8080
```

#### Opción 3: Variables de línea de comandos
```bash
# Backend en puerto 8080
BACKEND_PORT=8080 npm run backend

# Frontend en puerto 3001
PORT=3001 npm run frontend
```

### Ejemplos de Configuración

**Configuración por defecto:**
```
Backend: http://localhost:5000
Frontend: http://localhost:3000
```

**Puertos personalizados:**
```
Backend: http://localhost:8080
Frontend: http://localhost:3001
```

**Múltiples instancias simultáneamente:**
```bash
# Terminal 1 - Instancia 1
BACKEND_PORT=5000 npm run backend

# Terminal 2 - Instancia 1
PORT=3000 npm run frontend

# Terminal 3 - Instancia 2
BACKEND_PORT=5001 npm run backend

# Terminal 4 - Instancia 2
PORT=3001 npm run frontend
```

Para cambiar puertos en producción, asegúrate de actualizar `REACT_APP_API_URL` para que apunte al backend correcto.

## 🐛 Troubleshooting

### Error: "Cannot find module 'express'"
```bash
npm install express
```

### Error: "react-scripts: command not found"
```bash
cd frontend && npm install
```

### El QR no carga
- Verifica que el backend esté corriendo en puerto 5000
- Revisa la consola del navegador (F12) para más detalles

### El iframe de Acuity no carga
- Verifica que tengas conexión a internet
- Comprueba que el ID de propietario (39614611) sea correcto

## 🚀 Despliegue

Para desplegar en producción:

1. **Backend**: Hospedar con Node.js (ej: Heroku, Railway, Digital Ocean)
2. **Frontend**: Construir y hospedar en servicio estático (ej: Netlify, Vercel)

```bash
# Construir frontend para producción
cd frontend && npm run build
```

## 📄 Licencia

Este proyecto es de código abierto.

## 👨‍💻 Autor

Generado para Toy Story Universe

---

**¿Necesitas ayuda?** Revisa los logs del servidor y la consola del navegador para debugging.
