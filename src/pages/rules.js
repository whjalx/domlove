import { DataService as DS } from '../services/data.js';
import { pageShell, showToast, confirmModal } from '../utils/ui.js';

export async function renderRules() {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom(), isDom = user.role === 'dom';
  const rules = await DS.getRules(room.id);
  const severities = { low: { l: 'Baja', c: 'var(--color-info)' }, medium: { l: 'Media', c: 'var(--color-warning)' }, high: { l: 'Alta', c: 'var(--color-danger)' } };
  const content = `
    ${isDom ? '<a href="#/rules/new" class="btn btn-primary btn-block mb-md">+ Nueva Regla</a>' : ''}
    <div class="flex flex-col gap-sm">
      ${rules.length ? rules.map(r => `<div class="card" ${isDom ? `onclick="location.hash='/rules/edit/${r.id}'"` : ''}>
        <div class="flex-between mb-sm"><h4 style="margin:0">${r.title}</h4><span class="badge" style="background:${severities[r.severity].c}22;color:${severities[r.severity].c}">${severities[r.severity].l}</span></div>
        <p class="text-sm text-secondary">${r.description}</p>
        <div class="mt-sm"><span class="badge badge-danger">Penalidad: -${r.demeritPenalty} Deméritos</span></div>
      </div>`).join('') : '<div class="empty-state"><div class="empty-state-icon">📜</div><div class="empty-state-title">Sin reglas establecidas</div></div>'}
    </div>`;
  return pageShell('📜 Reglas', content, 'menu', user.role);
}

export async function renderRuleForm(params) {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom();
  const existing = params.id ? (await DS.getRules(room.id)).find(r => r.id === params.id) : null;
  const content = `<form id="rule-form">
    <div class="form-group"><label class="form-label">Regla</label><input class="form-input" id="r-title" value="${existing?.title || ''}" required /></div>
    <div class="form-group"><label class="form-label">Descripción</label><textarea class="form-textarea" id="r-desc">${existing?.description || ''}</textarea></div>
    <div class="form-group"><label class="form-label">Severidad</label><select class="form-select" id="r-sev"><option value="low" ${existing?.severity==='low'?'selected':''}>Baja</option><option value="medium" ${existing?.severity==='medium'?'selected':''}>Media</option><option value="high" ${existing?.severity==='high'?'selected':''}>Alta</option></select></div>
    <div class="form-group"><label class="form-label">Deméritos (Castigo)</label><input class="form-input" type="number" id="r-pen" min="1" value="${existing?.demeritPenalty || 1}" required /></div>
    <button class="btn btn-primary btn-block btn-lg" type="submit">${existing ? 'Guardar' : 'Crear Regla'}</button>
    ${existing ? `<button type="button" class="btn btn-danger btn-block mt-sm" id="btn-del">Eliminar</button>` : ''}
    <a href="#/rules" class="btn btn-outline btn-block mt-sm">Cancelar</a>
  </form>`;
  setTimeout(() => {
    document.getElementById('rule-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const data = { roomId: room.id, title: document.getElementById('r-title').value, description: document.getElementById('r-desc').value, severity: document.getElementById('r-sev').value, demeritPenalty: parseInt(document.getElementById('r-pen').value) };
      if (existing) await DS.updateRule(existing.id, data); else await DS.createRule(data);
      showToast('Regla guardada'); window.location.hash = '/rules';
    });
    document.getElementById('btn-del')?.addEventListener('click', async () => {
      if (await confirmModal('Eliminar', '¿Seguro?')) { await DS.deleteRule(existing.id); window.location.hash = '/rules'; }
    });
  }, 50);
  return pageShell(existing ? 'Editar Regla' : 'Nueva Regla', content, 'menu', user.role);
}
