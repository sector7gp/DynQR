// Diagrama del flujo del sistema DynQR

/*
┌─────────────────────────────────────────────────────────────────┐
│                     SISTEMA DYNQR                                │
│              QR Dinámico + Sistema de Reservas                  │
└─────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════╗
║                    BACKEND (Express.js)                           ║
║                    Puerto: 5000                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │  Generador de Tokens                                     │   ║
║  │  • Cada 30 segundos: genera nuevo UUID                  │   ║
║  │  • Reemplaza el anterior automáticamente                │   ║
║  │  • Se valida en endpoints API                           │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                          ↓                                        ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │  Endpoints API                                           │   ║
║  │  • GET  /api/qr               → QR + Token             │   ║
║  │  • POST /api/validate-token   → Validar Token          │   ║
║  │  • GET  /api/health           → Estado Servidor        │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════╗
║                    FRONTEND (React.js)                            ║
║                    Puerto: 3000                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │  Página Principal: /                                     │   ║
║  │  • Muestra QR dinámico (imagen)                         │   ║
║  │  • Cuenta regresiva: 30s                                │   ║
║  │  • Animaciones Toy Story                                │   ║
║  │  • Se refresca automáticamente cada 30s                 │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║           ↓ (usuario escanea QR)                                 ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │  Sistema de Validación                                   │   ║
║  │  • Extrae token de URL                                  │   ║
║  │  • Envía al backend para validar                        │   ║
║  │  • Si es válido → Muestra Reservas                      │   ║
║  │  • Si no es válido → Muestra Error                      │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║           ↓ (si es válido)                                       ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │  Página de Reservas: /reservations?token=XXX            │   ║
║  │  • Embebido: iFrame de Acuity Scheduling               │   ║
║  │  • Usuario puede hacer su reserva                       │   ║
║  │  • Decoraciones Toy Story                               │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║           ↓ (si no es válido)                                    ║
║  ┌──────────────────────────────────────────────────────────┐   ║
║  │  Página de Error: /reservations (sin token válido)       │   ║
║  │  • Mensaje: "Acceso Denegado"                           │   ║
║  │  • Explicación clara                                     │   ║
║  │  • Animaciones Toy Story (error wobble)                 │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════╗
║                     FLUJO DE TOKENS                               ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Tiempo:        0s          10s         20s         30s          ║
║                 ↓            ↓          ↓           ↓            ║
║  Token: [Token-1 (válido)] --------→ [Token-2] [Token-1 expira] ║
║                                                    ↓             ║
║                                          Token-1 se elimina      ║
║                                          Token-2 es el único     ║
║                                          válido ahora            ║
║                                                                   ║
║  • Cada 30s se genera un nuevo token único                       ║
║  • El anterior se invalida automáticamente                       ║
║  • Solo UN token es válido a la vez                              ║
║  • QR viejo después de 30s ya no funciona                        ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════╗
║                   ESTÉTICA TOY STORY 5                            ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Colores:                                                         ║
║  • Rosa Vibrante: #FF6B9D  (Energía)                             ║
║  • Amarillo Cálido: #FEC868 (Calidez)                            ║
║  • Azul Cielo: #66D9EF    (Diversión)                            ║
║  • Rojo Energético: #E74C3C (Acción)                             ║
║  • Oro Brillante: #FFD700  (Premium)                             ║
║                                                                   ║
║  Elementos:                                                       ║
║  • Fuentes: Fredoka, Nunito (redondeadas y amigables)           ║
║  • Animaciones: Flotación, rebote, rotación                      ║
║  • Emojis: 🤠 🚀 👽 🐷 🎬 🎫                                     ║
║  • Bordes redondeados y suaves                                   ║
║  • Sombras elegantes                                             ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════╗
║                  CASOS DE USO                                     ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  ✅ CASO EXITOSO:                                                 ║
║    1. Usuario ve página con QR                                   ║
║    2. Escanea QR dentro de 30s                                   ║
║    3. URL incluye token válido                                   ║
║    4. Backend valida el token ✓                                  ║
║    5. Sistema muestra página de reservas                         ║
║    6. Usuario ve iframe de Acuity y reserva                      ║
║                                                                   ║
║  ❌ CASO DE ERROR 1: Token expirado                               ║
║    1. Usuario escanea QR muy tarde (después de 30s)             ║
║    2. Token ya no es válido (fue reemplazado)                   ║
║    3. Página muestra error: "Token expirado"                     ║
║    4. Usuario debe escanear nuevo QR                             ║
║                                                                   ║
║  ❌ CASO DE ERROR 2: Acceso directo                               ║
║    1. Usuario intenta acceder a /reservations sin token         ║
║    2. No hay token en la URL                                     ║
║    3. Página muestra error: "Token no proporcionado"             ║
║    4. Usuario ve mensaje de "Acceso Denegado"                    ║
║                                                                   ║
║  ❌ CASO DE ERROR 3: URL modificada                               ║
║    1. Usuario adivinó o modificó el token en URL                ║
║    2. Token no coincide con el válido en backend                ║
║    3. Backend rechaza la solicitud                               ║
║    4. Página muestra error: "Token inválido"                     ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
*/
