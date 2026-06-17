const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const qrcode = require('qrcode');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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
    const reservationUrl = `http://localhost:3000/reservations?token=${currentToken}`;
    
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

    res.json({
      success: true,
      qrImage,
      token: currentToken
    });
  } catch (error) {
    console.error('Error generando QR:', error);
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

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 QR disponible en http://localhost:${PORT}/api/qr`);
});
