const Hero3D = {
  scene: null,
  camera: null,
  renderer: null,
  particles: null,
  animationId: null,
  mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
  clock: null,
  initialized: false,

  init() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') {
      console.warn('Hero3D: Canvas or Three.js not found');
      return;
    }

    if (this.initialized) this.destroy();

    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 1, 2000);
    this.camera.position.z = 500;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.createParticleGlobe();
    this.createAmbientParticles();

    this._onMouseMove = (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    this._onResize = () => this.onResize();

    window.addEventListener('mousemove', this._onMouseMove, { passive: true });
    window.addEventListener('resize', this._onResize, { passive: true });

    this.animate();
    this.initialized = true;
  },

  createParticleGlobe() {
    const count = 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    const radius = 200;
    const emerald = new THREE.Color(0x10b981);
    const cyan = new THREE.Color(0x06b6d4);
    const white = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      // fibonacci sphere for even distribution
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const r = radius * (0.85 + Math.random() * 0.3);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const colorChoice = Math.random();
      let color;
      if (colorChoice < 0.4) {
        color = emerald.clone().lerp(white, Math.random() * 0.5);
      } else if (colorChoice < 0.7) {
        color = cyan.clone().lerp(white, Math.random() * 0.4);
      } else {
        color = white.clone();
        color.multiplyScalar(0.5 + Math.random() * 0.5);
      }
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = 1.5 + Math.random() * 3;
      phases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute float phase;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          float pulse = sin(uTime * 0.5 + phase) * 0.3 + 0.7;
          vAlpha = pulse;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * pulse * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, dist) * vAlpha * 0.8;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    this.particles = new THREE.Points(geometry, material);
    this.particles.position.x = 120;
    this.particles.position.y = -20;
    this.scene.add(this.particles);
  },

  createAmbientParticles() {
    const count = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 1.5,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.ambientParticles = new THREE.Points(geometry, material);
    this.scene.add(this.ambientParticles);
  },

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    const elapsed = this.clock.getElapsedTime();

    // Smooth mouse follow
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Rotate globe
    if (this.particles) {
      this.particles.rotation.y = elapsed * 0.08 + this.mouse.x * 0.3;
      this.particles.rotation.x = this.mouse.y * 0.2 + Math.sin(elapsed * 0.1) * 0.05;
      this.particles.material.uniforms.uTime.value = elapsed;
    }

    // Ambient particles drift
    if (this.ambientParticles) {
      this.ambientParticles.rotation.y = elapsed * 0.01;
      this.ambientParticles.rotation.x = elapsed * 0.005;
    }

    // Camera parallax
    this.camera.position.x += (this.mouse.x * 30 - this.camera.position.x) * 0.03;
    this.camera.position.y += (-this.mouse.y * 20 - this.camera.position.y) * 0.03;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  },

  onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  },

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('resize', this._onResize);

    if (this.particles) {
      this.particles.geometry.dispose();
      this.particles.material.dispose();
      this.scene.remove(this.particles);
    }

    if (this.ambientParticles) {
      this.ambientParticles.geometry.dispose();
      this.ambientParticles.material.dispose();
      this.scene.remove(this.ambientParticles);
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.ambientParticles = null;
    this.initialized = false;
  }
};
