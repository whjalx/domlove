import { DataService as DS } from '../services/data.js';
import { pageShell, showToast, confirmModal, TASK_CATEGORIES, formatDate } from '../utils/ui.js';

export async function renderTasks() {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom(), isDom = user.role === 'dom';
  const tasks = await DS.getTasks(room.id);
  const active = tasks.filter(t => t.status === 'active'), completed = tasks.filter(t => t.status === 'completed');

  let content = `
    ${isDom ? '<a href="#/tasks/new" class="btn btn-primary btn-block mb-md">+ Nueva Tarea</a>' : ''}
    ${isDom ? '<a href="#/tasks/review" class="btn btn-outline btn-block mb-md">⏳ Revisar Pruebas</a>' : ''}
    <a href="#/tasks/history" class="btn btn-outline btn-block mb-md">📜 ${isDom ? 'Historial de Sumisa' : 'Mi Historial'}</a>
    <div class="tabs mb-md"><button class="tab active" data-tab="active">Activas (${active.length})</button><button class="tab" data-tab="done">Completadas (${completed.length})</button></div>
    <div id="task-list">
      ${active.length ? active.map(t => taskCard(t, isDom)).join('') : '<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">Sin tareas</div></div>'}
    </div>
    <div id="task-done" style="display:none">
      ${completed.length ? completed.map(t => taskCard(t, isDom)).join('') : '<div class="empty-state"><div class="empty-state-icon">✅</div><div class="empty-state-title">Sin completadas aún</div></div>'}
    </div>`;

  setTimeout(() => {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('task-list').style.display = tab.dataset.tab === 'active' ? 'block' : 'none';
        document.getElementById('task-done').style.display = tab.dataset.tab === 'done' ? 'block' : 'none';
      };
    });
    document.querySelectorAll('[data-delete-task]').forEach(btn => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        if (await confirmModal('Eliminar Tarea', '¿Seguro?')) { await DS.deleteTask(btn.dataset.deleteTask); window.location.hash = '/tasks'; location.reload(); }
      };
    });
  }, 50);
  return pageShell('📋 Tareas', content, 'tasks', user.role);
}

function taskCard(t, isDom) {
  const cat = TASK_CATEGORIES.find(c => c.value === t.category);
  const proofIcons = { photo: '📷', video: '🎥', text: '✍️' };
  return `<div class="task-card mb-sm ${t.status === 'completed' ? 'completed' : ''}" onclick="location.hash='${isDom ? `/tasks/edit/${t.id}` : `/tasks/submit/${t.id}`}'">
    <div class="task-top">
      <span class="task-title">${t.title}</span>
      <span class="task-coin">🪙 ${t.coinReward || 0}</span>
    </div>
    ${t.description ? `<div class="task-desc">${t.description}</div>` : ''}
    <div class="task-meta">
      ${cat ? `<span class="badge" style="background:${cat.color}22;color:${cat.color}">${cat.label}</span>` : ''}
      ${t.isIntense ? `<span class="badge" style="background:var(--color-danger);color:white">🔥 Intensa</span>` : ''}
      ${t.recurrence && t.recurrence !== 'once' ? `<span class="badge badge-info">${t.recurrence === 'daily' ? 'Diaria' : 'Semanal'}</span>` : ''}
      ${t.timeLimit ? `<span class="badge badge-warning">⏱️ ${t.timeLimit} min</span>` : ''}
      ${t.requiresProof ? `<span class="badge badge-warning">${proofIcons[t.proofType] || '📎'} Prueba</span>` : ''}
      ${t.deadline ? `<span class="badge badge-dom">⏰ ${formatDate(t.deadline)}</span>` : ''}
    </div>
    ${isDom ? `<div class="task-meta mt-sm"><button class="btn btn-sm btn-danger" data-delete-task="${t.id}">🗑</button></div>` : ''}
  </div>`;
}

export async function renderTaskForm(params) {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom();
  const tasks = await DS.getTasks(room.id);
  const existing = params.id ? tasks.find(t => t.id === params.id) : null;
  const title = existing ? 'Editar Tarea' : 'Nueva Tarea';

  const content = `<form id="task-form">
    <div class="form-group"><label class="form-label">Título</label><input class="form-input" id="tf-title" value="${existing?.title || ''}" required /></div>
    <div class="form-group"><label class="form-label">Descripción</label><textarea class="form-textarea" id="tf-desc">${existing?.description || ''}</textarea></div>
    <div class="form-group"><label class="form-label">Categoría</label><select class="form-select" id="tf-cat">${TASK_CATEGORIES.map(c => `<option value="${c.value}" ${existing?.category === c.value ? 'selected' : ''}>${c.label}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Monedas de Recompensa</label><input class="form-input" type="number" id="tf-coins" min="0" value="${existing?.coinReward || 10}" /></div>
    <div class="form-group"><label class="form-label">Recurrencia</label><select class="form-select" id="tf-rec"><option value="once" ${existing?.recurrence==='once'?'selected':''}>Una vez</option><option value="daily" ${existing?.recurrence==='daily'?'selected':''}>Diaria</option><option value="weekly" ${existing?.recurrence==='weekly'?'selected':''}>Semanal</option></select></div>
    <div class="form-group"><label class="form-label">Límite de Tiempo (minutos, opcional)</label><input class="form-input" type="number" id="tf-timelimit" min="1" value="${existing?.timeLimit || ''}" placeholder="Ej: 20" /></div>
    <div class="form-group"><label class="form-label">Fecha Límite (opcional)</label><input class="form-input" type="date" id="tf-deadline" value="${existing?.deadline?.slice(0,10) || ''}" /></div>
    <div class="form-group">
      <label class="form-label">¿Requiere Prueba?</label>
      <select class="form-select" id="tf-proof"><option value="" ${!existing?.requiresProof?'selected':''}>No</option><option value="photo" ${existing?.proofType==='photo'?'selected':''}>📷 Foto</option><option value="video" ${existing?.proofType==='video'?'selected':''}>🎥 Video</option><option value="text" ${existing?.proofType==='text'?'selected':''}>✍️ Texto</option></select>
    </div>
    <div class="form-group" style="display:flex; gap:10px; align-items:center;">
      <input type="checkbox" id="tf-intense" ${existing?.isIntense ? 'checked' : ''} style="width:20px;height:20px;" />
      <label class="form-label" for="tf-intense" style="margin:0">Marcar como Tarea Intensa (Activa Aftercare tras aprobar)</label>
    </div>
    <div class="form-group"><label class="form-label">Condiciones (opcional)</label><input class="form-input" id="tf-cond" placeholder="Ej: Antes de las 10pm" value="${existing?.conditions || ''}" /></div>
    <button class="btn btn-primary btn-block btn-lg" type="submit">${existing ? 'Guardar' : 'Crear Tarea'}</button>
    <a href="#/tasks" class="btn btn-outline btn-block mt-sm">Cancelar</a>
  </form>`;

  setTimeout(() => {
    document.getElementById('task-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {
        roomId: room.id, title: document.getElementById('tf-title').value,
        description: document.getElementById('tf-desc').value, category: document.getElementById('tf-cat').value,
        coinReward: parseInt(document.getElementById('tf-coins').value) || 0,
        recurrence: document.getElementById('tf-rec').value,
        timeLimit: parseInt(document.getElementById('tf-timelimit').value) || null,
        deadline: document.getElementById('tf-deadline').value || null,
        requiresProof: !!document.getElementById('tf-proof').value,
        proofType: document.getElementById('tf-proof').value || null,
        conditions: document.getElementById('tf-cond').value || null,
        isIntense: document.getElementById('tf-intense').checked,
      };
      try {
        if (existing) { await DS.updateTask(existing.id, data); showToast('Tarea actualizada'); }
        else { await DS.createTask(data); showToast('¡Tarea creada!'); }
        window.location.hash = '/tasks';
      } catch (err) { showToast(err.message, 'error'); }
    });
  }, 50);
  return pageShell(title, content, 'tasks', user.role);
}

export async function renderTaskSubmit(params) {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom();
  const tasks = await DS.getTasks(room.id);
  const task = tasks.find(t => t.id === params.id);
  if (!task) return pageShell('Error', '<p>Tarea no encontrada</p>', 'tasks', user.role);
  const existingSubs = await DS.getSubmissionsForTask(task.id);
  const hasPending = existingSubs.some(s => s.status === 'pending');

  let viewedAtStr = task.viewedAt;
  if (!hasPending && user.role === 'sub' && task.timeLimit && !viewedAtStr) {
    viewedAtStr = await DS.markTaskViewed(task.id);
  }

  const content = `
    <div class="card mb-md">
      <h3 class="card-title">${task.title}</h3>
      ${task.description ? `<p class="card-body mt-sm">${task.description}</p>` : ''}
      <div class="task-meta mt-md">
        <span class="task-coin">🪙 ${task.coinReward}</span>
        ${task.isIntense ? `<span class="badge" style="background:var(--color-danger);color:white">🔥 Intensa</span>` : ''}
        ${task.conditions ? `<span class="badge badge-info">📌 ${task.conditions}</span>` : ''}
        ${task.deadline ? `<span class="badge badge-dom">⏰ ${formatDate(task.deadline)}</span>` : ''}
      </div>
    </div>
    ${task.timeLimit && viewedAtStr ? `
      <div class="card mb-md text-center" style="border-color:var(--color-danger); background:var(--color-danger-light);">
        <h2 style="color:var(--color-danger); font-family:var(--font-display); letter-spacing:2px; font-size:2rem; margin:0;" id="task-timer">00:00</h2>
        <p class="text-sm" style="color:var(--color-danger)">Tiempo Restante</p>
      </div>
    ` : ''}
    ${hasPending ? '<div class="card mb-md" style="border-color:var(--color-warning)"><p class="text-sm text-center" style="color:var(--color-warning)">⏳ Ya tienes una prueba pendiente de revisión</p></div>' : `
    <form id="submit-form">
      ${task.requiresProof ? `
        <div class="form-group">
          <label class="form-label">${task.proofType === 'photo' ? '📷 Sube una foto' : task.proofType === 'video' ? '🎥 Sube un video' : '✍️ Escribe tu prueba'}</label>
          ${task.proofType === 'text' ? '<textarea class="form-textarea" id="proof-text" placeholder="Escribe aquí..." required></textarea>' : `
            <label class="proof-upload" id="proof-upload-label" for="proof-file">
              <div class="proof-upload-icon">${task.proofType === 'photo' ? '📷' : '🎥'}</div>
              <p class="text-sm text-secondary">Toca para subir</p>
              <input type="file" accept="${task.proofType === 'photo' ? 'image/*' : 'video/*'}" id="proof-file" style="display:none" />
              <div id="upload-progress" class="upload-progress" style="display:none">
                <div class="upload-progress-bar"><div class="upload-progress-bar-fill" id="upload-bar"></div></div>
                <span class="upload-progress-text" id="upload-text">0%</span>
              </div>
              <img id="proof-preview" class="proof-preview" style="display:none" />
            </label>`}
        </div>` : ''}
      <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" id="proof-note" placeholder="Comentario..." /></div>
      <button class="btn btn-sub btn-block btn-lg" type="submit" id="btn-submit">✓ Enviar</button>
    </form>`}
    <a href="#/tasks" class="btn btn-outline btn-block mt-sm">Volver</a>`;

  setTimeout(() => {
    // Timer Logic
    if (task.timeLimit && viewedAtStr && !hasPending) {
      const limitMs = task.timeLimit * 60000;
      const startTime = new Date(viewedAtStr).getTime();
      const timerEl = document.getElementById('task-timer');
      
      const interval = setInterval(() => {
        const remaining = limitMs - (Date.now() - startTime);
        if (remaining <= 0) {
          clearInterval(interval);
          if (timerEl) timerEl.textContent = '00:00';
          showToast('El tiempo expiró. Has fallado la tarea.', 'error');
          setTimeout(() => location.reload(), 2000);
        } else {
          const mins = Math.floor(remaining / 60000);
          const secs = Math.floor((remaining % 60000) / 1000);
          if (timerEl) timerEl.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
        }
      }, 1000);
    }

    const fileInput = document.getElementById('proof-file');
    let uploadedUrl = '';

    if (fileInput) {
      // Make the label clickable by ensuring the file input is triggered
      fileInput.addEventListener('click', (e) => e.stopPropagation());
      
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show progress
        const progressEl = document.getElementById('upload-progress');
        const barEl = document.getElementById('upload-bar');
        const textEl = document.getElementById('upload-text');
        if (progressEl) progressEl.style.display = 'flex';

        try {
          const result = await DS.uploadFile(file, (pct) => {
            if (barEl) barEl.style.width = pct + '%';
            if (textEl) textEl.textContent = pct + '%';
          });
          uploadedUrl = result.url;
          
          // Show preview for images
          if (task.proofType === 'photo') {
            const img = document.getElementById('proof-preview');
            if (img) { img.src = result.url; img.style.display = 'block'; }
          }
          if (progressEl) {
            if (barEl) barEl.style.width = '100%';
            if (textEl) textEl.textContent = '✓ Subido';
          }
          showToast('Archivo subido', 'success');
        } catch (err) {
          showToast('Error subiendo archivo', 'error');
          if (progressEl) progressEl.style.display = 'none';
        }
      };
    }

    document.getElementById('submit-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      let proofUrl = '';
      if (task.proofType === 'text') proofUrl = document.getElementById('proof-text')?.value || '';
      else proofUrl = uploadedUrl;

      if (task.requiresProof && !proofUrl) {
        showToast('Adjunta la prueba requerida', 'error');
        return;
      }
      
      const submitBtn = document.getElementById('btn-submit');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '⏳ Enviando...'; }

      try {
        await DS.submitTask(task.id, { userId: user.id, proofUrl, proofType: task.proofType || 'none', note: document.getElementById('proof-note')?.value || '' });
        // ONLY submit — server handles coins on approval. No double-awarding.
        if (!task.requiresProof) {
          // No-proof tasks: auto-approve via server (coins awarded there)
          // The server reviewSubmission handles coins, so we call it from here indirectly
          // Actually for no-proof tasks, we complete them directly via server
          await DS.addCoins(user.id, task.coinReward, `Tarea: ${task.title}`);
          if (task.recurrence === 'once') await DS.updateTask(task.id, { status: 'completed' });
        }
        showToast(task.requiresProof ? 'Prueba enviada, esperando revisión' : `¡+${task.coinReward} monedas!`, 'success');
        window.location.hash = '/tasks';
      } catch(err) { 
        showToast(err.message, 'error');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '✓ Enviar'; }
      }
    });
  }, 50);
  return pageShell('📋 ' + task.title, content, 'tasks', user.role);
}

export async function renderTaskReview() {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom();
  const pending = await DS.getSubmissions(room.id, 'pending');
  const tasks = await DS.getTasks(room.id);

  const content = pending.length ? pending.map(s => {
    const t = tasks.find(x => x.id === s.taskId);
    return `<div class="card mb-md">
      <div class="card-header"><span class="card-title">${t?.title || 'Tarea'}</span><span class="task-coin">🪙 ${t?.coinReward || 0}</span></div>
      ${s.proofType === 'text' ? `<p class="card-body" style="background:var(--bg-secondary);padding:var(--space-sm);border-radius:var(--radius-sm);margin-bottom:var(--space-sm)">"${s.proofUrl}"</p>` : ''}
      ${s.proofUrl && s.proofType === 'photo' ? `<img src="${s.proofUrl}" style="width:100%;border-radius:var(--radius-md);margin-bottom:var(--space-sm)" />` : ''}
      ${s.proofUrl && s.proofType === 'video' ? `<video src="${s.proofUrl}" controls style="width:100%;border-radius:var(--radius-md);margin-bottom:var(--space-sm)"></video>` : ''}
      ${s.note ? `<p class="text-sm text-secondary mb-sm">📝 ${s.note}</p>` : ''}
      <div class="flex gap-sm">
        <button class="btn btn-danger btn-block btn-sm" onclick="window._reviewSub('${s.id}',false)">✕ Rechazar</button>
        <button class="btn btn-gold btn-block btn-sm" onclick="window._reviewSub('${s.id}',true)">✓ Aprobar</button>
      </div>
    </div>`;
  }).join('') : '<div class="empty-state"><div class="empty-state-icon">✅</div><div class="empty-state-title">Todo revisado</div><div class="empty-state-text">No hay pruebas pendientes</div></div>';

  window._reviewSub = async (id, approved) => {
    try {
      // Server handles coins+completion — single source of truth
      await DS.reviewSubmission(id, approved);
      showToast(approved ? 'Aprobada' : 'Rechazada', 'success');
      window.location.reload();
    } catch (err) { showToast(err.message, 'error'); }
  };

  return pageShell('⏳ Revisiones', content, 'tasks', user.role);
}

export async function renderTaskHistory() {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom();
  const isDom = user.role === 'dom';
  
  const targetUserId = isDom ? (await DS.getPartner())?.id : user.id;
  if (!targetUserId) return pageShell('Sin registros', '<div class="empty-state">No hay registros disponibles</div>', 'tasks', user.role);

  const history = await DS.getTaskHistory(targetUserId);
  
  const renderList = (list) => list.length ? list.map(s => `
    <div class="card mb-md">
      <div class="card-header">
        <span class="card-title">${s.title || 'Tarea eliminada'}</span>
        <span class="task-coin">🪙 ${s.coinReward || 0}</span>
      </div>
      <div class="text-xs text-muted mb-sm">Completada el ${formatDate(s.reviewedAt)} ${s.recurrence ? `(${s.recurrence === 'daily' ? 'Diaria' : s.recurrence === 'weekly' ? 'Semanal' : 'Una vez'})` : ''}</div>
      ${s.proofType === 'text' ? `<p class="card-body" style="background:var(--bg-secondary);padding:var(--space-sm);border-radius:var(--radius-sm);margin-bottom:var(--space-sm)">"${s.proofUrl}"</p>` : ''}
      ${s.proofUrl && s.proofType === 'photo' ? `<img src="${s.proofUrl}" style="width:100%;border-radius:var(--radius-md);margin-bottom:var(--space-sm)" />` : ''}
      ${s.proofUrl && s.proofType === 'video' ? `<video src="${s.proofUrl}" controls style="width:100%;border-radius:var(--radius-md);margin-bottom:var(--space-sm)"></video>` : ''}
      ${s.note ? `<p class="text-sm text-secondary mb-sm">📝 ${s.note}</p>` : ''}
    </div>
  `).join('') : '<div class="empty-state"><div class="empty-state-icon">📜</div><div class="empty-state-title">Historial vacío</div></div>';

  let content = `
    <div class="tabs mb-md">
      <button class="tab active" data-hist-tab="all">Todas</button>
      <button class="tab" data-hist-tab="daily">Diarias</button>
      <button class="tab" data-hist-tab="weekly">Semanales</button>
      <button class="tab" data-hist-tab="once">Una Vez</button>
    </div>
    <div id="hist-all">${renderList(history)}</div>
    <div id="hist-daily" style="display:none">${renderList(history.filter(h => h.recurrence === 'daily'))}</div>
    <div id="hist-weekly" style="display:none">${renderList(history.filter(h => h.recurrence === 'weekly'))}</div>
    <div id="hist-once" style="display:none">${renderList(history.filter(h => h.recurrence === 'once'))}</div>
  `;

  setTimeout(() => {
    document.querySelectorAll('[data-hist-tab]').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('[data-hist-tab]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const view = tab.dataset.histTab;
        document.getElementById('hist-all').style.display = view === 'all' ? 'block' : 'none';
        document.getElementById('hist-daily').style.display = view === 'daily' ? 'block' : 'none';
        document.getElementById('hist-weekly').style.display = view === 'weekly' ? 'block' : 'none';
        document.getElementById('hist-once').style.display = view === 'once' ? 'block' : 'none';
      };
    });
  }, 50);

  return pageShell('📜 Historial', content, 'tasks', user.role);
}
