import { initRouter } from './router.js';
import { renderHeader } from './components/header.js';
import { initLoader } from './components/loader.js';
import { clearAuth } from './state.js';
import { showToast } from './components/toast.js';

// Auto-logout si el token no vale o expiró
window.addEventListener('app:unauthorized', () => {
  clearAuth();
  renderHeader();
  showToast('Tu sesión expiró o no es válida. Inicia sesión de nuevo.', 'error');
  location.hash = '#/login';
});


function initApp() {
  renderHeader();   // pinta cabecera según sesión
  initLoader();     // escucha eventos para el loader
  initRouter();     // gestiona vistas por hash
}

initApp();
