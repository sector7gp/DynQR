// Textos y visibilidad configurables desde .env (requieren rebuild del frontend)

export const QR_TITLE =
  process.env.REACT_APP_QR_TITLE || '🎬 Escanea para Reservar';

export const QR_SUBTITLE =
  process.env.REACT_APP_QR_SUBTITLE || '¡Bienvenido a Toy Story Universe!';

export const SHOW_COUNTDOWN =
  process.env.REACT_APP_SHOW_COUNTDOWN !== 'false';
