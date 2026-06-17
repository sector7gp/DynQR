const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const qrcode = require('qrcode');
require('dotenv').config();

const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 5000;
const HOST = process.env.BACKEND_HOST || 'localhost';
const frontendPort = process.env.REACT_APP_PORT || 3000;
const frontendPublicUrl = (
  process.env.FRONTEND_PUBLIC_URL ||
  `http://localhost:${frontendPort}`
).replace(/\/$/, '');

const defaultOrigins = [
  `http://localhost:${frontendPort}`,
  `http://127.0.0.1:${frontendPort}`,
  frontendPublicUrl
].filter(Boolean);

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : defaultOrigins;

const corsOptions = {
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Almacenamiento de tokens válidos (en memoria)
// En producción, usar una base de datos
const validTokens = new Set();

// Generar nuevo token cada 30 segundos
setInterval(() => {
  const newToken = uuidv4();
  validTokens.clear();
  validTokens.add(newToken);
  console.log('✨ Nuevo token QR generado:', newToken.substring(0, 8) + '...');
}, 30000);

// Generar token inicial al iniciar
const initialToken = uuidv4();
validTokens.add(initialToken);
console.log('🎬 Token inicial generado:', initialToken.substring(0, 8) + '...');

// Endpoint para obtener QR actual
app.get('/api/qr', async (req, res) => {
  try {
    const currentToken = Array.from(validTokens)[0];
    console.log('📲 QR solicitado. Token actual:', currentToken.substring(0, 8) + '...');
    const reservationUrl = `${frontendPublicUrl}/reservations?token=${currentToken}`;
    
    const qrImage = await qrcode.toDataURL(reservationUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      quality: 0.95,
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    console.log('✅ QR generado exitosamente');
    res.json({
      success: true,
      qrImage,
      token: currentToken
    });
  } catch (error) {
    console.error('❌ Error generando QR:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para validar token
app.post('/api/validate-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.json({ valid: false, message: 'Token no proporcionado' });
  }

  const isValid = validTokens.has(token);
  res.json({ 
    valid: isValid,
    message: isValid ? 'Token válido' : 'Token inválido o expirado'
  });
});

// Endpoint para verificar estado del servidor
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    tokensActive: validTokens.size,
    timestamp: new Date().toISOString()
  });
});

const buildPath = path.join(__dirname, '../frontend/build');
const fs = require('fs');
const shouldServeFrontend =
  process.env.SERVE_FRONTEND === 'true' ||
  (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(buildPath, 'index.html')));

if (shouldServeFrontend) {
  app.use(express.static(buildPath));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
  console.log('📦 Sirviendo frontend desde:', buildPath);
} else if (process.env.SERVE_FRONTEND === 'true') {
  console.warn('⚠️  SERVE_FRONTEND=true pero no existe frontend/build. Ejecutá: npm run build');
}

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
  console.log(`📱 QR disponible en http://${HOST}:${PORT}/api/qr`);
  console.log(`🌐 URL pública del frontend: ${frontendPublicUrl}`);
  console.log(`🔓 CORS origins: ${corsOrigins.join(', ')}`);
});
