// ══════════════════════════════════════════
// ROUTER — Hash-based SPA router
// ══════════════════════════════════════════

const routes = {};
let currentRoute = null;
let beforeEachGuard = null;

export const Router = {
  register(path, handler) {
    routes[path] = handler;
  },

  beforeEach(guard) {
    beforeEachGuard = guard;
  },

  navigate(path) {
    window.location.hash = path;
  },

  async resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, queryStr] = hash.split('?');
    const params = {};
    if (queryStr) {
      queryStr.split('&').forEach(p => {
        const [k, v] = p.split('=');
        params[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }

    // Match route (supports :param patterns)
    let handler = null;
    let routeParams = {};
    for (const [pattern, h] of Object.entries(routes)) {
      const patternParts = pattern.split('/');
      const pathParts = path.split('/');
      if (patternParts.length !== pathParts.length) continue;
      let match = true;
      const p = {};
      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
          p[patternParts[i].slice(1)] = pathParts[i];
        } else if (patternParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }
      if (match) { handler = h; routeParams = p; break; }
    }

    if (!handler) {
      handler = routes['/'] || routes['/login'];
    }

    if (beforeEachGuard) {
      const redirect = await beforeEachGuard(path);
      if (redirect && redirect !== path) {
        this.navigate(redirect);
        return;
      }
    }

    currentRoute = path;
    const app = document.getElementById('app');
    if (handler) {
      app.innerHTML = '';
      const content = await handler({ ...params, ...routeParams });
      if (typeof content === 'string') {
        app.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        app.appendChild(content);
      }
    }
  },

  getCurrentRoute() { return currentRoute; },

  init() {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  }
};
