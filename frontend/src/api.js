// Si REACT_APP_API_URL está vacío o no definido, usa rutas relativas (/api/...)
// Ideal para producción con nginx proxy en el mismo dominio.
const configuredUrl = process.env.REACT_APP_API_URL;

export function getApiBaseUrl() {
  if (configuredUrl && configuredUrl.trim() !== '') {
    return configuredUrl.replace(/\/$/, '');
  }
  return '';
}

export function apiUrl(path) {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
