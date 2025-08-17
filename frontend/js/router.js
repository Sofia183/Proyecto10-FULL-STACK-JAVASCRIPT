import { renderHome } from './views/HomeView.js';
import { renderAuth } from './views/AuthView.js';
import { renderEventDetail } from './views/EventDetailView.js';
import { renderCreateEvent } from './views/CreateEventView.js';

export function initRouter() {
  window.addEventListener('hashchange', route);
  route(); // primera carga
}

function route() {
  const root = document.getElementById('app-root');
  const hash = location.hash || '#/';

  if (hash === '#/' || hash.startsWith('#/home')) {
    renderHome(root);
    return;
  }
  if (hash.startsWith('#/login')) {
    renderAuth(root);
    return;
  }
  if (hash.startsWith('#/create')) {
    renderCreateEvent(root);
    return;
  }
  if (hash.startsWith('#/event/')) {
    const id = hash.split('/')[2];
    renderEventDetail(root, id);
    return;
  }

  root.innerHTML = `<div class="container"><div class="card">Ruta no encontrada.</div></div>`;
}
