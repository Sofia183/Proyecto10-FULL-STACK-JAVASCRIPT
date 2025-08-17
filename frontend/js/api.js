import { getToken } from './state.js';

export const API_ORIGIN = 'http://localhost:5050';
export const API_BASE = `${API_ORIGIN}/api`;


// Enviamos eventos globales para el loader
function loading(on) {
  window.dispatchEvent(new CustomEvent('app:loading', { detail: on }));
}

// ÚNICA FUNCIÓN DE FETCH REUTILIZABLE
export async function apiRequest({ endpoint, method = 'GET', data = null, auth = false, isForm = false }) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {};

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let body;

  if (isForm && data instanceof FormData) {
    body = data; // NO ponemos Content-Type: el navegador la pone con boundary
  } else if (data) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }

  loading(true);
  try {
    const res = await fetch(url, { method, headers, body });

    // Intentamos leer JSON siempre que sea posible
    let payload = null;
    try { payload = await res.json(); } catch { payload = null; }

if (!res.ok) {
  const msg = payload?.message || `Error HTTP ${res.status}`;
  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent('app:unauthorized'));
  }
  return { ok: false, status: res.status, error: msg, data: payload };
}


    return { ok: true, status: res.status, data: payload };
  } catch (err) {
    return { ok: false, status: 0, error: 'Fallo de red' };
  } finally {
    loading(false);
  }
}
