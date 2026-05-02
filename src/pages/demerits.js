import { DataService as DS } from '../services/data.js';
import { pageShell, showToast, formatDate } from '../utils/ui.js';

export async function renderDemerits() {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom(), isDom = user.role === 'dom';
  const demerits = await DS.getDemerits(room.id);
  const subUser = isDom ? await DS.getPartner() : user;
  const total = subUser?.demerits || 0;

  const content = `
    <div class="card card-glass mb-md" style="text-align:center;padding:var(--space-lg);border-color:rgba(231,76,60,0.3)">
      <div class="demerit-points">${total}</div>
      <div class="stat-label">Deméritos Acumulados</div>
    </div>
    ${isDom ? '<a href="#/demerits/new" class="btn btn-danger btn-block mb-md">⚠️ Asignar Demérito</a>' : ''}
    <h4 class="mb-sm">Historial</h4>
    ${demerits.length ? demerits.map(d => `<div class="demerit-card mb-sm">
      <div class="flex-between"><span style="font-weight:600">${d.reason}</span><span class="badge badge-danger">-${d.points}</span></div>
      ${d.punishment ? `<p class="text-sm mt-sm" style="color:var(--accent-dom)">🔒 Castigo: ${d.punishment}</p>` : ''}
      ${d.ruleName ? `<span class="badge badge-info mt-sm">📜 ${d.ruleName}</span>` : ''}
      <p class="text-xs text-muted mt-sm">${formatDate(d.issuedAt)}</p>
    </div>`).join('') : '<div class="empty-state"><div class="empty-state-icon">✅</div><div class="empty-state-title">Sin deméritos</div></div>'}`;
  return pageShell('⚠️ Deméritos', content, 'menu', user.role);
}

export async function renderDemeritForm() {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom();
  const rules = (await DS.getRules(room.id)).filter(r => r.isActive);
  const partner = await DS.getPartner();
  const content = `<form id="dem-form">
    <div class="form-group"><label class="form-label">Regla violada (opcional)</label><select class="form-select" id="dem-rule"><option value="">— Seleccionar —</option>${rules.map(r => `<option value="${r.id}" data-pen="${r.demeritPenalty}" data-name="${r.title}">${r.title} (-${r.demeritPenalty})</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Razón</label><input class="form-input" id="dem-reason" required placeholder="¿Qué pasó?" /></div>
    <div class="form-group"><label class="form-label">Puntos de demérito</label><input class="form-input" type="number" id="dem-pts" min="1" value="1" required /></div>
    <div class="form-group"><label class="form-label">Castigo (opcional)</label><textarea class="form-textarea" id="dem-punish" placeholder="Describe el castigo..."></textarea></div>
    <button class="btn btn-danger btn-block btn-lg" type="submit">Asignar Demérito</button>
    <a href="#/demerits" class="btn btn-outline btn-block mt-sm">Cancelar</a>
  </form>`;
  setTimeout(() => {
    document.getElementById('dem-rule')?.addEventListener('change', e => {
      const opt = e.target.selectedOptions[0];
      if (opt.dataset.pen) document.getElementById('dem-pts').value = opt.dataset.pen;
      if (opt.dataset.name) document.getElementById('dem-reason').value = `Violación: ${opt.dataset.name}`;
    });
    document.getElementById('dem-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const ruleOpt = document.getElementById('dem-rule').selectedOptions[0];
      try {
        await DS.addDemerit({ roomId: room.id, userId: partner?.id, ruleId: document.getElementById('dem-rule').value || null, ruleName: ruleOpt?.dataset?.name || null, reason: document.getElementById('dem-reason').value, points: parseInt(document.getElementById('dem-pts').value), punishment: document.getElementById('dem-punish').value || null });
        showToast('Demérito asignado', 'warning');
        window.location.hash = '/demerits';
      } catch (err) { showToast(err.message, 'error'); }
    });
  }, 50);
  return pageShell('⚠️ Nuevo Demérito', content, 'menu', user.role);
}
