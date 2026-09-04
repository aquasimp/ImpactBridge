const ImpactBridge = {
  currentView: 'home',

  needs: NeedsManager,
  volunteer: VolunteerManager,
  gemini: GeminiAI,
  dashboard: Dashboard,
  analytics: Analytics,
  map: MapModule,
  tracker: LocationTracker,

  init() {
    console.log('%c🌍 ImpactBridge', 'font-size:20px;font-weight:bold;background:linear-gradient(135deg,#10b981,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent');
    console.log('%cSmart Resource Allocation for Social Impact', 'font-size:12px;color:#94a3b8');
    console.log('%cGoogle Solution Challenge 2026', 'font-size:11px;color:#64748b');

    FirebaseConfig.init();
    Auth.init();
    NeedsManager.init();
    VolunteerManager.init();
    ActivityLog.init();
    this.setupRouter();
    this.setupNavbar();
    Utils.initScrollReveals();
    Utils.initRippleEffects();
    CustomCursor.init();
    this.handleRoute();

    setTimeout(() => {
      this.ui.showToast('info', '🎮 Demo Mode Active', 'Running with sample data. Add API keys for live mode.');
    }, 1500);

    console.log('✅ ImpactBridge initialized successfully');
  },

  setupRouter() {
    window.addEventListener('hashchange', () => this.handleRoute());
  },

  handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    this.navigateTo(hash);
  },

  navigateTo(view) {
    document.querySelectorAll('.view').forEach(v => {
      v.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${view}`);
    if (targetView) {
      targetView.classList.add('active');
      this.currentView = view;
    } else {
      document.getElementById('view-home').classList.add('active');
      this.currentView = 'home';
    }

    this.updateNavState(this.currentView);
    this.renderView(this.currentView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderView(view) {
    if (view !== 'home') {
      Hero3D.destroy();
      ScrollAnimations.destroy();
    }

    switch (view) {
      case 'dashboard':
        Dashboard.render();
        break;
      case 'needs':
        NeedsManager.renderNeedsGrid();
        break;
      case 'volunteers':
        VolunteerManager.renderVolunteersGrid();
        break;
      case 'map':
        setTimeout(() => MapModule.init(), 100);
        break;
      case 'analytics':
        Analytics.render();
        break;
      case 'tracker':
        setTimeout(() => LocationTracker.init(), 100);
        break;
      case 'home':
        setTimeout(() => {
          Hero3D.init();
          ScrollAnimations.init();
        }, 100);
        break;
    }
  },

  setupNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('nav-links');
    const navToggle = document.getElementById('nav-toggle');
    const getStartedBtn = document.getElementById('nav-get-started');

    window.addEventListener('scroll', Utils.throttle(() => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, 100));

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        navLinks.classList.remove('open');
      });
    });
  },

  updateNavState(view) {
    const isApp = view !== 'home';
    const navLinks = document.getElementById('nav-links');
    const getStartedBtn = document.getElementById('nav-get-started');

    if (isApp) {
      navLinks.style.display = '';
      getStartedBtn?.classList.add('hidden');
    } else {
      navLinks.style.display = 'none';
      getStartedBtn?.classList.remove('hidden');
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      const linkView = link.dataset.view;
      link.classList.toggle('active', linkView === view);
    });
  },

  ui: {
    showToast(type, title, message) {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      };

      toast.innerHTML = `
        <div class="toast-icon">${icons[type] || 'ℹ️'}</div>
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          ${message ? `<div class="toast-message">${message}</div>` : ''}
        </div>
      `;

      container.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    },

    openModal(id) {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('role', 'dialog');
        document.body.style.overflow = 'hidden';
        modal.addEventListener('click', (e) => {
          if (e.target === modal) this.closeModal(id);
        });
        const handleKeyDown = (e) => {
          if (e.key === 'Escape') {
            this.closeModal(id);
            document.removeEventListener('keydown', handleKeyDown);
          }
        };
        document.addEventListener('keydown', handleKeyDown);
      }
    },

    closeModal(id) {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ImpactBridge.init();
});
