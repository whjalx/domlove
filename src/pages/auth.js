import { DataService as DS } from '../services/data.js';
import { showToast } from '../utils/ui.js';

export async function renderLogin() {
  const el = document.createElement('div');
  el.className = 'auth-page';
  el.innerHTML = `
    <div class="auth-card">
      <div class="auth-logo"><h1>DomLover</h1><p>Dinámicas BDSM</p></div>
      <form id="login-form">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" type="email" id="login-email" placeholder="tu@email.com" required />
        </div>
        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <input class="form-input" type="password" id="login-pass" placeholder="••••••••" required />
        </div>
        <button class="btn btn-primary btn-block btn-lg" type="submit" style="margin-top:var(--space-md)">Entrar</button>
      </form>
      <p class="text-center text-sm mt-lg" style="color:var(--text-secondary)">¿No tienes cuenta? <a href="#/register">Regístrate</a></p>
    </div>`;
  setTimeout(() => {
    document.getElementById('login-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        await DS.login(document.getElementById('login-email').value, document.getElementById('login-pass').value);
        showToast('Bienvenido/a de vuelta', 'success');
        window.location.hash = '/dashboard';
      } catch (err) { showToast(err.message, 'error'); }
    });
  }, 50);
  return el;
}

export async function renderRegister() {
  const el = document.createElement('div');
  el.className = 'auth-page';
  el.innerHTML = `
    <div class="auth-card">
      <div class="auth-logo"><h1>DomLover</h1><p>Crear Cuenta</p></div>
      <form id="reg-form">
        <div class="form-group">
          <label class="form-label">Nombre</label>
          <input class="form-input" id="reg-name" placeholder="Tu nombre" required />
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" type="email" id="reg-email" placeholder="tu@email.com" required />
        </div>
        <div class="form-group">
          <label class="form-label">Contraseña</label>
          <input class="form-input" type="password" id="reg-pass" placeholder="••••••••" minlength="6" required />
        </div>
        <div class="form-group">
          <label class="form-label">Tu Rol</label>
          <div class="role-selector">
            <div class="role-option" data-role="dom" id="role-dom">
              <div class="role-icon">👑</div>
              <div class="role-label">Amo/a</div>
              <div class="role-desc">Controla tareas y reglas</div>
            </div>
            <div class="role-option" data-role="sub" id="role-sub">
              <div class="role-icon">🌹</div>
              <div class="role-label">Sumiso/a</div>
              <div class="role-desc">Cumple y gana monedas</div>
            </div>
          </div>
          <input type="hidden" id="reg-role" required />
        </div>
        <button class="btn btn-primary btn-block btn-lg" type="submit">Crear Cuenta</button>
      </form>
      <p class="text-center text-sm mt-lg" style="color:var(--text-secondary)">¿Ya tienes cuenta? <a href="#/login">Inicia sesión</a></p>
    </div>`;
  setTimeout(() => {
    document.querySelectorAll('.role-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.role-option').forEach(o => o.className = 'role-option');
        const r = opt.dataset.role;
        opt.classList.add(r === 'dom' ? 'selected-dom' : 'selected-sub');
        document.getElementById('reg-role').value = r;
      });
    });
    document.getElementById('reg-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const role = document.getElementById('reg-role').value;
      if (!role) { showToast('Selecciona un rol', 'error'); return; }
      try {
        await DS.register(document.getElementById('reg-email').value, document.getElementById('reg-pass').value, document.getElementById('reg-name').value, role);
        showToast('¡Cuenta creada!', 'success');
        window.location.hash = role === 'dom' ? '/create-room' : '/join-room';
      } catch (err) { showToast(err.message, 'error'); }
    });
  }, 50);
  return el;
}

export async function renderPinLock() {
  const el = document.createElement('div');
  el.className = 'auth-page';
  el.innerHTML = `
    <div class="auth-card text-center">
      <div class="auth-logo"><h1 style="font-size:3rem">🔒</h1><p>Ingresa tu PIN</p></div>
      <form id="pin-form">
        <div class="form-group" style="display:flex;justify-content:center;gap:10px;margin:20px 0;">
          <input type="password" id="pin-input" maxlength="4" style="width:120px;text-align:center;font-size:2rem;letter-spacing:10px;" required />
        </div>
        <button class="btn btn-primary btn-block btn-lg" type="submit">Desbloquear</button>
      </form>
      <button id="logout-btn" class="btn btn-outline btn-block mt-md">Cerrar Sesión</button>
    </div>`;
  setTimeout(() => {
    document.getElementById('pin-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        const ok = await DS.verifyPin(document.getElementById('pin-input').value);
        if (ok) {
          window._pinUnlocked = true;
          window.location.hash = '/dashboard';
        } else {
          showToast('PIN Incorrecto', 'error');
          document.getElementById('pin-input').value = '';
        }
      } catch (err) { showToast(err.message, 'error'); }
    });
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      DS.logout();
      window._pinUnlocked = false;
      window.location.hash = '/login';
    });
  }, 50);
  return el;
}
