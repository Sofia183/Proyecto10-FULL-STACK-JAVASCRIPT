const el = () => document.getElementById('app-toast');
let hideT = null;

export function showToast(msg, type = 'ok', ms = 3000) {
  const t = el();
  t.textContent = msg;
  t.classList.remove('hidden', 'ok', 'error');
  t.classList.add(type === 'error' ? 'error' : 'ok');

  clearTimeout(hideT);
  hideT = setTimeout(() => t.classList.add('hidden'), ms);
}
