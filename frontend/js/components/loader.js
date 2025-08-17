export function initLoader() {
  const el = document.getElementById('app-loader');
  window.addEventListener('app:loading', (ev) => {
    const on = !!ev.detail;
    el.classList.toggle('hidden', !on);
    el.setAttribute('aria-hidden', String(!on));
  });
}
