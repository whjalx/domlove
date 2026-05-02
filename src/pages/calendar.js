import { DataService as DS } from '../services/data.js';
import { pageShell } from '../utils/ui.js';

export async function renderCalendar() {
  const user = await DS.getCurrentUser(), room = await DS.getCurrentRoom();
  const today = new Date();
  let year = today.getFullYear(), month = today.getMonth();
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const days = ['Lu','Ma','Mi','Ju','Vi','Sa','Do'];

  async function buildCal(y, m) {
    const data = await DS.getCalendarData(room.id, y, m);
    const firstDay = (new Date(y, m, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const todayDate = today.getDate();
    const isCurrentMonth = y === today.getFullYear() && m === today.getMonth();
    let cells = days.map(d => `<div class="calendar-header-cell">${d}</div>`).join('');
    for (let i = 0; i < firstDay; i++) cells += '<div class="calendar-cell empty"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
      const cls = data[d] !== 'none' ? data[d] : '';
      const isToday = isCurrentMonth && d === todayDate;
      cells += `<div class="calendar-cell ${cls} ${isToday ? 'today' : ''}">${d}</div>`;
    }
    return cells;
  }

  const initialGrid = await buildCal(year, month);

  const content = `
    <div class="flex-between mb-md">
      <button class="btn btn-sm btn-outline" id="cal-prev">◀</button>
      <h3 id="cal-title" style="font-family:var(--font-display)">${months[month]} ${year}</h3>
      <button class="btn btn-sm btn-outline" id="cal-next">▶</button>
    </div>
    <div class="calendar-grid" id="cal-grid">${initialGrid}</div>
    <div class="flex gap-sm mt-lg" style="justify-content:center">
      <span class="badge badge-success">✓ Completo</span>
      <span class="badge badge-warning">~ Parcial</span>
      <span class="badge badge-danger">✕ Faltó</span>
    </div>`;

  setTimeout(() => {
    document.getElementById('cal-prev')?.addEventListener('click', async () => {
      month--; if (month < 0) { month = 11; year--; }
      document.getElementById('cal-title').textContent = `${months[month]} ${year}`;
      document.getElementById('cal-grid').innerHTML = await buildCal(year, month);
    });
    document.getElementById('cal-next')?.addEventListener('click', async () => {
      month++; if (month > 11) { month = 0; year++; }
      document.getElementById('cal-title').textContent = `${months[month]} ${year}`;
      document.getElementById('cal-grid').innerHTML = await buildCal(year, month);
    });
  }, 50);
  return pageShell('📅 Calendario', content, 'menu', user.role);
}
