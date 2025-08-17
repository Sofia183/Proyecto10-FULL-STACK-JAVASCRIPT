import { apiRequest } from '../api.js';
import { setAuth } from '../state.js';
import { renderHeader } from '../components/header.js';
import { showToast } from '../components/toast.js';

export function renderAuth(root) {
  root.innerHTML = `
    <div class="container">
      <div class="card">
        <h2>Acceso</h2>
        <p class="meta">Inicia sesión o regístrate.</p>

        <form id="form-login" class="form" autocomplete="on">
          <div>
            <label>Email</label>
            <input class="input" type="email" name="email" required />
          </div>
          <div>
            <label>Contraseña</label>
            <input class="input" type="password" name="password" minlength="6" required />
          </div>
          <div class="row">
            <button class="btn" type="submit">Entrar</button>
            <button class="btn ghost" id="btn-register" type="button">Registrarme</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const form = document.getElementById('form-login');
  const btnReg = document.getElementById('btn-register');

  // LOGIN
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    const res = await apiRequest({
      endpoint: '/auth/login',
      method: 'POST',
      data
    });

    if (!res.ok) {
      showToast(res.error || 'Error al iniciar sesión', 'error');
      return;
    }

    // Guardamos token/usuario (el backend devuelve token + datos)
    setAuth({ token: res.data.token, user: { _id: res.data._id, name: res.data.name, email: res.data.email } });
    showToast('Bienvenido/a', 'ok');
    renderHeader();
    location.hash = '#/';
  });

  // REGISTRO (y login automático porque el backend ya devuelve token)
  btnReg.addEventListener('click', async () => {
    const data = Object.fromEntries(new FormData(form));
    if (!data.email || !data.password) {
      showToast('Completa email y contraseña', 'error'); return;
    }
    // Pedimos nombre mínimo con el email como base
    const name = prompt('Tu nombre para el registro:', 'Usuario');
    if (!name) { showToast('Registro cancelado', 'error'); return; }

    const res = await apiRequest({
      endpoint: '/auth/register',
      method: 'POST',
      data: { name, email: data.email, password: data.password }
    });

    if (!res.ok) {
      showToast(res.error || 'No se pudo registrar', 'error');
      return;
    }

    setAuth({ token: res.data.token, user: { _id: res.data._id, name: res.data.name, email: res.data.email } });
    showToast('Registrado/a y dentro ✅', 'ok');
    renderHeader();
    location.hash = '#/';
  });
}
