import { DataService as DS } from '../services/data.js';
import { pageShell, formatRelative } from '../utils/ui.js';

export async function renderAchievements() {
  const user = await DS.getCurrentUser();
  const isDom = user.role === 'dom';
  const partner = await DS.getPartner();
  const targetUserId = isDom ? partner?.id : user.id;

  if (isDom && !targetUserId) return pageShell('Sin sumisa', '<div class="empty-state">No hay sumisa en la sala</div>', 'dashboard', user.role);

  const achievements = await DS.getAchievementsForUser(targetUserId);
  const report = await DS.getWeeklyReport();

  let content = `
    <div class="mb-lg">
      <h3 style="margin-bottom:var(--space-sm)">🏆 Logros Desbloqueados</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);">
        ${achievements.map(a => `
          <div class="card text-center" style="opacity:${a.unlocked ? '1' : '0.5'};filter:${a.unlocked ? 'none' : 'grayscale(1)'};cursor:${isDom ? 'pointer' : 'default'}" ${isDom ? `onclick="window._toggleAch('${a.id}', ${!a.unlocked})"` : ''}>
            <div style="font-size:2rem;margin-bottom:4px">${a.icon}</div>
            <div class="text-sm" style="font-weight:bold">${a.title}</div>
            <div class="text-xs text-secondary mt-sm">${a.unlocked ? 'Desbloqueado' : 'Bloqueado'}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  if (isDom) {
    window._toggleAch = async (id, forceStatus) => {
      await DS.toggleAchievement(targetUserId, id, forceStatus);
      location.reload();
    };
  }

  if (report) {
    content += `
      <div class="card mt-lg" style="background:var(--bg-glass)">
        <h4 style="margin-bottom:var(--space-md)">📊 Reporte Semanal (Últimos 7 días)</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md)">
          <div class="stat-card">
            <div class="stat-value" style="color:var(--color-success)">+${report.earned}</div>
            <div class="stat-label">Monedas Ganadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:var(--color-danger)">-${report.spent}</div>
            <div class="stat-label">Monedas Gastadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:var(--accent-sub)">${report.tasksCompleted}</div>
            <div class="stat-label">Tareas Completadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:var(--color-warning)">${report.demerits}</div>
            <div class="stat-label">Deméritos Recibidos</div>
          </div>
        </div>
      </div>
    `;
  }

  return pageShell('🏆 Logros y Estadísticas', content, 'dashboard', user.role);
}
