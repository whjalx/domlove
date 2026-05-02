import { DataService as DS } from '../services/data.js';
import { pageShell, formatRelative } from '../utils/ui.js';

function getRank(coins) {
  if (coins >= 3000) return 'Absoluta 👑';
  if (coins >= 1500) return 'Esclava ⛓️';
  if (coins >= 600) return 'Devota 💎';
  if (coins >= 200) return 'Sumisa 🌹';
  return 'Aprendiz 🌱';
}

export async function renderDashboard() {
  const user = await DS.getCurrentUser();
  const room = await DS.getCurrentRoom();
  const partner = await DS.getPartner();
  const isDom = user.role === 'dom';
  const tasks = await DS.getTasks(room.id);
  const activeTasks = tasks.filter(t => t.status === 'active');
  const pendingSubs = await DS.getSubmissions(room.id, 'pending');
  const demerits = await DS.getDemerits(room.id);
  const rules = await DS.getRules(room.id);
  const subUser = isDom ? partner : user;
  const coins = subUser?.coins || 0;
  const totalEarned = subUser?.totalEarned || 0;
  const streak = subUser?.streak || 0;
  const demeritTotal = subUser?.demerits || 0;
  const recentTxns = subUser ? (await DS.getTransactions(subUser.id)).slice(0, 5) : [];

  let content = '';
  if (isDom) {
    content = `
      <div class="card card-glass" style="margin-bottom:var(--space-md);padding:var(--space-lg);background:linear-gradient(135deg,rgba(201,48,44,0.1),rgba(212,168,83,0.05))">
        <div class="flex-between">
          <div>
            <p class="text-sm text-secondary">Bienvenido/a</p>
            <h3 style="font-family:var(--font-display);margin-top:4px">${user.displayName} 👑</h3>
          </div>
          <div class="coin-display"><span class="coin-icon">🪙</span><span class="coin-amount">${coins}</span></div>
        </div>
        ${partner ? `
          <div class="mt-md" style="display:flex;justify-content:space-between;align-items:center;">
            <p class="text-sm" style="color:var(--text-secondary)">Sumisa: <strong style="color:var(--accent-sub)">${partner.displayName}</strong></p>
            <div style="text-align:right">
              <span class="badge" style="background:var(--bg-card);color:var(--text-primary)">Nivel: ${getRank(totalEarned)}</span>
              <span class="badge" style="background:var(--bg-card);color:var(--text-primary)">Racha: ${streak} 🔥</span>
            </div>
          </div>
        ` : '<p class="text-sm mt-md text-muted">Esperando que tu Sumisa se una...</p>'}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-md)">
        <div class="stat-card"><div class="stat-value">${activeTasks.length}</div><div class="stat-label">Tareas Activas</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--color-warning)">${pendingSubs.length}</div><div class="stat-label">Por Revisar</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--color-danger)">${demeritTotal}</div><div class="stat-label">Deméritos</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--color-success)">${rules.filter(r=>r.isActive).length}</div><div class="stat-label">Reglas</div></div>
      </div>
      ${pendingSubs.length ? `<div class="card mb-md" style="border-color:var(--color-warning)"><div class="card-header"><span class="card-title">⏳ Pruebas Pendientes</span><a href="#/tasks/review" class="btn btn-sm btn-outline">Ver</a></div>${pendingSubs.slice(0,3).map(s => {const t=tasks.find(x=>x.id===s.taskId);return `<div class="flex-between mb-sm"><span class="text-sm">${t?.title||'Tarea'}</span><span class="badge badge-warning">Pendiente</span></div>`;}).join('')}</div>` : ''}
      <div class="card-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-sm)">
        <a href="#/tasks/new" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">📋</div><div class="text-sm">Nueva Tarea</div></a>
        <a href="#/demerits/new" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">⚠️</div><div class="text-sm">Dar Demérito</div></a>
        <a href="#/guide" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">🔐</div><div class="text-sm">Chat Priv</div></a>
        <a href="#/achievements" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">🏆</div><div class="text-sm">Logros</div></a>
      </div>`;
  } else {
    const todayStr = new Date().toISOString().slice(0,10);
    const todayTasks = activeTasks.filter(t => t.recurrence === 'daily' || t.createdAt.startsWith(todayStr));
    content = `
      <div class="card card-glass" style="margin-bottom:var(--space-md);padding:var(--space-lg);background:linear-gradient(135deg,rgba(232,160,191,0.1),rgba(212,168,83,0.05))">
        <div class="flex-between">
          <div>
            <p class="text-sm text-secondary">Hola</p>
            <h3 style="font-family:var(--font-display);margin-top:4px">${user.displayName}</h3>
            <div class="mt-sm"><span class="badge" style="background:var(--bg-card);color:var(--text-primary)">${getRank(totalEarned)}</span></div>
          </div>
          <div style="text-align:right;">
            <div class="coin-display"><span class="coin-icon">🪙</span><span class="coin-amount">${coins}</span></div>
            <div class="mt-sm"><span class="badge" style="background:rgba(255,100,0,0.1);color:#ff9800;font-size:1rem;">🔥 Racha: ${streak}</span></div>
          </div>
        </div>
        ${partner ? `<p class="text-sm mt-md" style="color:var(--text-secondary)">Amo/a: <strong style="color:var(--accent-dom)">${partner.displayName}</strong></p>` : ''}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-md)">
        <div class="stat-card"><div class="stat-value">${coins}</div><div class="stat-label">Monedas</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--color-danger)">${demeritTotal}</div><div class="stat-label">Deméritos</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--accent-sub)">${todayTasks.length}</div><div class="stat-label">Hoy</div></div>
      </div>
      ${todayTasks.length ? `<div class="mb-md"><h4 style="margin-bottom:var(--space-sm)">📋 Tareas de Hoy</h4>${todayTasks.slice(0,5).map(t => `<a href="#/tasks/submit/${t.id}" class="task-card mb-sm" style="text-decoration:none"><div class="task-top"><span class="task-title">${t.title}</span><span class="task-coin">🪙 ${t.coinReward}</span></div>${t.description ? `<div class="task-desc">${t.description}</div>` : ''}</a>`).join('')}</div>` : '<div class="empty-state"><div class="empty-state-icon">✨</div><div class="empty-state-title">Sin tareas hoy</div><div class="empty-state-text">Tu Amo/a no ha asignado tareas</div></div>'}
      ${recentTxns.length ? `<div class="card mt-md"><div class="card-header"><span class="card-title">💰 Reciente</span></div>${recentTxns.map(t => `<div class="flex-between mb-sm"><span class="text-sm">${t.reason}</span><span class="text-sm" style="color:${t.type==='earned'?'var(--color-success)':'var(--color-danger)'}">${t.type==='earned'?'+':'-'}${t.amount} 🪙</span></div>`).join('')}</div>` : ''}
      <div class="card-grid mt-md" style="grid-template-columns:1fr 1fr;gap:var(--space-sm)">
        <a href="#/shop" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">🛒</div><div class="text-sm">Tienda</div></a>
        <a href="#/achievements" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">🏆</div><div class="text-sm">Logros</div></a>
        <a href="#/journal/new" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">📖</div><div class="text-sm">Escribir Diario</div></a>
        <a href="#/calendar" class="card text-center" style="text-decoration:none"><div style="font-size:1.5rem;margin-bottom:4px">📅</div><div class="text-sm">Calendario</div></a>
      </div>`;
  }
  return pageShell(isDom ? '👑 Dashboard' : '🌹 Dashboard', content, 'dashboard', user.role, room.name);
}
