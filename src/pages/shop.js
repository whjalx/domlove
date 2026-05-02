import { DataService as DS } from '../services/data.js';
import { pageShell, showToast, confirmModal, showConfetti, formatDate } from '../utils/ui.js';

export async function renderShop() {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom(), isDom = user.role === 'dom';
  const rewards = await DS.getRewards(room.id);
  const subUser = isDom ? await DS.getPartner() : user;
  const purchases = subUser ? await DS.getPurchases(subUser.id) : [];

  const premios = rewards.filter(r => (r.rewardCategory || 'premio') === 'premio');
  const mejoras = rewards.filter(r => r.rewardCategory === 'mejora');
  const types = { once: 'Un uso', '1_day': '1 Día', '3_days': '3 Días', permanent: 'Permanente', daily: 'Diaria', weekly: 'Semanal' };

  const renderGrid = (items, emptyIcon, emptyTitle) => {
    if (!items.length) return `<div class="empty-state" style="padding:var(--space-lg)"><div class="empty-state-icon">${emptyIcon}</div><div class="empty-state-title">${emptyTitle}</div></div>`;
    return `<div class="card-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-sm)">
      ${items.map(r => `<div class="reward-card" style="position:relative" ${isDom ? `onclick="location.hash='/shop/edit/${r.id}'"` : ''}>
        ${isDom ? `<button class="btn btn-sm btn-danger" style="position:absolute;top:4px;right:4px;padding:2px 6px;font-size:0.8rem;background:transparent;color:var(--color-danger)" onclick="event.stopPropagation();window._delReward('${r.id}')">✕</button>` : ''}
        <div class="reward-emoji">${r.emoji || '🎁'}</div>
        <div class="reward-title">${r.title}</div>
        <span class="badge" style="background:var(--bg-secondary);margin:4px 0">${types[r.type] || r.type}</span>
        ${!isDom ? `<button class="btn btn-gold btn-block btn-sm mt-sm" onclick="event.stopPropagation();window._buy('${r.id}')" ${(subUser?.coins || 0) < r.cost ? 'disabled' : ''}>${r.cost} 🪙</button>` : `<div class="mt-sm text-sm" style="color:var(--accent-gold)">${r.cost} 🪙</div>`}
      </div>`).join('')}
    </div>`;
  };

  let content = `
    <div class="card card-glass mb-md" style="text-align:center;padding:var(--space-md);border-color:var(--accent-gold)">
      <div class="text-sm text-secondary">Monedas Disponibles</div>
      <div style="font-size:2.5rem;font-weight:700;color:var(--accent-gold)">🪙 ${subUser?.coins || 0}</div>
    </div>
    ${isDom ? '<a href="#/shop/new" class="btn btn-primary btn-block mb-md">+ Nueva Recompensa</a>' : ''}

    <!-- Tabs: Premios / Mejoras -->
    <div class="tabs mb-md">
      <button class="tab active" data-shop-tab="premios">🏆 Premios (${premios.length})</button>
      <button class="tab" data-shop-tab="mejoras">⚡ Mejoras (${mejoras.length})</button>
    </div>

    <div id="shop-premios">
      ${renderGrid(premios, '🏆', 'Sin premios disponibles')}
    </div>
    <div id="shop-mejoras" style="display:none">
      ${renderGrid(mejoras, '⚡', 'Sin mejoras disponibles')}
    </div>

    <h4 class="mb-sm mt-lg">Historial de Compras (${purchases.length})</h4>
    <div class="flex flex-col gap-sm" style="max-height: 400px; overflow-y: auto;">
      ${purchases.length ? purchases.map(p => `<div class="card"><div class="flex-between"><span style="font-weight:600">${p.rewardTitle}</span><span style="color:var(--color-danger)">-${p.cost} 🪙</span></div><div class="flex-between mt-xs"><div class="text-xs text-secondary">${formatDate(p.purchasedAt)}</div>${isDom ? `<button class="btn btn-sm" style="background:transparent;color:var(--color-danger);padding:0" onclick="window._delPurchase('${p.id}')">🗑️</button>` : ''}</div></div>`).join('') : '<p class="text-sm text-muted">Sin compras aún</p>'}
    </div>`;

  if (!isDom) {
    window._buy = async (id) => {
      try {
        if (await confirmModal('Comprar Recompensa', '¿Gastar monedas en esto?')) {
          await DS.purchaseReward(id, user.id);
          showConfetti();
          showToast('¡Compra exitosa!', 'success');
          setTimeout(() => location.reload(), 1500);
        }
      } catch (err) { showToast(err.message, 'error'); }
    };
  } else {
    window._delReward = async (id) => {
      if (await confirmModal('Eliminar', '¿Eliminar esta recompensa?')) {
        await DS.deleteReward(id);
        location.reload();
      }
    };
    window._delPurchase = async (id) => {
      if (await confirmModal('Eliminar Compra', '¿Ocultar este registro del historial?')) {
        await DS.deletePurchase(id);
        location.reload();
      }
    };
  }

  setTimeout(() => {
    document.querySelectorAll('[data-shop-tab]').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('[data-shop-tab]').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('shop-premios').style.display = tab.dataset.shopTab === 'premios' ? 'block' : 'none';
        document.getElementById('shop-mejoras').style.display = tab.dataset.shopTab === 'mejoras' ? 'block' : 'none';
      };
    });
  }, 50);

  return pageShell('🛒 Tienda', content, 'shop', user.role);
}

export async function renderRewardForm(params) {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom();
  const existing = params.id ? (await DS.getRewards(room.id)).find(r => r.id === params.id) : null;
  const content = `<form id="reward-form">
    <div class="form-group"><label class="form-label">Emoji / Icono</label><input class="form-input" id="rf-emoji" value="${existing?.emoji || '🎁'}" required style="font-size:2rem;text-align:center" /></div>
    <div class="form-group"><label class="form-label">Título</label><input class="form-input" id="rf-title" value="${existing?.title || ''}" required /></div>
    <div class="form-group"><label class="form-label">Descripción</label><textarea class="form-textarea" id="rf-desc">${existing?.description || ''}</textarea></div>
    <div class="form-group"><label class="form-label">Costo (Monedas)</label><input class="form-input" type="number" id="rf-cost" min="1" value="${existing?.cost || 50}" required /></div>
    <div class="form-group"><label class="form-label">Sección</label>
      <select class="form-select" id="rf-cat">
        <option value="premio" ${(existing?.rewardCategory || 'premio')==='premio'?'selected':''}>🏆 Premio</option>
        <option value="mejora" ${existing?.rewardCategory==='mejora'?'selected':''}>⚡ Mejora</option>
      </select>
    </div>
    <div class="form-group"><label class="form-label">Tipo / Duración</label><select class="form-select" id="rf-type"></select></div>
    <button class="btn btn-primary btn-block btn-lg" type="submit">${existing ? 'Guardar' : 'Crear'}</button>
    ${existing ? `<button type="button" class="btn btn-danger btn-block mt-sm" id="btn-del">Eliminar</button>` : ''}
    <a href="#/shop" class="btn btn-outline btn-block mt-sm">Cancelar</a>
  </form>`;
  setTimeout(() => {
    const catEl = document.getElementById('rf-cat');
    const typeEl = document.getElementById('rf-type');
    const existingType = existing ? existing.type : '';
    
    function updateTypes() {
      if (!catEl || !typeEl) return;
      if (catEl.value === 'premio') {
        typeEl.innerHTML = '<option value="once">Un solo uso (Cupón)</option>';
      } else {
        typeEl.innerHTML = '<option value="1_day">1 Día</option><option value="3_days">3 Días</option><option value="permanent">Permanente</option>';
      }
      if (existingType && Array.from(typeEl.options).some(o => o.value === existingType)) {
        typeEl.value = existingType;
      }
    }
    
    if (catEl) {
      catEl.addEventListener('change', updateTypes);
      updateTypes();
    }

    document.getElementById('reward-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const data = {
        roomId: room.id,
        title: document.getElementById('rf-title').value,
        description: document.getElementById('rf-desc').value,
        cost: parseInt(document.getElementById('rf-cost').value),
        type: document.getElementById('rf-type').value,
        emoji: document.getElementById('rf-emoji').value,
        rewardCategory: document.getElementById('rf-cat').value
      };
      if (existing) await DS.updateReward(existing.id, data);
      else await DS.createReward(data);
      showToast('Recompensa guardada');
      window.location.hash = '/shop';
    });
    document.getElementById('btn-del')?.addEventListener('click', async () => {
      if (await confirmModal('Eliminar', '¿Seguro?')) { await DS.deleteReward(existing.id); window.location.hash = '/shop'; }
    });
  }, 50);
  return pageShell(existing ? 'Editar Recompensa' : 'Nueva Recompensa', content, 'shop', user.role);
}
