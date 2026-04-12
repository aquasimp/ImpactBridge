const ScrollAnimations = {
  triggers: [],
  initialized: false,

  init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('ScrollAnimations: GSAP or ScrollTrigger not loaded');
      return;
    }

    if (this.initialized) this.destroy();

    gsap.registerPlugin(ScrollTrigger);

    // Set default ease
    gsap.defaults({ ease: 'power3.out' });

    this.animateHero();
    this.animateAbout();
    this.animateFeatures();
    this.animateImpact();
    this.animateTechStack();
    this.animateCTA();

    this.initialized = true;
  },

  animateHero() {
    // Hero badge entrance
    gsap.fromTo('#at-hero-badge',
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, delay: 0.3 }
    );

    // Hero title lines stagger entrance
    gsap.fromTo('.at-hero-line',
      { opacity: 0, y: 80, skewY: 3 },
      { opacity: 1, y: 0, skewY: 0, duration: 1.2, stagger: 0.15, delay: 0.5 }
    );

    // Hero description
    gsap.fromTo('#at-hero-desc',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 1.2 }
    );

    // Hero CTA buttons
    gsap.fromTo('.at-hero-cta a',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 1.5 }
    );

    // Hero stats
    gsap.fromTo('.at-hero-stat',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 1.8 }
    );

    // Scroll indicator
    gsap.fromTo('#at-scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 2.5 }
    );

    // Parallax: hero text moves up on scroll
    gsap.to('.at-hero-content', {
      y: -150,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#at-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  },

  animateAbout() {
    // About section title
    gsap.fromTo('#at-about .at-section-label',
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.8,
        scrollTrigger: {
          trigger: '#at-about',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('#at-about .at-section-title',
      { opacity: 0, y: 60, clipPath: 'inset(100% 0 0 0)' },
      {
        opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1,
        scrollTrigger: {
          trigger: '#at-about',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('#at-about .at-about-text',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, delay: 0.2,
        scrollTrigger: {
          trigger: '#at-about',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  },

  animateFeatures() {
    // Section header
    gsap.fromTo('#at-features .at-section-label',
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.8,
        scrollTrigger: {
          trigger: '#at-features',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('#at-features .at-section-title',
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0, duration: 1,
        scrollTrigger: {
          trigger: '#at-features',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Feature cards stagger
    gsap.fromTo('.feature-card-at',
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.12,
        scrollTrigger: {
          trigger: '.at-features-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  },

  animateImpact() {
    gsap.fromTo('#at-impact .at-section-label',
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.8,
        scrollTrigger: {
          trigger: '#at-impact',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Impact numbers count up
    const counters = document.querySelectorAll('.at-impact-number');
    counters.forEach(el => {
      const target = parseInt(el.dataset.target) || 0;
      const suffix = el.dataset.suffix || '';
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toLocaleString() + suffix;
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    gsap.fromTo('.at-impact-card',
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1,
        scrollTrigger: {
          trigger: '#at-impact',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  },

  animateTechStack() {
    gsap.fromTo('.at-tech-item',
      { opacity: 0, y: 30, scale: 0.9 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08,
        scrollTrigger: {
          trigger: '#at-tech',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  },

  animateCTA() {
    gsap.fromTo('#at-cta .at-cta-title',
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1, duration: 1,
        scrollTrigger: {
          trigger: '#at-cta',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('#at-cta .at-cta-desc',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.8, delay: 0.2,
        scrollTrigger: {
          trigger: '#at-cta',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('#at-cta .btn-at-primary',
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.8, delay: 0.4,
        scrollTrigger: {
          trigger: '#at-cta',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  },

  destroy() {
    ScrollTrigger.getAll().forEach(t => t.kill());
    this.initialized = false;
  }
};
