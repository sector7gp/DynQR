import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from './api';
import './Reservations.css';

function Reservations() {
  const [tokenValid, setTokenValid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
          setTokenValid(false);
          setError('No se proporcionó un token válido');
          setLoading(false);
          return;
        }

        const response = await axios.post(
          apiUrl('/api/validate-token'),
          { token }
        );

        if (response.data.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setError('Token expirado o inválido');
        }
      } catch (err) {
        console.error('Error validating token:', err);
        setTokenValid(false);
        setError('Error al validar acceso');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  if (loading) {
    return (
      <div className="reservations-container">
        <div className="loading-screen">
          <div className="spinner-large"></div>
          <p>Validando acceso...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="reservations-container error-state">
        <div className="error-box">
          <div className="error-header">
            <span className="error-icon">❌</span>
            <h1>¡Acceso Denegado!</h1>
          </div>

          <div className="error-content">
            <p className="error-message">
              {error}
            </p>
            <p className="error-description">
              Este sistema de reservas solo es accesible escaneando el código QR válido. 
              Por favor, escanea el QR dinámico para acceder.
            </p>
          </div>

          <div className="error-footer">
            <p>Si crees que esto es un error, contacta con soporte</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservations-container valid-state">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;700&family=Nunito:wght@400;700;800&display=swap');
        
        * {
          font-family: 'Fredoka', 'Nunito', sans-serif;
        }
      `}</style>

      <div className="reservations-header">
        <h1 className="reservations-title">🎫 Sistema de Reservas</h1>
        <p className="reservations-subtitle">Bienvenido a Toy Story Universe</p>
      </div>

      <div className="reservations-content">
        <div className="iframe-wrapper">
          <iframe 
            src="https://app.acuityscheduling.com/schedule.php?owner=39614611&ref=embedded_csp" 
            title="Reservar cita" 
            width="100%" 
            height="800" 
            frameBorder="0" 
            allow="payment"
          ></iframe>
        </div>
        <script src="https://embed.acuityscheduling.com/js/embed.js" type="text/javascript"></script>
      </div>

      <div className="reservations-decoration">
        <span className="deco-toy">🤠</span>
        <span className="deco-toy">🚀</span>
        <span className="deco-toy">👽</span>
      </div>
    </div>
  );
}

export default Reservations;
