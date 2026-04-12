
const Utils = {

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  formatTime(date) {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  timeAgo(date) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 }
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  },


  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString('en-IN');
  },

  formatCompact(num) {
    return new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(num);
  },


  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  },

  randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },


  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },


  $(selector) {
    return document.querySelector(selector);
  },

  $$(selector) {
    return document.querySelectorAll(selector);
  },

  createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, val]) => {
      if (key === 'className') el.className = val;
      else if (key === 'innerHTML') el.innerHTML = val;
      else if (key === 'textContent') el.textContent = val;
      else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
      else if (key === 'style' && typeof val === 'object') {
        Object.assign(el.style, val);
      }
      else el.setAttribute(key, val);
    });
    children.forEach(child => {
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else if (child) el.appendChild(child);
    });
    return el;
  },


  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },


  throttle(fn, limit = 100) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },


  animateCounter(element, target, duration = 2000, suffix = '') {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      
      element.textContent = Utils.formatNumber(current) + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  },


  initScrollReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // If it's a counter, animate it
          if (entry.target.querySelector('.counter-animate')) {
            entry.target.querySelectorAll('.counter-animate').forEach(counter => {
              if (!counter.dataset.animated) {
                counter.dataset.animated = 'true';
                const target = parseInt(counter.dataset.target);
                const suffix = counter.dataset.suffix || '';
                Utils.animateCounter(counter, target, 2000, suffix);
              }
            });
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    // Also observe hero stats directly
    document.querySelectorAll('.counter-animate').forEach(el => {
      const wrapper = el.closest('.reveal') || el;
      observer.observe(wrapper);
    });
  },


  generateParticles(container, count = 30) {
    const containerEl = typeof container === 'string' ? document.querySelector(container) : container;
    if (!containerEl) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
      particle.style.setProperty('--ty', `${-Math.random() * 300 - 100}px`);
      particle.style.setProperty('--duration', `${3 + Math.random() * 5}s`);
      particle.style.setProperty('--delay', `${Math.random() * 5}s`);
      particle.style.width = `${2 + Math.random() * 4}px`;
      particle.style.height = particle.style.width;
      particle.style.background = Utils.randomFrom([
        'var(--primary-400)', 'var(--cyan-400)', 'var(--accent-400)'
      ]);
      containerEl.appendChild(particle);
    }
  },


  initRippleEffects() {
    document.querySelectorAll('.ripple-effect').forEach(el => {
      el.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  },


  getChartDefaults() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: '#94a3b8',
            font: { family: "'Inter', sans-serif", size: 12 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#f8fafc',
          bodyColor: '#94a3b8',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          cornerRadius: 12,
          padding: 12,
          titleFont: { family: "'Inter', sans-serif", weight: 600 },
          bodyFont: { family: "'Inter', sans-serif" }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: { color: '#64748b', font: { family: "'Inter', sans-serif", size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: { color: '#64748b', font: { family: "'Inter', sans-serif", size: 11 } }
        }
      }
    };
  },


  createChartGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  },


  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },


  saveToStorage(key, data) {
    try {
      localStorage.setItem(`impactbridge_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  loadFromStorage(key) {
    try {
      const data = localStorage.getItem(`impactbridge_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },


  categoryColors: {
    healthcare: { bg: 'rgba(239,68,68,0.12)', text: '#f87171', icon: '🏥' },
    education: { bg: 'rgba(139,92,246,0.12)', text: '#a78bfa', icon: '📚' },
    disaster: { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24', icon: '🌊' },
    environment: { bg: 'rgba(16,185,129,0.12)', text: '#34d399', icon: '🌱' },
    shelter: { bg: 'rgba(6,182,212,0.12)', text: '#22d3ee', icon: '🏠' },
    food: { bg: 'rgba(251,146,60,0.12)', text: '#fb923c', icon: '🍚' },
    livelihood: { bg: 'rgba(168,85,247,0.12)', text: '#c084fc', icon: '💼' }
  },

  priorityConfig: {
    critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: '🔴' },
    high: { label: 'High', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: '🟠' },
    medium: { label: 'Medium', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', icon: '🔵' },
    low: { label: 'Low', color: '#10b981', bg: 'rgba(16,185,129,0.12)', icon: '🟢' }
  },

  availabilityLabels: {
    fulltime: 'Full Time',
    parttime: 'Part Time',
    weekends: 'Weekends Only',
    oncall: 'On Call'
  }
};
