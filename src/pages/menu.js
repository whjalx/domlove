import { DataService as DS } from '../services/data.js';
import { pageShell, showToast } from '../utils/ui.js';

export async function renderMenu() {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom(), isDom = user.role === 'dom';
  const currentTheme = DS.getTheme();
  
  const pushSupported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  const needsPushPermission = pushSupported && Notification.permission !== 'granted';

  const menuItems = [
    { icon: '📜', label: 'Reglas', path: '/rules', desc: isDom ? 'Gestionar reglas' : 'Ver reglas' },
    { icon: '🚫', label: 'Límites / Playlist', path: '/limits', desc: isDom ? 'Ver límites de Sumisa' : 'Gestionar mis límites' },
    { icon: '⚠️', label: 'Deméritos', path: '/demerits', desc: 'Castigos y penalizaciones' },
    { icon: '📅', label: 'Calendario', path: '/calendar', desc: 'Historial de cumplimiento' },
    { icon: '🔐', label: 'Chat Priv', path: '/guide', desc: 'Mensajería privada' },
    { icon: '🎡', label: 'Ruleta', path: '/wheel', desc: 'La suerte de la sumisa' },
  ];

  const content = `
    <div class="card card-glass mb-md" style="padding:var(--space-lg)">
      <div class="flex gap-md" style="align-items:center">
        <div class="avatar ${isDom ? '' : 'avatar-sub'} avatar-lg">${user.displayName?.charAt(0)?.toUpperCase() || '?'}</div>
        <div>
          <h3 style="font-family:var(--font-display)">${user.displayName}</h3>
          <span class="badge ${isDom ? 'badge-dom' : 'badge-sub'}">${isDom ? '👑 Amo/a' : '🌹 Sumiso/a'}</span>
          <p class="text-xs text-muted mt-sm">Sala: ${room?.name || '—'}</p>
          ${room ? `<p class="text-xs text-muted">Código: <strong style="color:var(--accent-gold)">${room.inviteCode}</strong></p>` : ''}
        </div>
      </div>
    </div>

    <!-- Theme Toggle -->
    <div class="card flex-between mb-md" style="padding:var(--space-md)">
      <div class="flex gap-md" style="align-items:center">
        <span style="font-size:1.5rem">${currentTheme === 'dark' ? '🌙' : '☀️'}</span>
        <div>
          <div style="font-weight:600">Tema</div>
          <div class="text-xs text-secondary">${currentTheme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}</div>
        </div>
      </div>
      <button class="btn btn-sm btn-outline" id="theme-toggle" style="min-width:80px">${currentTheme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}</button>
    </div>

    <!-- PIN Setup -->
    <div class="card flex-between mb-md" style="padding:var(--space-md)">
      <div class="flex gap-md" style="align-items:center">
        <span style="font-size:1.5rem">🔒</span>
        <div>
          <div style="font-weight:600">Seguridad</div>
          <div class="text-xs text-secondary">Bloqueo por PIN</div>
        </div>
      </div>
      <div class="flex flex-col gap-sm">
        <button class="btn btn-sm btn-outline" id="pin-setup-btn">PIN</button>
        <button class="btn btn-sm btn-outline" id="pass-change-btn">Password</button>
      </div>
    </div>

    <div class="flex flex-col gap-sm">
      ${menuItems.map(item => `
        <a href="#${item.path}" class="card flex gap-md" style="text-decoration:none;align-items:center;padding:var(--space-md)">
          <span style="font-size:1.5rem">${item.icon}</span>
          <div style="flex:1">
            <div style="font-weight:600">${item.label}</div>
            <div class="text-xs text-secondary">${item.desc}</div>
          </div>
          <span class="text-muted">›</span>
        </a>
      `).join('')}
    </div>

    <!-- PWA Install -->
    <button class="btn btn-gold btn-block mt-lg" id="pwa-install-btn" style="display:none">
      📲 Instalar App
    </button>

    ${needsPushPermission ? `
    <button class="btn btn-outline btn-block mt-sm" id="push-enable-btn" style="border-color:var(--accent-sub);color:var(--text-primary)">
      🔔 Activar Notificaciones
    </button>
    ` : ''}

    <button class="btn btn-outline btn-block mt-md" id="logout-btn" style="color:var(--color-danger);border-color:rgba(231,76,60,0.3)">
      🚪 Cerrar Sesión
    </button>`;

  setTimeout(() => {
    // Theme toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      const next = DS.getTheme() === 'dark' ? 'light' : 'dark';
      DS.setTheme(next);
      document.documentElement.setAttribute('data-theme', next);
      showToast(next === 'dark' ? '🌙 Modo Oscuro' : '☀️ Modo Claro');
      // Re-render to update button text
      setTimeout(() => location.reload(), 300);
    });

    // PWA Install
    if (window._pwaInstallPrompt) {
      const btn = document.getElementById('pwa-install-btn');
      if (btn) btn.style.display = 'block';
      btn?.addEventListener('click', async () => {
        const result = await window._pwaInstallPrompt.prompt();
        if (result?.outcome === 'accepted') {
          showToast('¡App instalada! 📲', 'success');
          btn.style.display = 'none';
        }
      });
    }

    // Push Notifications
    document.getElementById('push-enable-btn')?.addEventListener('click', async () => {
      const btn = document.getElementById('push-enable-btn');
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          await DS.initPush();
          showToast('Notificaciones activadas', 'success');
          btn.style.display = 'none';
        } else {
          showToast('Permiso denegado', 'error');
        }
      } catch (e) {
        showToast('Error al activar notificaciones', 'error');
      }
    });

    // PIN Setup
    document.getElementById('pin-setup-btn')?.addEventListener('click', async () => {
      const currentPin = prompt('Introduce un nuevo PIN de 4 dígitos (deja en blanco para desactivar):');
      if (currentPin !== null) {
        if (currentPin.length > 0 && currentPin.length !== 4) {
          showToast('El PIN debe tener 4 dígitos', 'error');
          return;
        }
        try {
          await DS.setPin(currentPin);
          showToast(currentPin ? 'PIN configurado' : 'PIN desactivado', 'success');
        } catch (e) {
          showToast(e.message, 'error');
        }
      }
    });

    // Password Change
    document.getElementById('pass-change-btn')?.addEventListener('click', async () => {
      const oldPass = prompt('Introduce tu contraseña actual:');
      if (!oldPass) return;
      const newPass = prompt('Introduce tu NUEVA contraseña:');
      if (!newPass) return;
      const confirmPass = prompt('Confirma tu NUEVA contraseña:');
      if (newPass !== confirmPass) {
        showToast('Las contraseñas no coinciden', 'error');
        return;
      }
      try {
        await DS.changePassword(oldPass, newPass);
        showToast('Contraseña cambiada con éxito', 'success');
      } catch (e) {
        showToast(e.message, 'error');
      }
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      DS.logout();
      showToast('Sesión cerrada');
      window.location.hash = '/login';
    });
  }, 50);
  return pageShell('☰ Menú', content, 'menu', user.role);
}
