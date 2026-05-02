import { DataService as DS } from '../services/data.js';
import { pageShell, showToast, confirmModal } from '../utils/ui.js';

export async function renderLimits() {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom(), isDom = user.role === 'dom';
  const limits = await DS.getLimits(room.id);
  const types = { hard: { l: 'Innegociable', c: 'var(--color-danger)' }, soft: { l: 'Negociable', c: 'var(--color-warning)' }, playlist: { l: 'Deseo / Fantasía', c: 'var(--color-success)' } };
  const content = `
    ${!isDom ? '<a href="#/limits/new" class="btn btn-sub btn-block mb-md">+ Agregar Límite / Deseo</a>' : '<p class="text-sm text-secondary text-center mb-md">Los límites solo pueden ser editados por la Sumisa.</p>'}
    <div class="flex flex-col gap-sm">
      ${limits.length ? limits.map(l => `<div class="card" ${!isDom ? `onclick="location.hash='/limits/edit/${l.id}'"` : ''}>
        <div class="flex-between mb-sm"><h4 style="margin:0">${l.title}</h4><span class="badge" style="background:${types[l.category].c}22;color:${types[l.category].c}">${types[l.category].l}</span></div>
        <p class="text-sm text-secondary">${l.description}</p>
      </div>`).join('') : '<div class="empty-state"><div class="empty-state-icon">🚫</div><div class="empty-state-title">Lista vacía</div></div>'}
    </div>`;
  return pageShell('🚫 Límites y Playlist', content, 'menu', user.role);
}

export async function renderLimitForm(params) {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom();
  if (user.role === 'dom') { window.location.hash = '/limits'; return; }
  const existing = params.id ? (await DS.getLimits(room.id)).find(l => l.id === params.id) : null;
  const content = `<form id="limit-form">
    <div class="form-group"><label class="form-label">Título</label><input class="form-input" id="l-title" value="${existing?.title || ''}" required /></div>
    <div class="form-group"><label class="form-label">Tipo</label><select class="form-select" id="l-cat"><option value="hard" ${existing?.category==='hard'?'selected':''}>Límite Duro (Innegociable)</option><option value="soft" ${existing?.category==='soft'?'selected':''}>Límite Suave (Negociable)</option><option value="playlist" ${existing?.category==='playlist'?'selected':''}>Deseo / Playlist</option></select></div>
    <div class="form-group"><label class="form-label">Explicación</label><textarea class="form-textarea" id="l-desc" placeholder="Detalles de por qué...">${existing?.description || ''}</textarea></div>
    <button class="btn btn-sub btn-block btn-lg" type="submit">${existing ? 'Guardar' : 'Agregar'}</button>
    ${existing ? `<button type="button" class="btn btn-outline btn-block mt-sm" style="color:var(--color-danger);border-color:var(--color-danger)" id="btn-del">Eliminar</button>` : ''}
    <a href="#/limits" class="btn btn-outline btn-block mt-sm">Cancelar</a>
  </form>`;
  setTimeout(() => {
    document.getElementById('limit-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const data = { roomId: room.id, userId: user.id, title: document.getElementById('l-title').value, description: document.getElementById('l-desc').value, category: document.getElementById('l-cat').value, status: 'active' };
      if (existing) await DS.updateLimit(existing.id, data); else await DS.createLimit(data);
      showToast('Guardado'); window.location.hash = '/limits';
    });
    document.getElementById('btn-del')?.addEventListener('click', async () => {
      if (await confirmModal('Eliminar', '¿Seguro?')) { await DS.deleteLimit(existing.id); window.location.hash = '/limits'; }
    });
  }, 50);
  return pageShell(existing ? 'Editar' : 'Nuevo Límite', content, 'menu', user.role);
}
