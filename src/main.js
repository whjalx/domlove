import { Router } from './router.js';
import { DataService } from './services/data.js';
import { renderLogin, renderRegister, renderPinLock } from './pages/auth.js';
import { renderCreateRoom, renderJoinRoom } from './pages/room.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderTasks, renderTaskForm, renderTaskSubmit, renderTaskReview, renderTaskHistory } from './pages/tasks.js';
import { renderShop, renderRewardForm } from './pages/shop.js';
import { renderRules, renderRuleForm } from './pages/rules.js';
import { renderLimits, renderLimitForm } from './pages/limits.js';
import { renderDemerits, renderDemeritForm } from './pages/demerits.js';
import { renderCalendar } from './pages/calendar.js';
import { renderJournal, renderJournalEntry, renderJournalPrompt } from './pages/journal.js';
import { renderGuide } from './pages/guide.js';
import { renderMenu } from './pages/menu.js';
import { renderAchievements } from './pages/achievements.js';
import { renderWheel } from './pages/wheel.js';
import { initAftercare } from './utils/aftercare.js';

window._pinUnlocked = false;

Router.beforeEach(async (path) => {
  const pub = ['/login', '/register', '/'];
  try {
    const user = await DataService.getCurrentUser();
    if (!user && !pub.includes(path)) return '/login';
    if (user) {
      if (!user.roomId && !['/create-room', '/join-room', '/login', '/register', '/'].includes(path)) {
        return user.role === 'dom' ? '/create-room' : '/join-room';
      }
      if (pub.includes(path)) {
        if (!user.roomId) return user.role === 'dom' ? '/create-room' : '/join-room';
        path = '/dashboard';
      }
      if (user.roomId && ['/create-room', '/join-room'].includes(path)) path = '/dashboard';
    }

    // Check PIN Lock
    if (user && !pub.includes(path) && path !== '/pin-lock' && !window._pinUnlocked) {
      const needsPin = await DataService.verifyPin(''); // Check if empty pin passes (means no pin set)
      if (!needsPin) {
        return '/pin-lock';
      } else {
        window._pinUnlocked = true;
      }
    }
    
    // Init Realtime
    if (user) {
      DataService.initSocket();
      DataService.initPush();
      initAftercare();
    }
  } catch (err) {
    console.error('Guard error:', err);
    if (!pub.includes(path)) return '/login';
  }
  return path;
});

Router.register('/', renderLogin);
Router.register('/login', renderLogin);
Router.register('/register', renderRegister);
Router.register('/pin-lock', renderPinLock);
Router.register('/create-room', renderCreateRoom);
Router.register('/join-room', renderJoinRoom);
Router.register('/dashboard', renderDashboard);
Router.register('/tasks', renderTasks);
Router.register('/tasks/new', renderTaskForm);
Router.register('/tasks/edit/:id', renderTaskForm);
Router.register('/tasks/submit/:id', renderTaskSubmit);
Router.register('/tasks/review', renderTaskReview);
Router.register('/tasks/history', renderTaskHistory);
Router.register('/shop', renderShop);
Router.register('/shop/new', renderRewardForm);
Router.register('/shop/edit/:id', renderRewardForm);
Router.register('/rules', renderRules);
Router.register('/rules/new', renderRuleForm);
Router.register('/rules/edit/:id', renderRuleForm);
Router.register('/limits', renderLimits);
Router.register('/limits/new', renderLimitForm);
Router.register('/limits/edit/:id', renderLimitForm);
Router.register('/demerits', renderDemerits);
Router.register('/demerits/new', renderDemeritForm);
Router.register('/calendar', renderCalendar);
Router.register('/journal', renderJournal);
Router.register('/journal/new', renderJournalEntry);
Router.register('/journal/entry/:id', renderJournalEntry);
Router.register('/journal/prompt', renderJournalPrompt);
Router.register('/guide', renderGuide);
Router.register('/menu', renderMenu);
Router.register('/achievements', renderAchievements);
Router.register('/wheel', renderWheel);

// ── Theme Init (default: dark) ──
const savedTheme = DataService.getTheme();
document.documentElement.setAttribute('data-theme', savedTheme);

// ── PWA Install Prompt ──
window._pwaInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window._pwaInstallPrompt = e;
});

Router.init();
