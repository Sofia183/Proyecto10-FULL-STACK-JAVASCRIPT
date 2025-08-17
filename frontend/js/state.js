// Manejo de estado de autenticación (token + usuario) en localStorage
const LS_TOKEN = 'p10_token';
const LS_USER  = 'p10_user';

export function getToken() {
  return localStorage.getItem(LS_TOKEN) || '';
}

export function setAuth({ token, user }) {
  if (token) localStorage.setItem(LS_TOKEN, token);
  if (user)  localStorage.setItem(LS_USER, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_USER);
}

export function getUser() {
  const raw = localStorage.getItem(LS_USER);
  return raw ? JSON.parse(raw) : null;
}

export function isAuth() {
  return !!getToken();
}
