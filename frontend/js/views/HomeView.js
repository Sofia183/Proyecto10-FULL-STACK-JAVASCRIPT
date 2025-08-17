import { getUser } from '../state.js';
import { API_ORIGIN } from '../api.js';
import { apiRequest } from '../api.js';
import { isAuth } from '../state.js';
import { showToast } from '../components/toast.js';

export async function renderHome(root) {
  const auth = isAuth();

  // Contenedor inicial
  root.innerHTML = `
    <div class="container">
      <div class="card">
        <div class="row" style="align-items:center">
          <h2 style="margin:0">Eventos</h2>
          <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
            <label class="meta">Ordenar:</label>
            <select id="sort" class="input" style="width:auto">
              <option value="dateAsc">Fecha ↑</option>
              <option value="dateDesc">Fecha ↓</option>
              <option value="titleAsc">Título A-Z</option>
              <option value="titleDesc">Título Z-A</option>
            </select>
            ${auth ? `<a class="btn" href="#/create">Crear evento</a>` : ''}
          </div>
        </div>
      </div>
      <div id="events" class="row"></div>
    </div>
  `;

  const sel = document.getElementById('sort');
  sel.addEventListener('change', () => loadEvents(sel.value));

  await loadEvents(sel.value);

  async function loadEvents(sortValue) {
    const sort = mapSort(sortValue);
    const res = await apiRequest({ endpoint: `/events?sort=${sort}`, method: 'GET' });
    const list = document.getElementById('events');
    if (!res.ok) {
      list.innerHTML = `<div class="card col">No se pudieron cargar eventos</div>`;
      showToast(res.error || 'Error al cargar', 'error');
      return;
    }

const user = isAuth() ? getUser() : null;
const userId = user?._id || null;

list.innerHTML = res.data.map(ev => EventCard(ev, auth, userId)).join('');

    // Delegación: botones asistir/desasistir
    list.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!isAuth()) { showToast('Necesitas iniciar sesión', 'error'); return; }

        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action'); // attend | unattend
        const method = action === 'attend' ? 'POST' : 'DELETE';

        const res2 = await apiRequest({
          endpoint: `/events/${id}/attend`,
          method,
          auth: true
        });

        if (!res2.ok) {
          showToast(res2.error || 'No se pudo actualizar asistencia', 'error');
          return;
        }

        showToast(action === 'attend' ? 'Asistencia confirmada' : 'Asistencia cancelada', 'ok');
        // Refrescamos lista
        await loadEvents(sel.value);
      });
    });
  }
}

function mapSort(v) {
  if (v === 'dateDesc') return 'dateDesc';
  if (v === 'titleAsc') return 'titleAsc';
  if (v === 'titleDesc') return 'titleDesc';
  return 'dateAsc';
}

function EventCard(ev, auth, userId) {
  const dt = new Date(ev.date);
  const date = dt.toLocaleDateString();
  const time = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // ✅ si es URL absoluta (Cloudinary), úsala tal cual; si no, prefija API_ORIGIN
  const posterUrl = ev.poster
    ? (ev.poster.startsWith('http') ? ev.poster : `${API_ORIGIN}${ev.poster}`)
    : '';

  const attendeesCount = Array.isArray(ev.attendees) ? ev.attendees.length : 0;
  const isAttending = auth && userId && Array.isArray(ev.attendees)
    ? ev.attendees.map(a => (a._id || a)).map(String).includes(String(userId))
    : false;

  const attendBtns = auth ? `
    ${isAttending
      ? `<button class="btn small" data-action="unattend" data-id="${ev._id}">Cancelar asistencia</button>`
      : `<button class="btn small" data-action="attend" data-id="${ev._id}">Asistir</button>`
    }
  ` : '';

  return `
    <div class="card col">
      <div style="display:flex; gap:12px;">
        ${posterUrl ? `<img src="${posterUrl}" alt="Cartel" style="width:120px;height:80px;object-fit:cover;border-radius:8px" />` : ''}
        <div style="flex:1">
          <h3 style="margin:0 0 6px 0;"><a href="#/event/${ev._id}">${ev.title}</a></h3>
          <div class="meta">${date} · ${time} · ${ev.location}</div>
          <p>${ev.description}</p>
          <div class="meta">Asistentes: ${attendeesCount}${isAttending ? ' · <strong>Estás apuntada</strong>' : ''}</div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:6px">
            <a class="btn ghost small" href="#/event/${ev._id}">Ver detalle</a>
            ${attendBtns}
          </div>
        </div>
      </div>
    </div>
  `;
}