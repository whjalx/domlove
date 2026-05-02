import { DataService as DS } from '../services/data.js';
import { pageShell, formatTime } from '../utils/ui.js';

export async function renderGuide() {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom(), isDom = user.role === 'dom';
  const messages = await DS.getGuideMessages(room.id);

  const content = `
    <div class="chat-container" id="chat-msgs">
      ${messages.length ? messages.map(m => `
        <div class="chat-bubble ${m.role}">
          <div>${m.text}</div>
          ${m.audioUrl ? `<audio src="${m.audioUrl}" controls style="width:100%; height:30px; margin-top:5px; border-radius:15px;"></audio>` : ''}
          <div class="chat-time">${formatTime(m.createdAt)}</div>
        </div>`).join('') : '<div class="empty-state" id="empty-chat"><div class="empty-state-icon">💬</div><div class="empty-state-title">Sin mensajes</div><div class="empty-state-text">Usa este modo para guiar en tiempo real</div></div>'}
    </div>
    <div class="chat-input-bar">
      <input class="form-input" id="guide-input" placeholder="${isDom ? 'Escribe una instrucción...' : 'Responder...'}" />
      <button class="btn btn-outline" id="guide-record" style="border:none; background:transparent; font-size:1.5rem;">🎙️</button>
      <button class="btn btn-primary" id="guide-send">➤</button>
    </div>
    <style>
      .recording-pulse { animation: pulseRed 1.5s infinite; color: red !important; }
      @keyframes pulseRed { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
    </style>
    `;

  setTimeout(() => {
    const send = async () => {
      const input = document.getElementById('guide-input');
      const text = input?.value?.trim();
      if (!text) return;
      await DS.addGuideMessage({ roomId: room.id, role: user.role, text, userId: user.id });
      input.value = '';
    };
    document.getElementById('guide-send')?.addEventListener('click', send);
    document.getElementById('guide-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
    setTimeout(() => { const c = document.getElementById('chat-msgs'); if (c) c.scrollTop = 99999; }, 100);

    // Audio Recording
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;
    const recordBtn = document.getElementById('guide-record');
    
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
            showToast('Enviando audio...', 'info');
            const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
            try {
              const res = await DS.uploadFile(file);
              await DS.addGuideMessage({ roomId: room.id, role: user.role, text: '🎵 Mensaje de voz', userId: user.id, audioUrl: res.url });
            } catch(e) { showToast('Error al enviar audio', 'error'); }
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

    // Socket.io Listener
    if (DS.socket) {
      const socketEvent = `chat_message_${room.id}`;
      // Remove any previous listeners to avoid duplicates
      DS.socket.off(socketEvent);
      DS.socket.on(socketEvent, (m) => {
        const c = document.getElementById('chat-msgs');
        if (!c) return;
        const empty = document.getElementById('empty-chat');
        if (empty) empty.remove();

        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${m.role}`;
        bubble.innerHTML = `<div>${m.text}</div>${m.audioUrl ? `<audio src="${m.audioUrl}" controls style="width:100%; height:30px; margin-top:5px; border-radius:15px;"></audio>` : ''}<div class="chat-time">${formatTime(m.createdAt)}</div>`;
        c.appendChild(bubble);
        c.scrollTop = 99999;
      });
    }

  }, 50);
  return pageShell('🔐 Chat Priv', content, 'menu', user.role);
}
