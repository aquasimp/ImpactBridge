const MapModule = {
  map: null,
  needMarkers: [],
  volunteerMarkers: [],
  heatLayer: null,
  markersLayerGroup: null,
  volunteerLayerGroup: null,
  heatmapVisible: false,
  initialized: false,

  init() {

    if (this.map) {
      this.map.remove();
      this.map = null;
      this.initialized = false;
    }

    this.renderLeafletMap();
    this.renderMapStats();
    this.renderNearbyNeeds();
    this.setupMapControls();
  },

  renderLeafletMap() {
    const container = document.getElementById('map-canvas');
    if (!container) return;

    container.innerHTML = '';
    container.style.display = 'block';

    const legend = document.getElementById('map-legend');
    if (legend) legend.style.display = 'block';

    this.map = L.map(container, {
      center: [22.5, 80.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false, // we'll add custom position
      attributionControl: true
    });

    L.control.zoom({ position: 'topright' }).addTo(this.map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);

    this.markersLayerGroup = L.layerGroup().addTo(this.map);
    this.volunteerLayerGroup = L.layerGroup().addTo(this.map);

    this.addNeedMarkers();

    this.addVolunteerMarkers();

    this.prepareHeatmap();

    this.initialized = true;
  },

  createNeedIcon(priority) {
    const colors = {
      critical: '#ef4444',
      high: '#f59e0b',
      medium: '#06b6d4',
      low: '#10b981'
    };
    const color = colors[priority] || colors.medium;
    const pulseClass = priority === 'critical' ? 'map-pin-critical' : '';

    return L.divIcon({
      className: `custom-map-pin ${pulseClass}`,
      html: `
        <div style="position:relative;width:32px;height:42px">
          <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 26 16 26s16-14 16-26C32 7.164 24.836 0 16 0z" fill="${color}"/>
            <circle cx="16" cy="16" r="8" fill="#0a0f1e"/>
            <circle cx="16" cy="16" r="4" fill="${color}"/>
          </svg>
          ${priority === 'critical' ? `<div class="pin-pulse-ring" style="border-color:${color}"></div>` : ''}
        </div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -44]
    });
  },

  createVolunteerIcon(status) {
    const color = status === 'deployed' ? '#fbbf24' : '#10b981';
    return L.divIcon({
      className: 'custom-vol-pin',
      html: `
        <div style="width:16px;height:16px;border-radius:50%;background:${color};border:3px solid #0a0f1e;box-shadow:0 0 12px ${color}60"></div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -12]
    });
  },

  addNeedMarkers() {
    const needs = NeedsManager.getAllNeeds();

    needs.forEach(need => {
      if (!need.lat || !need.lng) return;

      const icon = this.createNeedIcon(need.priority);
      const cat = Utils.categoryColors[need.category] || { icon: '📋' };
      const pri = Utils.priorityConfig[need.priority];
      const progress = need.volunteersNeeded > 0
        ? Math.round((need.volunteersAssigned / need.volunteersNeeded) * 100)
        : 0;

      const marker = L.marker([need.lat, need.lng], { icon })
        .bindPopup(`
          <div style="font-family:'Inter',sans-serif;min-width:260px;max-width:320px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#94a3b8;font-weight:600">${cat.icon} ${need.category}</span>
              <span style="font-size:10px;padding:2px 8px;border-radius:999px;background:${pri.bg || 'rgba(6,182,212,0.12)'};color:${pri.color};font-weight:600">${pri.label}</span>
            </div>
            <div style="font-size:14px;font-weight:700;margin-bottom:6px;color:#f8fafc;line-height:1.3">${need.title}</div>
            <div style="font-size:12px;color:#94a3b8;margin-bottom:10px;line-height:1.5">${need.description.substring(0, 120)}${need.description.length > 120 ? '...' : ''}</div>
            <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#64748b;margin-bottom:8px">
              📍 ${need.location}
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:#64748b;margin-bottom:4px">
              <span>Volunteers: ${need.volunteersAssigned}/${need.volunteersNeeded}</span>
              <span style="color:#10b981;font-weight:600">${progress}%</span>
            </div>
            <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:999px;overflow:hidden;margin-bottom:10px">
              <div style="width:${progress}%;height:100%;background:linear-gradient(90deg,#10b981,#06b6d4);border-radius:999px"></div>
            </div>
            <div style="display:flex;gap:12px;font-size:11px;color:#64748b">
              <span>👥 ${Utils.formatNumber(need.affected)} affected</span>
              <span>🕐 ${Utils.timeAgo(need.createdAt)}</span>
            </div>
          </div>
        `, {
          className: 'dark-popup',
          maxWidth: 340
        });

      this.markersLayerGroup.addLayer(marker);
      this.needMarkers.push(marker);
    });
  },

  addVolunteerMarkers() {
    const volunteers = VolunteerManager.getAll();

    volunteers.forEach(vol => {
      if (!vol.lat || !vol.lng) return;

      const icon = this.createVolunteerIcon(vol.status);
      const statusText = vol.status === 'deployed'
        ? `<span style="color:#fbbf24">🔄 Deployed: ${vol.currentMission || 'Active mission'}</span>`
        : '<span style="color:#10b981">✅ Available</span>';

      const marker = L.marker([vol.lat, vol.lng], { icon })
        .bindPopup(`
          <div style="font-family:'Inter',sans-serif;min-width:220px">
            <div style="font-size:14px;font-weight:700;margin-bottom:4px;color:#f8fafc">${vol.name}</div>
            <div style="font-size:11px;color:#64748b;margin-bottom:8px">📍 ${vol.location}</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">
              ${vol.skills.slice(0, 4).map(s => `<span style="font-size:10px;padding:2px 6px;border-radius:999px;background:rgba(139,92,246,0.12);color:#a78bfa;font-weight:600">${s}</span>`).join('')}
            </div>
            <div style="font-size:11px;margin-bottom:6px">${statusText}</div>
            <div style="display:flex;gap:10px;font-size:11px;color:#64748b">
              <span>⏱️ ${vol.hoursContributed}h</span>
              <span>✅ ${vol.missionsCompleted} missions</span>
              <span>⭐ ${vol.rating}</span>
            </div>
          </div>
        `, {
          className: 'dark-popup',
          maxWidth: 300
        });

      this.volunteerLayerGroup.addLayer(marker);
      this.volunteerMarkers.push(marker);
    });
  },

  prepareHeatmap() {
    const needs = NeedsManager.getAllNeeds();
    const heatData = [];

    needs.forEach(need => {
      if (!need.lat || !need.lng) return;

      const priorityWeight = { critical: 1.0, high: 0.7, medium: 0.4, low: 0.2 };
      const weight = (priorityWeight[need.priority] || 0.3) * Math.min(need.affected / 1000, 3);

      heatData.push([need.lat, need.lng, weight]);

      if (need.priority === 'critical' || need.priority === 'high') {
        for (let i = 0; i < 5; i++) {
          heatData.push([
            need.lat + (Math.random() - 0.5) * 0.8,
            need.lng + (Math.random() - 0.5) * 0.8,
            weight * 0.4
          ]);
        }
      }
    });

    this.heatLayer = L.heatLayer(heatData, {
      radius: 35,
      blur: 25,
      maxZoom: 10,
      max: 3,
      gradient: {
        0.0: '#10b98100',
        0.2: '#10b98140',
        0.4: '#06b6d480',
        0.6: '#f59e0b90',
        0.8: '#ef4444b0',
        1.0: '#ef4444'
      }
    });
  },

  toggleHeatmap() {
    this.heatmapVisible = !this.heatmapVisible;

    if (this.heatmapVisible) {
      this.heatLayer.addTo(this.map);
    } else {
      this.map.removeLayer(this.heatLayer);
    }
  },

  renderMapStats() {
    const container = document.getElementById('map-stats');
    if (!container) return;

    const needStats = NeedsManager.getStats();
    const volStats = VolunteerManager.getStats();
    const coverage = Math.round((volStats.deployed / Math.max(needStats.critical, 1)) * 100);

    container.innerHTML = `
      <div>
        <div class="flex-between" style="margin-bottom:6px">
          <span style="font-size:var(--text-sm);color:var(--text-secondary)">Volunteer Coverage</span>
          <span style="font-size:var(--text-sm);font-weight:600;color:var(--primary-400)">${Math.min(coverage, 100)}%</span>
        </div>
        <div class="progress-bar"><div class="progress-bar-fill" style="width:${Math.min(coverage, 100)}%"></div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">
        <div class="glass-card no-hover" style="padding:12px;text-align:center">
          <div style="font-size:var(--text-2xl);font-weight:700;color:var(--red-400)">${needStats.critical}</div>
          <div style="font-size:10px;color:var(--text-tertiary)">Critical Needs</div>
        </div>
        <div class="glass-card no-hover" style="padding:12px;text-align:center">
          <div style="font-size:var(--text-2xl);font-weight:700;color:var(--primary-400)">${volStats.available}</div>
          <div style="font-size:10px;color:var(--text-tertiary)">Available Volunteers</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">
        <div class="glass-card no-hover" style="padding:12px;text-align:center">
          <div style="font-size:var(--text-2xl);font-weight:700;color:var(--amber-400)">${needStats.total}</div>
          <div style="font-size:10px;color:var(--text-tertiary)">Total Needs</div>
        </div>
        <div class="glass-card no-hover" style="padding:12px;text-align:center">
          <div style="font-size:var(--text-2xl);font-weight:700;color:var(--cyan-400)">12</div>
          <div style="font-size:10px;color:var(--text-tertiary)">States Covered</div>
        </div>
      </div>
    `;
  },

  renderNearbyNeeds() {
    const container = document.getElementById('nearby-needs');
    if (!container) return;

    const needs = NeedsManager.getUrgentNeeds(4);
    container.innerHTML = needs.map(need => {
      const pri = Utils.priorityConfig[need.priority];
      const cat = Utils.categoryColors[need.category] || { icon: '📋' };
      return `
        <div class="glass-card no-hover" style="padding:10px;cursor:pointer" onclick="MapModule.flyToNeed('${need.id}')">
          <div class="flex-between" style="margin-bottom:4px">
            <span style="font-size:11px;font-weight:600">${cat.icon} ${need.title.substring(0, 35)}...</span>
            <span style="font-size:10px;color:${pri.color}">${pri.icon}</span>
          </div>
          <div style="font-size:10px;color:var(--text-tertiary);display:flex;align-items:center;gap:4px">
            📍 ${need.location}
            <span style="margin-left:auto;color:${pri.color}">${Utils.formatNumber(need.affected)}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  flyToNeed(needId) {
    const need = NeedsManager.getNeedById(needId);
    if (!need || !need.lat || !need.lng || !this.map) return;

    this.map.flyTo([need.lat, need.lng], 10, { duration: 1.5 });

    this.needMarkers.forEach(marker => {
      const latlng = marker.getLatLng();
      if (Math.abs(latlng.lat - need.lat) < 0.01 && Math.abs(latlng.lng - need.lng) < 0.01) {
        setTimeout(() => marker.openPopup(), 1600);
      }
    });
  },

  setupMapControls() {
    const heatmapBtn = document.getElementById('map-toggle-heatmap');
    if (heatmapBtn) {

      const newBtn = heatmapBtn.cloneNode(true);
      heatmapBtn.parentNode.replaceChild(newBtn, heatmapBtn);

      newBtn.addEventListener('click', () => {
        this.toggleHeatmap();
        newBtn.classList.toggle('btn-primary', this.heatmapVisible);
        newBtn.classList.toggle('btn-secondary', !this.heatmapVisible);
        ImpactBridge.ui.showToast('info', 'Heatmap', this.heatmapVisible ? 'Need density heatmap enabled' : 'Heatmap disabled');
      });
    }
  }
};
