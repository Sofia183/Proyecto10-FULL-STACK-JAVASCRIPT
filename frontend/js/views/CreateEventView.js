import { isAuth } from '../state.js';
import { apiRequest } from '../api.js';
import { showToast } from '../components/toast.js';

export function renderCreateEvent(root) {
  if (!isAuth()) {
    root.innerHTML = `<div class="container"><div class="card">Necesitas iniciar sesión para crear eventos. <a class="btn" href="#/login">Ir a login</a></div></div>`;
    return;
  }

  root.innerHTML = `
    <div class="container">
      <div class="card">
        <h2>Crear evento</h2>
        <form id="form-event" class="form">
          <div class="row">
            <div style="flex:1">
              <label>Título</label>
              <input class="input" name="title" required />
            </div>
            <div style="flex:1">
              <label>Fecha</label>
              <input class="input" type="datetime-local" name="date" required />
            </div>
          </div>
          <div>
            <label>Ubicación</label>
            <input class="input" name="location" required />
          </div>
          <div>
            <label>Descripción</label>
            <textarea class="input" name="description" rows="4" required></textarea>
          </div>
          <div>
            <label>Cartel (imagen)</label>
            <input class="input" type="file" name="poster" accept="image/*" />
          </div>
          <div class="row">
            <button class="btn" type="submit">Crear</button>
            <a class="btn ghost" href="#/">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('form-event').addEventListener('submit', onSubmit);
}

async function onSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const fd = new FormData(form);

  const payload = {
    title: fd.get('title'),
    date: fd.get('date'),
    location: fd.get('location'),
    description: fd.get('description'),
  };

  // 1) Crear evento
  const resCreate = await apiRequest({
    endpoint: '/events',
    method: 'POST',
    data: payload,
    auth: true
  });

  if (!resCreate.ok) {
    showToast(resCreate.error || 'No se pudo crear el evento', 'error');
    return;
  }

  const event = resCreate.data;
  const file = fd.get('poster');

  // 2) Si hay archivo, subir cartel
  if (file && file.size > 0) {
    const fd2 = new FormData();
    fd2.append('poster', file);

    const resPoster = await apiRequest({
      endpoint: `/events/${event._id}/poster`,
      method: 'POST',
      auth: true,
      isForm: true,
      data: fd2
    });

    if (!resPoster.ok) {
      showToast('Evento creado, pero falló la subida del cartel', 'error');
    }
  }

  showToast('Evento creado ✅', 'ok');
  location.hash = `#/event/${event._id}`;
}
