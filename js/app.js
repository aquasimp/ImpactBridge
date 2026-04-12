/* ============================================================
   ImpactBridge — Main Application Controller
   SPA Router + Global State + UI Utilities
   ============================================================ */

const ImpactBridge = {
  currentView: 'home',
  
  // Module references
  needs: NeedsManager,
  volunteer: VolunteerManager,
  gemini: GeminiAI,
  dashboard: Dashboard,
  analytics: Analytics,
  map: MapModule,
  tracker: LocationTracker,

  // ---- Initialize Everything ----
  init() {
    console.log('%c🌍 ImpactBridge', 'font-size:20px;font-weight:bold;background:linear-gradient(135deg,#10b981,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent');
    console.log('%cSmart Resource Allocation for Social Impact', 'font-size:12px;color:#94a3b8');
    console.log('%cGoogle Solution Challenge 2026', 'font-size:11px;color:#64748b');

    // Initialize Firebase
    FirebaseConfig.init();

    // Initialize Auth
    Auth.init();

    // Initialize Data Modules
    NeedsManager.init();
    VolunteerManager.init();
    ActivityLog.init();

    // Setup Router
    this.setupRouter();

    // Setup Navbar
    this.setupNavbar();

    // Initialize UI features
    Utils.initScrollReveals();
    Utils.initRippleEffects();

    // Initialize custom cursor
    CustomCursor.init();

    // Route to initial view
    this.handleRoute();

    // Show demo mode toast
    setTimeout(() => {
      this.ui.showToast('info', '🎮 Demo Mode Active', 'Running with sample data. Add API keys for live mode.');
    }, 1500);

    console.log('✅ ImpactBridge initialized successfully');
  },

  // ---- SPA Router ----
  setupRouter() {
    window.addEventListener('hashchange', () => this.handleRoute());
  },

  handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    this.navigateTo(hash);
  },

  navigateTo(view) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => {
      v.classList.remove('active');
    });

    // Show target view
    const targetView = document.getElementById(`view-${view}`);
    if (targetView) {
      targetView.classList.add('active');
      this.currentView = view;
    } else {
      // Fallback to home
      document.getElementById('view-home').classList.add('active');
      this.currentView = 'home';
    }

    // Update nav
    this.updateNavState(this.currentView);

    // Render view content
    this.renderView(this.currentView);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderView(view) {
    // Cleanup immersive modules when leaving landing
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
        // Small delay to ensure container is visible before rendering canvas
        setTimeout(() => MapModule.init(), 100);
        break;
      case 'analytics':
        Analytics.render();
        break;
      case 'tracker':
        // Small delay to ensure container is visible before rendering map
        setTimeout(() => LocationTracker.init(), 100);
        break;
      case 'home':
        // Initialize immersive landing experience
        setTimeout(() => {
          Hero3D.init();
          ScrollAnimations.init();
        }, 100);
        break;
    }
  },

  // ---- Navigation State ----
  setupNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('nav-links');
    const navToggle = document.getElementById('nav-toggle');
    const getStartedBtn = document.getElementById('nav-get-started');

    // Scroll behavior — update both classic navbar and AT navbar
    window.addEventListener('scroll', Utils.throttle(() => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, 100));

    // Mobile toggle
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });
    }

    // Nav link clicks
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

    // Show/hide nav elements based on view
    if (isApp) {
      navLinks.style.display = '';
      getStartedBtn?.classList.add('hidden');
    } else {
      // On home page, show get started button, hide app nav
      navLinks.style.display = 'none';
      getStartedBtn?.classList.remove('hidden');
    }

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkView = link.dataset.view;
      link.classList.toggle('active', linkView === view);
    });
  },

  // ---- UI Utilities ----
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

      // Auto dismiss
      setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    },

    openModal(id) {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Close on overlay click
        modal.addEventListener('click', (e) => {
          if (e.target === modal) this.closeModal(id);
        });
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

// ---- Boot ----
document.addEventListener('DOMContentLoaded', () => {
  ImpactBridge.init();
});
