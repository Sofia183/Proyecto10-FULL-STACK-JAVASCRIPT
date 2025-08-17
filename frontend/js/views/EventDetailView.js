import { getUser } from '../state.js';
import { API_ORIGIN } from '../api.js';
import { apiRequest } from '../api.js';
import { isAuth } from '../state.js';
import { showToast } from '../components/toast.js';

export async function renderEventDetail(root, id) {
  const res = await apiRequest({ endpoint: `/events/${id}`, method: 'GET' });
  if (!res.ok) {
    root.innerHTML = `<div class="container"><div class="card">Evento no encontrado</div></div>`;
    return;
  }
  const ev = res.data;

  const user = isAuth() ? getUser() : null;
const userId = user?._id || null;
const attendeesCount = Array.isArray(ev.attendees) ? ev.attendees.length : 0;
const isAttending = isAuth() && userId && Array.isArray(ev.attendees)
  ? ev.attendees.some(a => (a._id || a) === userId)
  : false;


  root.innerHTML = `
    <div class="container">
      <div class="card">
        <a href="#/">&larr; Volver</a>
        <h3>Asistentes (${attendeesCount})</h3>
        <div class="meta">${new Date(ev.date).toLocaleString()} · ${ev.location}</div>
         ${ev.poster ? `<img src="${API_ORIGIN}${ev.poster}" alt="Cartel" style="max-width:100%;border-radius:8px;margin:8px 0" />` : ''}
        <p>${ev.description}</p>

        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px">
  ${isAuth() ? `
    ${isAttending
      ? `<button id="btn-unattend" class="btn ghost">Cancelar asistencia</button>`
      : `<button id="btn-attend" class="btn">Asistir</button>`
    }
  ` : `<a class="btn" href="#/login">Inicia sesión para confirmar asistencia</a>`}
</div>

      </div>

      <div class="card">
        <h3>Asistentes</h3>
        ${renderAttendees(ev.attendees)}
      </div>
    </div>
  `;

  if (isAuth()) {
    document.getElementById('btn-attend').addEventListener('click', async () => {
      const r = await apiRequest({ endpoint: `/events/${id}/attend`, method: 'POST', auth: true });
      if (!r.ok) return showToast(r.error || 'No se pudo asistir', 'error');
      showToast('Asistencia confirmada', 'ok');
      location.reload();
    });
    document.getElementById('btn-unattend').addEventListener('click', async () => {
      const r = await apiRequest({ endpoint: `/events/${id}/attend`, method: 'DELETE', auth: true });
      if (!r.ok) return showToast(r.error || 'No se pudo cancelar', 'error');
      showToast('Asistencia cancelada', 'ok');
      location.reload();
    });
  }
}

function renderAttendees(list = []) {
  if (!list.length) return `<p class="meta">Aún no hay asistentes.</p>`;
  return `
    <ul>
      ${list.map(u => `<li>${u.name} <span class="meta">&lt;${u.email}&gt;</span></li>`).join('')}
    </ul>
  `;
}
