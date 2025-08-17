import { isAuth, getUser, clearAuth } from '../state.js';
import { showToast } from './toast.js';

export function renderHeader() {
  const header = document.getElementById('app-header');
  const auth = isAuth();
  const user = getUser();

  header.innerHTML = `
    <div class="nav">
      <a class="brand" href="#/">Eventos</a>
      <div class="actions">
        ${auth ? `
          <span class="meta">Hola, ${user?.name || 'Usuario'}</span>
          <a class="btn ghost" href="#/create">Crear evento</a>
          <button id="btn-logout" class="btn danger small">Salir</button>
        ` : `
          <a class="btn" href="#/login">Entrar</a>
        `}
      </div>
    </div>
  `;

  if (auth) {
    const btn = document.getElementById('btn-logout');
    btn.addEventListener('click', () => {
      clearAuth();
      showToast('Sesión cerrada', 'ok');
      renderHeader();
      location.hash = '#/login';
    });
  }
}
