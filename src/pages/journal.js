import { DataService as DS } from '../services/data.js';
import { pageShell, showToast, formatDate, MOODS } from '../utils/ui.js';

function getMoodEmoji(mood) {
  if (mood === 'positive') return '😊';
  if (mood === 'negative') return '😔';
  if (mood === 'neutral') return '😐';
  return mood || '📝';
}

export async function renderJournal() {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom(), isDom = user.role === 'dom';
  const entries = await DS.getJournalEntries(room.id);
  const prompts = await DS.getJournalPrompts(room.id);
  const unusedPrompts = prompts.filter(p => !p.isUsed);

  let content = `
    ${!isDom ? (unusedPrompts.length ? `<div class="card mb-md" style="border-color:var(--accent-sub)"><p class="text-sm text-secondary">💌 Tu Amo/a te dejó una guía:</p><p class="mt-sm" style="font-style:italic;color:var(--accent-sub)">"${unusedPrompts[0].text}"</p><a href="#/journal/new?prompt=${unusedPrompts[0].id}" class="btn btn-sub btn-block btn-sm mt-md">Escribir sobre esto</a></div>` : '') : ''}
    ${!isDom ? '<a href="#/journal/new" class="btn btn-sub btn-block mb-md">✏️ Nueva Entrada</a>' : '<a href="#/journal/prompt" class="btn btn-primary btn-block mb-md">💌 Enviar Guía</a>'}
    ${entries.length ? entries.map(e => `<div class="journal-card mb-sm" onclick="location.hash='/journal/entry/${e.id}'">
      <div class="flex-between"><span class="journal-date">${formatDate(e.createdAt)}</span><span class="journal-mood" title="Análisis de IA">${getMoodEmoji(e.mood)}</span></div>
      <div class="journal-preview">${e.content}</div>
      ${e.audioUrl ? '<div class="text-sm mt-sm">🎵 Nota de voz adjunta</div>' : ''}
      ${e.prompt ? '<div class="journal-prompt-badge">💌 Con guía del Amo/a</div>' : ''}
      ${isDom && !e.isReadByDom ? '<span class="badge badge-sub mt-sm">Nueva</span>' : ''}
    </div>`).join('') : '<div class="empty-state"><div class="empty-state-icon">📖</div><div class="empty-state-title">Sin entradas</div></div>'}`;
  return pageShell('📖 Diario', content, 'journal', user.role);
}

export async function renderJournalEntry(params) {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom(), isDom = user.role === 'dom';
  const entries = await DS.getJournalEntries(room.id);
  const prompts = await DS.getJournalPrompts(room.id);
  const existing = params.id ? entries.find(e => e.id === params.id) : null;
  const promptId = params.prompt;
  const prompt = promptId ? prompts.find(p => p.id === promptId) : null;

  if (existing && isDom) {
    await DS.updateJournalEntry(existing.id, { isReadByDom: true });
    const content = `
      <div class="flex-between mb-md"><span class="text-sm text-muted">${formatDate(existing.createdAt)}</span><span style="font-size:1.5rem" title="Análisis de IA">${getMoodEmoji(existing.mood)}</span></div>
      ${existing.prompt ? `<div class="card mb-md" style="border-color:var(--accent-sub)"><p class="text-xs text-muted">Guía:</p><p class="text-sm" style="color:var(--accent-sub);font-style:italic">"${existing.prompt}"</p></div>` : ''}
      <div class="card"><p style="line-height:1.8;white-space:pre-wrap">${existing.content}</p></div>
      ${existing.audioUrl ? `<div class="card mt-md text-center"><audio src="${existing.audioUrl}" controls style="width:100%"></audio></div>` : ''}
      <a href="#/journal" class="btn btn-outline btn-block mt-lg">Volver</a>`;
    return pageShell('📖 Entrada', content, 'journal', user.role);
  }

  const content = `
    ${prompt ? `<div class="card mb-md" style="border-color:var(--accent-sub)"><p class="text-xs text-muted">💌 Guía de tu Amo/a:</p><p class="mt-sm" style="font-style:italic;color:var(--accent-sub)">"${prompt.text}"</p></div>` : ''}
    <form id="journal-form">
      <div class="form-group"><label class="form-label">Escribe aquí (Tu humor será analizado por IA)</label><textarea class="form-textarea" id="jf-content" style="min-height:200px" required>${existing?.content||''}</textarea></div>
      <div class="form-group" style="text-align:center;">
        <button type="button" class="btn btn-outline" id="journal-record" style="font-size:1.5rem; width:60px; height:60px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">🎙️</button>
        <p class="text-xs text-secondary mt-sm">Opcional: Graba una nota de voz</p>
      </div>
      <button class="btn btn-sub btn-block btn-lg" type="submit">${existing?'Guardar':'Publicar'}</button>
      <a href="#/journal" class="btn btn-outline btn-block mt-sm">Cancelar</a>
    </form>
    <style>
      .recording-pulse { animation: pulseRed 1.5s infinite; color: red !important; border-color: red !important; }
      @keyframes pulseRed { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
    </style>`;

  setTimeout(() => {
    document.querySelectorAll('.mood-pick').forEach(b => {
      b.onclick = () => { document.querySelectorAll('.mood-pick').forEach(x => x.style.outline=''); b.style.outline='2px solid var(--accent-sub)'; document.getElementById('jf-mood').value=b.dataset.mood; };
    });
    let uploadedAudioUrl = null;
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;
    const recordBtn = document.getElementById('journal-record');
    
    recordBtn?.addEventListener('click', async () => {
      if (isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        recordBtn.textContent = '🎙️';
        recordBtn.classList.remove('recording-pulse');
      } else {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            audioChunks = [];
            showToast('Subiendo audio...', 'info');
            const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
            try {
              const res = await DS.uploadFile(file);
              uploadedAudioUrl = res.url;
              showToast('Audio adjuntado ✅', 'success');
              recordBtn.textContent = '✅';
              recordBtn.disabled = true;
            } catch(e) { showToast('Error al subir audio', 'error'); }
          };
          mediaRecorder.start();
          isRecording = true;
          recordBtn.textContent = '⏹️';
          recordBtn.classList.add('recording-pulse');
        } catch (err) {
          showToast('Micrófono no disponible', 'error');
        }
      }
    });

    document.getElementById('journal-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const data = { roomId: room.id, userId: user.id, content: document.getElementById('jf-content').value, prompt: prompt?.text || null };
      if (uploadedAudioUrl) data.audioUrl = uploadedAudioUrl;
      try {
        if (existing) await DS.updateJournalEntry(existing.id, data);
        else { await DS.createJournalEntry(data); if (prompt) await DS.updateJournalEntry(prompt.id, { isUsed: true }); }
        showToast('Entrada guardada 📖');
        window.location.hash = '/journal';
      } catch (err) { showToast(err.message, 'error'); }
    });
  }, 50);
  return pageShell(existing ? '✏️ Editar' : '✏️ Nueva Entrada', content, 'journal', user.role);
}

export async function renderJournalPrompt() {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom();
  const templates = ['¿Cómo te sentiste hoy al cumplir tus tareas?', '¿Qué aprendiste hoy sobre ti misma?', 'Describe un momento donde sentiste orgullo hoy.', '¿Qué te gustaría mejorar mañana?', 'Escribe sobre tus emociones durante el día.'];
  const content = `<form id="prompt-form">
    <div class="form-group"><label class="form-label">Plantillas rápidas</label><div class="flex flex-col gap-sm">${templates.map(t => `<button type="button" class="btn btn-sm btn-outline text-sm prompt-tpl" style="text-align:left;white-space:normal">${t}</button>`).join('')}</div></div>
    <div class="form-group mt-md"><label class="form-label">O escribe tu propia guía</label><textarea class="form-textarea" id="pf-text" placeholder="Escribe lo que quieres que tu Sumisa reflexione..." required></textarea></div>
    <button class="btn btn-primary btn-block btn-lg" type="submit">💌 Enviar Guía</button>
    <a href="#/journal" class="btn btn-outline btn-block mt-sm">Cancelar</a>
  </form>`;
  setTimeout(() => {
    document.querySelectorAll('.prompt-tpl').forEach(b => { b.onclick = () => { document.getElementById('pf-text').value = b.textContent; }; });
    document.getElementById('prompt-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      try {
        await DS.createJournalPrompt({ roomId: room.id, text: document.getElementById('pf-text').value });
        showToast('Guía enviada 💌');
        window.location.hash = '/journal';
      } catch(err) { showToast(err.message, 'error'); }
    });
  }, 50);
  return pageShell('💌 Guía de Diario', content, 'journal', user.role);
}
