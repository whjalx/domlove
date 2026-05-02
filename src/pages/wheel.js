import { DataService as DS } from '../services/data.js';
import { pageShell, showToast } from '../utils/ui.js';

export async function renderWheel() {
  const user = await DS.getCurrentUser();
  const room = await DS.getCurrentRoom();
  const isDom = user.role === 'dom';
  
  if (!room) return '<div class="card p-lg text-center">No estás en ninguna sala</div>';

  let options = await DS.getWheelOptions(room.id);
  // Default options if empty
  if (options.length === 0) {
    options = Array.from({length: 8}, (_, i) => ({
      label: `Opción ${i+1}`, effectType: 'nothing', effectValue: 0
    }));
  }

  const content = document.createElement('div');
  content.className = 'wheel-container';
  content.innerHTML = `
    <style>
      .wheel-wrapper {
        position: relative;
        width: 300px;
        height: 300px;
        margin: 2rem auto;
        border-radius: 50%;
        border: 4px solid var(--accent-gold);
        overflow: hidden;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
      }
      .wheel {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: relative;
        transition: transform 4s cubic-bezier(0.1, 0.7, 0.1, 1);
        background: conic-gradient(
          #e74c3c 0deg 45deg,
          #3498db 45deg 90deg,
          #2ecc71 90deg 135deg,
          #f1c40f 135deg 180deg,
          #9b59b6 180deg 225deg,
          #e67e22 225deg 270deg,
          #1abc9c 270deg 315deg,
          #34495e 315deg 360deg
        );
      }
      .wheel-pointer {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-top: 30px solid white;
        z-index: 10;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
      }
      .wheel-segment-label {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 50%;
        height: 20px;
        transform-origin: 0% 50%;
        text-align: right;
        padding-right: 10px;
        color: white;
        font-weight: bold;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        font-size: 0.8rem;
        margin-top: -10px; /* half height */
      }
    </style>
    
    <div class="card p-md text-center mb-lg">
      <h2>🎡 La Ruleta</h2>
      <p class="text-sm text-secondary">${isDom ? 'Configura las 8 opciones de la ruleta.' : 'Gira la ruleta una vez al día para descubrir tu destino.'}</p>
    </div>

    ${isDom ? `
      <div class="card p-md">
        <h3>Opciones</h3>
        <form id="wheel-form" class="flex flex-col gap-sm mt-md">
          ${options.map((opt, i) => `
            <div class="flex gap-sm" style="align-items:center; background:var(--bg-lighter); padding:8px; border-radius:8px;">
              <span style="font-weight:bold; width:20px;">${i+1}</span>
              <input type="text" class="form-input" style="flex:2" value="${opt.label}" name="label_${i}" placeholder="Nombre" required />
              <select class="form-input" style="flex:1" name="type_${i}">
                <option value="nothing" ${opt.effectType==='nothing'?'selected':''}>Nada</option>
                <option value="coins" ${opt.effectType==='coins'?'selected':''}>Monedas</option>
                <option value="demerit" ${opt.effectType==='demerit'?'selected':''}>Demérito</option>
                <option value="task" ${opt.effectType==='task'?'selected':''}>Tarea Sorpresa</option>
              </select>
              <input type="number" class="form-input" style="flex:1" value="${opt.effectValue||0}" name="value_${i}" placeholder="Valor" />
            </div>
          `).join('')}
          <button type="submit" class="btn btn-primary mt-md">Guardar Configuración</button>
        </form>
      </div>
    ` : `
      <div style="position:relative; width: 300px; margin: 0 auto;">
        <div class="wheel-pointer"></div>
        <div class="wheel-wrapper">
          <div class="wheel" id="wheel-element">
            ${options.map((opt, i) => `
              <div class="wheel-segment-label" style="transform: rotate(${i * 45 + 22.5}deg);">
                ${opt.label}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div class="text-center mt-lg">
        <button id="spin-btn" class="btn btn-gold btn-lg" style="width: 200px; font-size: 1.2rem;">✨ GIRAR ✨</button>
      </div>
    `}
  `;

  setTimeout(() => {
    if (isDom) {
      document.getElementById('wheel-form')?.addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const newOptions = [];
        for (let i=0; i<8; i++) {
          newOptions.push({
            label: fd.get('label_'+i),
            effectType: fd.get('type_'+i),
            effectValue: parseInt(fd.get('value_'+i)) || 0
          });
        }
        try {
          await DS.saveWheelOptions(room.id, newOptions);
          showToast('Ruleta configurada con éxito', 'success');
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    } else {
      const btn = document.getElementById('spin-btn');
      const wheel = document.getElementById('wheel-element');
      let isSpinning = false;

      btn?.addEventListener('click', async () => {
        if (isSpinning) return;
        isSpinning = true;
        btn.disabled = true;
        btn.textContent = 'Girando...';

        try {
          const winner = await DS.spinWheel(room.id);
          
          // Find winner index
          const winnerIndex = options.findIndex(o => o.id === winner.id || (o.label === winner.label && o.effectType === winner.effectType));
          
          // Calculate rotation
          // Each segment is 45 degrees. The center of segment i is at i * 45 + 22.5 degrees.
          // Since the wheel rotates clockwise and pointer is at top (0 deg), to land on segment i we must rotate:
          // 360 - (i * 45 + 22.5) degrees. Plus some extra spins (e.g. 5 spins = 1800 deg).
          const extraSpins = 360 * 5;
          const targetRotation = extraSpins + (360 - (winnerIndex * 45 + 22.5));

          wheel.style.transform = `rotate(${targetRotation}deg)`;

          // Wait for animation to finish
          setTimeout(() => {
            let resultMsg = `¡Has ganado: ${winner.label}!`;
            if (winner.effectType === 'coins') resultMsg += `\n+${winner.effectValue} Monedas`;
            if (winner.effectType === 'demerit') resultMsg += `\n+${winner.effectValue} Deméritos`;
            
            alert(resultMsg);
            
            // Reset wheel state internally so next spin looks fine
            wheel.style.transition = 'none';
            wheel.style.transform = `rotate(${targetRotation % 360}deg)`;
            // Trigger reflow
            wheel.offsetHeight;
            wheel.style.transition = 'transform 4s cubic-bezier(0.1, 0.7, 0.1, 1)';
            
            isSpinning = false;
            btn.textContent = '¡Giro Completado!';
          }, 4000);

        } catch (err) {
          showToast(err.message, 'error');
          isSpinning = false;
          btn.disabled = false;
          btn.textContent = '✨ GIRAR ✨';
        }
      });
    }
  }, 50);

  return pageShell('Ruleta', content.outerHTML, 'wheel', user.role);
}
