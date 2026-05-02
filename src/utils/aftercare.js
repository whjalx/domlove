import { DataService as DS } from '../services/data.js';

export function initAftercare() {
  if (!DS.socket) return;
  
  // Prevent multiple bindings if initAftercare is called multiple times
  DS.socket.off('aftercare_trigger');
  
  DS.socket.on('aftercare_trigger', (data) => {
    // Only trigger if we are the sub and we received this
    // We don't check role here because the server only emits to the sub
    showAftercareOverlay(data.title || 'Tarea Intensa');
  });
}

function showAftercareOverlay(taskTitle) {
  // Check if overlay already exists
  if (document.getElementById('aftercare-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'aftercare-overlay';
  overlay.className = 'fade-in';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'var(--bg-dark)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--text-light)'
  });

  const content = document.createElement('div');
  Object.assign(content.style, {
    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(78, 205, 196, 0.2))',
    padding: '2rem',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxWidth: '400px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)'
  });

  content.innerHTML = `
    <div style="font-size: 4rem; margin-bottom: 1rem; animation: pulse 2s infinite;">❤️‍🩹</div>
    <h2 style="margin-bottom: 1rem; font-family: var(--font-display); color: #ff9ff3;">Buen trabajo</h2>
    <p style="margin-bottom: 1.5rem; color: var(--text-secondary); line-height: 1.6;">
      Has completado <b>${taskTitle}</b>. Fue una tarea intensa.<br><br>
      Tómate un momento para respirar.<br>
      Bebe un vaso de agua.<br>
      Si lo necesitas, escribe en tu diario.
    </p>
    <div style="display:flex; gap:10px; justify-content:center;">
      <button id="aftercare-close" class="btn btn-outline" style="border-color: #ff9ff3; color: #ff9ff3;">Ya estoy bien</button>
      <button id="aftercare-journal" class="btn btn-primary" style="background: #ff9ff3; color: #000;">Ir al Diario</button>
    </div>
  `;

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  document.getElementById('aftercare-close').onclick = () => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s';
    setTimeout(() => overlay.remove(), 500);
  };

  document.getElementById('aftercare-journal').onclick = () => {
    overlay.remove();
    window.location.hash = '/journal/new';
  };
}
