import { DataService as DS } from '../services/data.js';
import { showToast } from '../utils/ui.js';

export async function renderCreateRoom() {
  const el = document.createElement('div');
  el.className = 'auth-page';
  el.innerHTML = `
    <div class="auth-card">
      <div class="auth-logo"><h1>👑</h1><p>Crear Sala</p></div>
      <form id="room-form">
        <div class="form-group">
          <label class="form-label">Nombre de la sala</label>
          <input class="form-input" id="room-name" placeholder="Ej: Nuestra Dinámica" required />
        </div>
        <button class="btn btn-primary btn-block btn-lg" type="submit">Crear</button>
      </form>
      <div id="room-result" style="display:none;margin-top:var(--space-lg)">
        <p class="text-sm text-secondary text-center mb-md">Comparte este código con tu Sumisa:</p>
        <div class="invite-code" id="invite-code"></div>
        <p class="text-xs text-muted text-center mt-md">Toca para copiar</p>
        <a href="#/dashboard" class="btn btn-gold btn-block btn-lg" style="margin-top:var(--space-lg)">Ir al Dashboard</a>
      </div>
    </div>`;
  setTimeout(() => {
    document.getElementById('room-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        const room = await DS.createRoom(document.getElementById('room-name').value);
        document.getElementById('room-form').style.display = 'none';
        document.getElementById('room-result').style.display = 'block';
        document.getElementById('invite-code').textContent = room.inviteCode;
        document.getElementById('invite-code').onclick = () => {
          navigator.clipboard?.writeText(room.inviteCode);
          showToast('Código copiado', 'success');
        };
      } catch (err) { showToast(err.message, 'error'); }
    });
  }, 50);
  return el;
}

export async function renderJoinRoom() {
  const el = document.createElement('div');
  el.className = 'auth-page';
  el.innerHTML = `
    <div class="auth-card">
      <div class="auth-logo"><h1>🌹</h1><p>Unirse a Sala</p></div>
      <form id="join-form">
        <div class="form-group">
          <label class="form-label">Código de invitación</label>
          <input class="form-input" id="join-code" placeholder="ABC123" maxlength="6" style="text-transform:uppercase;text-align:center;font-size:var(--text-xl);letter-spacing:4px" required />
        </div>
        <button class="btn btn-sub btn-block btn-lg" type="submit">Unirse</button>
      </form>
      <p class="text-center text-sm mt-lg" style="color:var(--text-secondary)">Pídele el código a tu Amo/a</p>
    </div>`;
  setTimeout(() => {
    document.getElementById('join-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        await DS.joinRoom(document.getElementById('join-code').value.toUpperCase());
        showToast('¡Conectado/a!', 'success');
        window.location.hash = '/dashboard';
      } catch (err) { showToast(err.message, 'error'); }
    });
  }, 50);
  return el;
}
