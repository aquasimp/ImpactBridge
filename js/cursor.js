
const CustomCursor = {
  dot: null,
  ring: null,
  pos: { x: 0, y: 0 },
  target: { x: 0, y: 0 },
  visible: false,
  hovering: false,
  animationId: null,
  initialized: false,

  init() {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    if (this.initialized) return;

    // Create cursor elements
    this.dot = document.createElement('div');
    this.dot.className = 'cursor-dot';
    document.body.appendChild(this.dot);

    this.ring = document.createElement('div');
    this.ring.className = 'cursor-ring';
    document.body.appendChild(this.ring);

    // Event listeners
    this._onMouseMove = (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;

      if (!this.visible) {
        this.visible = true;
        this.pos.x = e.clientX;
        this.pos.y = e.clientY;
        this.dot.style.opacity = '1';
        this.ring.style.opacity = '1';
      }
    };

    this._onMouseDown = () => {
      this.ring.classList.add('cursor-click');
      setTimeout(() => this.ring.classList.remove('cursor-click'), 300);
    };

    this._onMouseLeave = () => {
      this.dot.style.opacity = '0';
      this.ring.style.opacity = '0';
      this.visible = false;
    };

    this._onMouseEnter = () => {
      if (this.visible) {
        this.dot.style.opacity = '1';
        this.ring.style.opacity = '1';
      }
    };

    document.addEventListener('mousemove', this._onMouseMove, { passive: true });
    document.addEventListener('mousedown', this._onMouseDown);
    document.addEventListener('mouseleave', this._onMouseLeave);
    document.addEventListener('mouseenter', this._onMouseEnter);

    // Setup interactive element detection
    this.setupInteractives();

    // Start render loop
    this.render();
    this.initialized = true;

    // Add cursor-active class to body to hide default cursor
    document.body.classList.add('cursor-active');
  },

  setupInteractives() {
    // Use event delegation for interactive elements
    document.addEventListener('mouseover', (e) => {
      const interactive = e.target.closest('a, button, .btn, .nav-link, .feature-card-at, .glass-card, input, select, textarea, .filter-chip, .tab-btn');
      if (interactive) {
        this.hovering = true;
        this.ring.classList.add('cursor-hover');
        this.dot.classList.add('cursor-hover');
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      const interactive = e.target.closest('a, button, .btn, .nav-link, .feature-card-at, .glass-card, input, select, textarea, .filter-chip, .tab-btn');
      if (interactive) {
        this.hovering = false;
        this.ring.classList.remove('cursor-hover');
        this.dot.classList.remove('cursor-hover');
      }
    }, { passive: true });
  },

  render() {
    this.animationId = requestAnimationFrame(() => this.render());

    // Smooth follow for ring (lag behind)
    this.pos.x += (this.target.x - this.pos.x) * 0.15;
    this.pos.y += (this.target.y - this.pos.y) * 0.15;

    // Dot follows instantly
    this.dot.style.transform = `translate(${this.target.x}px, ${this.target.y}px)`;
    // Ring follows with lag
    this.ring.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px)`;
  },

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mousedown', this._onMouseDown);
    document.removeEventListener('mouseleave', this._onMouseLeave);
    document.removeEventListener('mouseenter', this._onMouseEnter);

    if (this.dot) this.dot.remove();
    if (this.ring) this.ring.remove();

    document.body.classList.remove('cursor-active');
    this.initialized = false;
  }
};
