// ══════════════════════════════════════════
// UI HELPERS — Toast, Modal, Confetti, formatters
// ══════════════════════════════════════════

export function showToast(message, type = 'success') {
  const root = document.getElementById('toast-root');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || ''}</span><span>${message}</span>`;
  root.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(-50%) translateY(-20px)'; setTimeout(() => toast.remove(), 300); }, 2800);
}

export function showModal(title, contentHtml, onClose) {
  const root = document.getElementById('modal-root');
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal-content"><div class="modal-header"><h3 class="modal-title">${title}</h3><button class="modal-close" id="modal-close-btn">✕</button></div><div class="modal-body-content">${contentHtml}</div></div>`;
  root.appendChild(overlay);
  const close = () => { overlay.style.opacity = '0'; setTimeout(() => { overlay.remove(); if (onClose) onClose(); }, 200); };
  overlay.querySelector('#modal-close-btn').onclick = close;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  return { close, el: overlay };
}

export function confirmModal(title, message) {
  return new Promise((resolve) => {
    const { close, el } = showModal(title, `
      <p style="color: var(--text-secondary); margin-bottom: var(--space-lg);">${message}</p>
      <div class="flex gap-sm">
        <button class="btn btn-outline btn-block" id="confirm-cancel">Cancelar</button>
        <button class="btn btn-primary btn-block" id="confirm-ok">Confirmar</button>
      </div>
    `);
    el.querySelector('#confirm-cancel').onclick = () => { close(); resolve(false); };
    el.querySelector('#confirm-ok').onclick = () => { close(); resolve(true); };
  });
}

export function showCoinAnimation(amount, x, y) {
  const el = document.createElement('div');
  el.className = 'coin-float';
  el.textContent = `+${amount} 🪙`;
  el.style.left = (x || window.innerWidth / 2) + 'px';
  el.style.top = (y || window.innerHeight / 2) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

export function showConfetti() {
  const colors = ['#c9302c', '#d4a853', '#e8a0bf', '#2ecc71', '#3498db'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.top = '-10px';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    const duration = 1000 + Math.random() * 2000;
    piece.animate([
      { top: '-10px', opacity: 1 },
      { top: '110vh', opacity: 0, transform: `rotate(${Math.random() * 720}deg) translateX(${(Math.random()-0.5)*200}px)` }
    ], { duration, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }).onfinish = () => piece.remove();
  }
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

export function formatRelative(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `Hace ${days}d`;
  return formatDate(dateStr);
}

export function createNavbar(activeItem, role) {
  const items = role === 'dom' ? [
    { id: 'dashboard', icon: '🏠', label: 'Inicio', path: '/dashboard' },
    { id: 'tasks', icon: '📋', label: 'Tareas', path: '/tasks' },
    { id: 'shop', icon: '🛒', label: 'Tienda', path: '/shop' },
    { id: 'journal', icon: '📖', label: 'Diario', path: '/journal' },
    { id: 'menu', icon: '☰', label: 'Más', path: '/menu' },
  ] : [
    { id: 'dashboard', icon: '🏠', label: 'Inicio', path: '/dashboard' },
    { id: 'tasks', icon: '📋', label: 'Tareas', path: '/tasks' },
    { id: 'shop', icon: '🛒', label: 'Tienda', path: '/shop' },
    { id: 'journal', icon: '📖', label: 'Diario', path: '/journal' },
    { id: 'menu', icon: '☰', label: 'Más', path: '/menu' },
  ];
  return `<nav class="navbar">${items.map(i => `
    <a href="#${i.path}" class="nav-item ${activeItem === i.id ? 'active' : ''}" id="nav-${i.id}">
      <span class="nav-icon">${i.icon}</span>
      <span>${i.label}</span>
    </a>`).join('')}</nav>`;
}

export function pageShell(title, content, activeNav, role, extra = '') {
  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h2 class="page-title">${title}</h2>
          ${extra ? `<p class="page-subtitle">${extra}</p>` : ''}
        </div>
      </div>
      ${content}
    </div>
    ${createNavbar(activeNav, role)}
  `;
}

export const TASK_CATEGORIES = [
  { value: 'servicio', label: '🧹 Servicio', color: '#3498db' },
  { value: 'obediencia', label: '🔒 Obediencia', color: '#c9302c' },
  { value: 'autocuidado', label: '💆 Autocuidado', color: '#2ecc71' },
  { value: 'entrenamiento', label: '🏋️ Entrenamiento', color: '#f39c12' },
  { value: 'protocolo', label: '👑 Protocolo', color: '#d4a853' },
  { value: 'otro', label: '📌 Otro', color: '#9b59b6' },
];

export const MOODS = ['😊', '😌', '🥰', '😢', '😔', '😤', '🥺', '😈', '🔥', '💕'];
