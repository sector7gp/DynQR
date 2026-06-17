import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function QRDisplay() {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/qr`);
        setQrImage(response.data.qrImage);
        setCountdown(30);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching QR:', error);
        setLoading(false);
      }
    };

    fetchQR();
    const interval = setInterval(fetchQR, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 30);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="qr-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;700&family=Nunito:wght@400;700;800&display=swap');
        
        * {
          font-family: 'Fredoka', 'Nunito', sans-serif;
        }
      `}</style>
      
      <div className="qr-wrapper">
        <h1 className="title">🎬 Escanea para Reservar</h1>
        <p className="subtitle">¡Bienvenido a Toy Story Universe!</p>
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Generando código QR...</p>
          </div>
        ) : (
          <div className="qr-content">
            <div className="qr-box">
              {qrImage && (
                <img src={qrImage} alt="QR Code" className="qr-image" />
              )}
            </div>
            
            <div className="info-box">
              <p className="info-title">⏰ Se refresca en:</p>
              <p className="countdown">{countdown}s</p>
              <p className="info-text">El código QR se actualiza automáticamente cada 30 segundos</p>
            </div>

            <div className="toys-decoration">
              <span className="toy">🤠</span>
              <span className="toy">🚀</span>
              <span className="toy">👽</span>
              <span className="toy">🐷</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QRDisplay;
