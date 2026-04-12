
const LocationTracker = {
  map: null,
  initialized: false,
  watchId: null,
  updateInterval: null,


  myDevice: {
    id: 'my-device',
    name: 'My Device',
    lat: null,
    lng: null,
    accuracy: 0,
    speed: 0,
    altitude: null,
    heading: null,
    battery: 87,
    status: 'active',
    lastSeen: Date.now(),
    history: [],
    color: '#10b981'
  },

  trackedDevices: [],
  selectedDevice: null,
  historyPolylines: {},
  deviceMarkers: {},
  geofences: [],
  geofenceCircles: [],
  trackingActive: false,
  showHistory: true,
  mapStyle: 'dark',


  simulatedDevices: [
    {
      id: 'dev-001',
      name: 'Anurag\'s Phone',
      icon: '📱',
      lat: 28.6139,
      lng: 77.2090,
      accuracy: 8,
      speed: 0,
      altitude: 216,
      heading: 45,
      battery: 72,
      status: 'active',
      lastSeen: Date.now(),
      color: '#06b6d4',
      history: [],
      movement: { type: 'walk', radius: 0.008, speed: 0.0002 }
    },
    {
      id: 'dev-002',
      name: 'Field Team Alpha',
      icon: '🚐',
      lat: 28.5355,
      lng: 77.3910,
      accuracy: 12,
      speed: 35,
      altitude: 198,
      heading: 120,
      battery: 45,
      status: 'active',
      lastSeen: Date.now() - 120000,
      color: '#f59e0b',
      history: [],
      movement: { type: 'drive', radius: 0.03, speed: 0.001 }
    },
    {
      id: 'dev-003',
      name: 'Volunteer Unit B',
      icon: '🏥',
      lat: 28.4595,
      lng: 77.0266,
      accuracy: 5,
      speed: 0,
      altitude: 207,
      heading: 0,
      battery: 91,
      status: 'active',
      lastSeen: Date.now() - 30000,
      color: '#8b5cf6',
      history: [],
      movement: { type: 'stationary', radius: 0.002, speed: 0.00005 }
    },
    {
      id: 'dev-004',
      name: 'Supply Drone #7',
      icon: '🛸',
      lat: 28.7041,
      lng: 77.1025,
      accuracy: 2,
      speed: 60,
      altitude: 150,
      heading: 270,
      battery: 34,
      status: 'active',
      lastSeen: Date.now() - 5000,
      color: '#ef4444',
      history: [],
      movement: { type: 'fly', radius: 0.05, speed: 0.002 }
    },
    {
      id: 'dev-005',
      name: 'Rescue Boat',
      icon: '🚤',
      lat: 28.3670,
      lng: 77.3120,
      accuracy: 15,
      speed: 12,
      altitude: 0,
      heading: 180,
      battery: 58,
      status: 'inactive',
      lastSeen: Date.now() - 600000,
      color: '#22d3ee',
      history: [],
      movement: { type: 'boat', radius: 0.015, speed: 0.0006 }
    }
  ],


  init() {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.initialized = false;
    }


    this.deviceMarkers = {};
    this.historyPolylines = {};
    this.geofenceCircles = [];


    this.trackedDevices = JSON.parse(JSON.stringify(this.simulatedDevices));


    this.trackedDevices.forEach(d => this.generateFakeHistory(d));

    this.renderTrackerMap();
    this.renderDeviceList();
    this.renderTelemetryPanel();
    this.startRealTimeTracking();
    this.setupControls();

    this.initialized = true;
  },

  renderTrackerMap() {
    const container = document.getElementById('tracker-map-canvas');
    if (!container) return;
    container.innerHTML = '';


    const defaultCenter = [28.6139, 77.2090];

    this.map = L.map(container, {
      center: defaultCenter,
      zoom: 11,
      minZoom: 3,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: true
    });

    L.control.zoom({ position: 'topright' }).addTo(this.map);


    this.tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);


    this.trackedDevices.forEach(device => {
      this.addDeviceMarker(device);
      this.addDeviceHistory(device);
    });


    this.addDefaultGeofences();


    this.getUserLocation();
  },

  getUserLocation() {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.myDevice.lat = pos.coords.latitude;
        this.myDevice.lng = pos.coords.longitude;
        this.myDevice.accuracy = pos.coords.accuracy;
        this.myDevice.speed = pos.coords.speed || 0;
        this.myDevice.altitude = pos.coords.altitude;
        this.myDevice.heading = pos.coords.heading;
        this.myDevice.lastSeen = Date.now();
        this.myDevice.history.push({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: Date.now()
        });


        this.addMyDeviceMarker();


        this.map.flyTo([this.myDevice.lat, this.myDevice.lng], 13, { duration: 1.5 });

        ImpactBridge.ui.showToast('success', '📍 Location Acquired', `Accuracy: ${Math.round(this.myDevice.accuracy)}m`);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        ImpactBridge.ui.showToast('info', '📍 Location Access', 'Using simulated location data for demo');
        // Use Delhi as fallback
        this.myDevice.lat = 28.6139 + (Math.random() - 0.5) * 0.05;
        this.myDevice.lng = 77.2090 + (Math.random() - 0.5) * 0.05;
        this.myDevice.accuracy = 50;
        this.myDevice.lastSeen = Date.now();
        this.addMyDeviceMarker();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );


    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        this.myDevice.lat = pos.coords.latitude;
        this.myDevice.lng = pos.coords.longitude;
        this.myDevice.accuracy = pos.coords.accuracy;
        this.myDevice.speed = pos.coords.speed || 0;
        this.myDevice.altitude = pos.coords.altitude;
        this.myDevice.heading = pos.coords.heading;
        this.myDevice.lastSeen = Date.now();
        this.myDevice.history.push({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: Date.now()
        });

        this.updateMyDeviceMarker();
        this.renderTelemetryPanel();
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
  },

  addMyDeviceMarker() {
    if (!this.myDevice.lat || !this.myDevice.lng) return;

    const icon = L.divIcon({
      className: 'tracker-my-device-pin',
      html: `
        <div class="tracker-device-marker my-device-marker">
          <div class="my-device-pulse-ring"></div>
          <div class="my-device-pulse-ring delay"></div>
          <div class="my-device-dot">
            <span class="material-symbols-outlined" style="font-size:16px;color:var(--bg-primary)">person_pin_circle</span>
          </div>
          <div class="my-device-accuracy" style="width:${Math.min(this.myDevice.accuracy * 2, 200)}px;height:${Math.min(this.myDevice.accuracy * 2, 200)}px"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    this.deviceMarkers['my-device'] = L.marker(
      [this.myDevice.lat, this.myDevice.lng],
      { icon, zIndexOffset: 1000 }
    ).addTo(this.map).bindPopup(this.createDevicePopup(this.myDevice, true), {
      className: 'dark-popup tracker-popup',
      maxWidth: 340
    });
  },

  updateMyDeviceMarker() {
    const marker = this.deviceMarkers['my-device'];
    if (marker && this.myDevice.lat) {
      marker.setLatLng([this.myDevice.lat, this.myDevice.lng]);
    }
  },

  addDeviceMarker(device) {
    const icon = L.divIcon({
      className: 'tracker-device-pin',
      html: `
        <div class="tracker-device-marker" style="--device-color:${device.color}">
          <div class="device-marker-outer">
            <div class="device-marker-inner">
              <span style="font-size:14px">${device.icon}</span>
            </div>
          </div>
          ${device.status === 'active' ? '<div class="device-status-dot active"></div>' : '<div class="device-status-dot inactive"></div>'}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });

    const marker = L.marker([device.lat, device.lng], { icon })
      .addTo(this.map)
      .bindPopup(this.createDevicePopup(device, false), {
        className: 'dark-popup tracker-popup',
        maxWidth: 340
      });

    marker.on('click', () => {
      this.selectDevice(device.id);
    });

    this.deviceMarkers[device.id] = marker;
  },

  createDevicePopup(device, isMyDevice) {
    const statusColor = device.status === 'active' ? '#10b981' : '#64748b';
    const statusLabel = device.status === 'active' ? 'Online' : 'Offline';
    const bat = Math.round(device.battery);
    const batteryColor = bat > 60 ? '#10b981' : bat > 25 ? '#f59e0b' : '#ef4444';
    const batteryIcon = bat > 75 ? 'battery_full' : bat > 50 ? 'battery_5_bar' : bat > 25 ? 'battery_3_bar' : 'battery_1_bar';
    const speed = device.speed ? Math.round(device.speed) : 0;
    const headingDir = this.getCompassDirection(device.heading);
    const signalBars = device.accuracy <= 5 ? 4 : device.accuracy <= 15 ? 3 : device.accuracy <= 30 ? 2 : 1;
    const signalColor = signalBars >= 3 ? '#10b981' : signalBars === 2 ? '#f59e0b' : '#ef4444';

    return `
      <div style="font-family:'Inter',sans-serif;min-width:300px;padding:4px">
        <!-- Header -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
          <div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,${device.color}30,${device.color}10);border:2px solid ${device.color}80;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 0 16px ${device.color}25">
            ${isMyDevice ? '📍' : device.icon}
          </div>
          <div style="flex:1">
            <div style="font-size:15px;font-weight:700;color:#f8fafc;letter-spacing:-0.01em">${device.name}</div>
            <div style="display:flex;align-items:center;gap:6px;margin-top:3px">
              <div style="width:7px;height:7px;border-radius:50%;background:${statusColor};box-shadow:0 0 6px ${statusColor}80"></div>
              <span style="font-size:11px;color:${statusColor};font-weight:600">${statusLabel}</span>
              <span style="font-size:10px;color:#475569">· ${Utils.timeAgo(device.lastSeen)}</span>
            </div>
          </div>
          <!-- Signal indicator -->
          <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
            <div style="display:flex;align-items:flex-end;gap:1.5px;height:14px">
              ${[1,2,3,4].map(i => `<div style="width:3px;height:${i * 3 + 2}px;border-radius:1px;background:${i <= signalBars ? signalColor : '#1e293b'};transition:background 0.3s"></div>`).join('')}
            </div>
            <span style="font-size:8px;color:${signalColor};font-weight:600">GPS</span>
          </div>
        </div>
        
        <!-- Stats Grid -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px">
          <div style="background:linear-gradient(135deg,rgba(34,211,238,0.06),rgba(34,211,238,0.02));border:1px solid rgba(34,211,238,0.1);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:9px;color:#64748b;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.06em;font-weight:600">Speed</div>
            <div style="font-size:18px;font-weight:800;color:#22d3ee;font-family:'Space Grotesk',sans-serif">${speed}<span style="font-size:10px;font-weight:600;color:#64748b;margin-left:2px">km/h</span></div>
          </div>
          <div style="background:linear-gradient(135deg,rgba(167,139,250,0.06),rgba(167,139,250,0.02));border:1px solid rgba(167,139,250,0.1);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:9px;color:#64748b;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.06em;font-weight:600">Altitude</div>
            <div style="font-size:18px;font-weight:800;color:#a78bfa;font-family:'Space Grotesk',sans-serif">${device.altitude != null ? Math.round(device.altitude) : '—'}<span style="font-size:10px;font-weight:600;color:#64748b;margin-left:2px">m</span></div>
          </div>
          <div style="background:linear-gradient(135deg,rgba(245,158,11,0.06),rgba(245,158,11,0.02));border:1px solid rgba(245,158,11,0.1);border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:9px;color:#64748b;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.06em;font-weight:600">Heading</div>
            <div style="font-size:18px;font-weight:800;color:#f59e0b;font-family:'Space Grotesk',sans-serif">${device.heading != null ? Math.round(device.heading) + '°' : '—'}<span style="font-size:10px;font-weight:600;color:#64748b;margin-left:2px">${headingDir}</span></div>
          </div>
          <div style="background:linear-gradient(135deg,${batteryColor}0d,${batteryColor}05);border:1px solid ${batteryColor}1a;border-radius:10px;padding:10px;text-align:center">
            <div style="font-size:9px;color:#64748b;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.06em;font-weight:600">Battery</div>
            <div style="display:flex;align-items:center;justify-content:center;gap:4px">
              <span class="material-symbols-outlined" style="font-size:16px;color:${batteryColor}">${batteryIcon}</span>
              <span style="font-size:18px;font-weight:800;color:${batteryColor};font-family:'Space Grotesk',sans-serif">${bat}%</span>
            </div>
            <div style="margin-top:6px;height:3px;background:rgba(255,255,255,0.06);border-radius:99px;overflow:hidden">
              <div style="width:${bat}%;height:100%;background:${batteryColor};border-radius:99px;transition:width 0.5s"></div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="display:flex;align-items:center;gap:8px;font-size:10px;color:#475569;border-top:1px solid rgba(255,255,255,0.06);padding-top:8px">
          <span style="font-family:'SF Mono','Fira Code',monospace;font-size:9px;background:rgba(255,255,255,0.04);padding:3px 6px;border-radius:4px">📍 ${device.lat ? device.lat.toFixed(5) : '—'}, ${device.lng ? device.lng.toFixed(5) : '—'}</span>
          <span style="margin-left:auto;font-family:'SF Mono','Fira Code',monospace;font-size:9px;background:rgba(255,255,255,0.04);padding:3px 6px;border-radius:4px">${device.id}</span>
        </div>
      </div>
    `;
  },

  getCompassDirection(heading) {
    if (heading == null) return '';
    const dirs = ['N','NE','E','SE','S','SW','W','NW'];
    return dirs[Math.round(heading / 45) % 8];
  },

  addDeviceHistory(device) {
    if (!device.history || device.history.length < 2) return;

    const latlngs = device.history.map(h => [h.lat, h.lng]);
    

    const polyline = L.polyline(latlngs, {
      color: device.color,
      weight: 3,
      opacity: 0.6,
      dashArray: '8, 6',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.map);

    this.historyPolylines[device.id] = polyline;
  },

  updateDeviceHistory(device) {
    if (this.historyPolylines[device.id]) {
      this.map.removeLayer(this.historyPolylines[device.id]);
    }

    if (this.showHistory && device.history.length >= 2) {
      const latlngs = device.history.map(h => [h.lat, h.lng]);
      this.historyPolylines[device.id] = L.polyline(latlngs, {
        color: device.color,
        weight: 3,
        opacity: 0.5,
        dashArray: '8, 6',
        lineCap: 'round'
      }).addTo(this.map);
    }
  },

  addDefaultGeofences() {
    const geofences = [
      { center: [28.6139, 77.2090], radius: 3000, name: 'HQ Zone', color: '#10b981' },
      { center: [28.5355, 77.3910], radius: 2000, name: 'Active Field Area', color: '#f59e0b' },
      { center: [28.4595, 77.0266], radius: 1500, name: 'Medical Camp', color: '#8b5cf6' }
    ];

    geofences.forEach(gf => {
      const circle = L.circle(gf.center, {
        radius: gf.radius,
        color: gf.color,
        fillColor: gf.color,
        fillOpacity: 0.06,
        weight: 2,
        opacity: 0.4,
        dashArray: '10, 8'
      }).addTo(this.map);

      circle.bindTooltip(gf.name, {
        permanent: false,
        direction: 'center',
        className: 'geofence-tooltip'
      });

      this.geofenceCircles.push(circle);
      this.geofences.push(gf);
    });
  },

  generateFakeHistory(device) {
    const points = 30 + Math.floor(Math.random() * 20);
    const history = [];
    let lat = device.lat;
    let lng = device.lng;

    for (let i = points; i >= 0; i--) {
      const angle = (i / points) * Math.PI * 2 * (1 + Math.random() * 0.5);
      lat = device.lat + Math.sin(angle) * device.movement.radius * (0.5 + Math.random() * 0.5);
      lng = device.lng + Math.cos(angle) * device.movement.radius * (0.5 + Math.random() * 0.5);
      
      history.push({
        lat,
        lng,
        timestamp: Date.now() - i * 60000 * (2 + Math.random())
      });
    }

    device.history = history;
    device.lat = history[history.length - 1].lat;
    device.lng = history[history.length - 1].lng;
  },

  startRealTimeTracking() {
    this.trackingActive = true;

    this.updateInterval = setInterval(() => {
      if (!this.trackingActive) return;

      this.trackedDevices.forEach(device => {
        if (device.status !== 'active') return;


        const angle = Math.random() * Math.PI * 2;
        const distance = device.movement.speed * (0.5 + Math.random());
        const newLat = device.lat + Math.sin(angle) * distance;
        const newLng = device.lng + Math.cos(angle) * distance;

        device.lat = newLat;
        device.lng = newLng;
        device.speed = device.movement.type === 'stationary' ? 0 : 
                       device.movement.type === 'walk' ? Utils.randomInt(2, 6) :
                       device.movement.type === 'drive' ? Utils.randomInt(20, 60) :
                       device.movement.type === 'fly' ? Utils.randomInt(40, 80) :
                       Utils.randomInt(8, 20);
        device.heading = (device.heading + Utils.randomInt(-30, 30) + 360) % 360;
        device.battery = Math.max(0, device.battery - Math.random() * 0.05);
        device.lastSeen = Date.now();

        device.history.push({
          lat: newLat,
          lng: newLng,
          timestamp: Date.now()
        });


        if (device.history.length > 100) {
          device.history = device.history.slice(-80);
        }


        const marker = this.deviceMarkers[device.id];
        if (marker) {
          marker.setLatLng([newLat, newLng]);
          marker.setPopupContent(this.createDevicePopup(device, false));
        }


        this.updateDeviceHistory(device);


        this.checkGeofences(device);
      });


      this.renderTelemetryPanel();
      this.updateDeviceListStatus();
      this.updateTrackingStats();

    }, 3000); // Update every 3 seconds
  },

  stopTracking() {
    this.trackingActive = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  },

  checkGeofences(device) {
    this.geofences.forEach(gf => {
      const distance = this.haversineDistance(
        device.lat, device.lng,
        gf.center[0], gf.center[1]
      );

      if (distance <= gf.radius && !device._insideGeofence?.[gf.name]) {
        // Entered geofence
        if (!device._insideGeofence) device._insideGeofence = {};
        device._insideGeofence[gf.name] = true;
        // Show notification (throttled)
        if (Math.random() < 0.1) {
          ImpactBridge.ui.showToast('info', '🔔 Geofence Alert', `${device.name} entered ${gf.name}`);
        }
      } else if (distance > gf.radius && device._insideGeofence?.[gf.name]) {
        device._insideGeofence[gf.name] = false;
      }
    });
  },

  haversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  },

  renderDeviceList() {
    const container = document.getElementById('tracker-device-list');
    if (!container) return;


    let html = `
      <div class="tracker-device-item ${this.selectedDevice === 'my-device' ? 'selected' : ''}" 
           onclick="LocationTracker.selectDevice('my-device')" id="tracker-item-my-device">
        <div class="tracker-device-item-icon my-device" style="--device-color:#10b981">
          <span class="material-symbols-outlined" style="font-size:18px;color:#10b981">my_location</span>
        </div>
        <div class="tracker-device-item-info">
          <div class="tracker-device-item-name">My Device</div>
          <div class="tracker-device-item-meta">
            <span class="tracker-status-dot active"></span>
            <span class="tracker-time-ago">${this.myDevice.lat ? 'Live Tracking' : 'Acquiring GPS...'}</span>
          </div>
        </div>
        <div class="tracker-device-item-right">
          <div class="tracker-device-item-battery">
            <span class="material-symbols-outlined" style="font-size:14px;color:#10b981">battery_full</span>
            <span>${Math.round(this.myDevice.battery)}%</span>
          </div>
          <div class="tracker-device-item-speed">
            <span class="material-symbols-outlined" style="font-size:11px">speed</span>
            ${this.myDevice.speed ? Math.round(this.myDevice.speed) + ' km/h' : 'Idle'}
          </div>
        </div>
      </div>
    `;


    this.trackedDevices.forEach(device => {
      const batteryColor = device.battery > 60 ? '#10b981' : device.battery > 25 ? '#f59e0b' : '#ef4444';
      const statusClass = device.status === 'active' ? 'active' : 'inactive';

      const speedVal = device.speed ? Math.round(device.speed) : 0;
      const signalBars = device.accuracy <= 5 ? 4 : device.accuracy <= 15 ? 3 : device.accuracy <= 30 ? 2 : 1;

      html += `
        <div class="tracker-device-item ${this.selectedDevice === device.id ? 'selected' : ''}" 
             onclick="LocationTracker.selectDevice('${device.id}')" id="tracker-item-${device.id}">
          <div class="tracker-device-item-icon" style="--device-color:${device.color}">
            <span style="font-size:18px">${device.icon}</span>
          </div>
          <div class="tracker-device-item-info">
            <div class="tracker-device-item-name">${device.name}</div>
            <div class="tracker-device-item-meta">
              <span class="tracker-status-dot ${statusClass}"></span>
              <span class="tracker-time-ago">${device.status === 'active' ? Utils.timeAgo(device.lastSeen) : 'Offline'}</span>
              <span class="tracker-signal-mini">
                ${[1,2,3,4].map(i => `<span class="signal-bar" style="height:${i*2+2}px;background:${i <= signalBars ? (signalBars >= 3 ? '#10b981' : '#f59e0b') : '#1e293b'}"></span>`).join('')}
              </span>
            </div>
          </div>
          <div class="tracker-device-item-right">
            <div class="tracker-device-item-battery" style="color:${batteryColor}">
              <span class="material-symbols-outlined" style="font-size:14px">${Math.round(device.battery) > 50 ? 'battery_5_bar' : 'battery_2_bar'}</span>
              <span>${Math.round(device.battery)}%</span>
            </div>
            <div class="tracker-device-item-speed">
              <span class="material-symbols-outlined" style="font-size:11px">speed</span>
              ${speedVal > 0 ? speedVal + ' km/h' : 'Idle'}
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  updateDeviceListStatus() {

    this.trackedDevices.forEach(device => {
      const item = document.getElementById(`tracker-item-${device.id}`);
      if (!item) return;

      const batteryEl = item.querySelector('.tracker-device-item-battery');
      const batteryColor = device.battery > 60 ? '#10b981' : device.battery > 25 ? '#f59e0b' : '#ef4444';
      if (batteryEl) {
        batteryEl.style.color = batteryColor;
        batteryEl.querySelector('span:last-child').textContent = `${Math.round(device.battery)}%`;
      }

      const metaEl = item.querySelector('.tracker-device-item-meta .tracker-time-ago');
      if (metaEl) {
        metaEl.textContent = device.status === 'active' ? Utils.timeAgo(device.lastSeen) : 'Offline';
      }

      // Update speed
      const speedEl = item.querySelector('.tracker-device-item-speed');
      if (speedEl) {
        const spd = device.speed ? Math.round(device.speed) : 0;
        speedEl.innerHTML = `<span class="material-symbols-outlined" style="font-size:11px">speed</span> ${spd > 0 ? spd + ' km/h' : 'Idle'}`;
      }
    });
  },

  selectDevice(deviceId) {
    this.selectedDevice = deviceId;


    document.querySelectorAll('.tracker-device-item').forEach(el => el.classList.remove('selected'));
    const item = document.getElementById(`tracker-item-${deviceId}`);
    if (item) item.classList.add('selected');


    let device;
    if (deviceId === 'my-device') {
      device = this.myDevice;
    } else {
      device = this.trackedDevices.find(d => d.id === deviceId);
    }

    if (device && device.lat && device.lng) {
      this.map.flyTo([device.lat, device.lng], 14, { duration: 1.2 });


      const marker = this.deviceMarkers[deviceId];
      if (marker) {
        setTimeout(() => marker.openPopup(), 1300);
      }
    }

    this.renderTelemetryPanel();
  },

  renderTelemetryPanel() {
    const container = document.getElementById('tracker-telemetry');
    if (!container) return;

    let device;
    if (this.selectedDevice === 'my-device' || !this.selectedDevice) {
      device = this.myDevice;
    } else {
      device = this.trackedDevices.find(d => d.id === this.selectedDevice);
    }

    if (!device) {
      device = this.myDevice;
    }

    const bat = Math.round(device.battery);
    const batteryColor = bat > 60 ? '#10b981' : bat > 25 ? '#f59e0b' : '#ef4444';
    const speedKmh = device.speed ? Math.round(device.speed) : 0;
    const maxSpeed = device.movement?.type === 'fly' ? 100 : device.movement?.type === 'drive' ? 80 : device.movement?.type === 'boat' ? 30 : 10;
    const speedPct = Math.min(speedKmh / maxSpeed, 1);
    const headingDeg = device.heading != null ? Math.round(device.heading) : 0;
    const compassDir = this.getCompassDirection(device.heading);
    const signalBars = device.accuracy <= 5 ? 4 : device.accuracy <= 15 ? 3 : device.accuracy <= 30 ? 2 : 1;
    const signalLabel = signalBars >= 4 ? 'Excellent' : signalBars >= 3 ? 'Good' : signalBars >= 2 ? 'Fair' : 'Weak';
    const signalColor = signalBars >= 3 ? '#10b981' : signalBars === 2 ? '#f59e0b' : '#ef4444';

    // SVG speed gauge arc path
    const gaugeR = 60;
    const arcStart = 135;
    const arcEnd = 405;
    const arcRange = arcEnd - arcStart;
    const needleAngle = arcStart + arcRange * speedPct;
    const createArc = (r, start, end) => {
      const s = start * Math.PI / 180;
      const e = end * Math.PI / 180;
      const x1 = 75 + r * Math.cos(s);
      const y1 = 75 + r * Math.sin(s);
      const x2 = 75 + r * Math.cos(e);
      const y2 = 75 + r * Math.sin(e);
      const lg = (end - start) > 180 ? 1 : 0;
      return `M ${x1} ${y1} A ${r} ${r} 0 ${lg} 1 ${x2} ${y2}`;
    };

    // Battery arc
    const batArcAngle = (bat / 100) * 270;
    const batR = 22;
    const batArcPath = createArc(batR, 135, 135 + batArcAngle);
    const batBgArc = createArc(batR, 135, 405);

    container.innerHTML = `
      <div class="telemetry-header">
        <div class="telemetry-device-name">
          <span style="font-size:18px">${device.id === 'my-device' ? '📍' : (device.icon || '📱')}</span>
          ${device.name}
        </div>
        <div class="telemetry-status ${device.status}">
          <div class="telemetry-status-dot"></div>
          ${device.status === 'active' ? 'LIVE' : 'OFFLINE'}
        </div>
      </div>

      <!-- Speed Gauge -->
      <div class="telemetry-gauge-section">
        <svg viewBox="0 0 150 100" class="telemetry-speed-svg">
          <!-- Background arc -->
          <path d="${createArc(gaugeR, arcStart, arcEnd)}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8" stroke-linecap="round"/>
          <!-- Active arc -->
          <path d="${createArc(gaugeR, arcStart, arcStart + arcRange * speedPct)}" fill="none" stroke="url(#gaugeGrad)" stroke-width="8" stroke-linecap="round" class="gauge-arc-animated"/>
          <!-- Tick marks -->
          ${[0,0.25,0.5,0.75,1].map(t => {
            const a = (arcStart + arcRange * t) * Math.PI / 180;
            const x1 = 75 + 52 * Math.cos(a);
            const y1 = 75 + 52 * Math.sin(a);
            const x2 = 75 + 56 * Math.cos(a);
            const y2 = 75 + 56 * Math.sin(a);
            return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-linecap="round"/>`;
          }).join('')}
          <!-- Gradient def -->
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#10b981"/>
              <stop offset="50%" stop-color="#06b6d4"/>
              <stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient>
          </defs>
          <!-- Value -->
          <text x="75" y="72" text-anchor="middle" fill="#f8fafc" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="22">${speedKmh}</text>
          <text x="75" y="86" text-anchor="middle" fill="#64748b" font-family="Inter,sans-serif" font-weight="600" font-size="8" letter-spacing="0.08em">KM/H</text>
        </svg>
      </div>

      <!-- Telemetry cards -->
      <div class="telemetry-grid">
        <div class="telemetry-card">
          <div class="telemetry-card-icon" style="background:rgba(167,139,250,0.08)">
            <span class="material-symbols-outlined" style="color:#a78bfa">altitude</span>
          </div>
          <div class="telemetry-card-data">
            <div class="telemetry-value">${device.altitude != null ? Math.round(device.altitude) : '—'}<span class="telemetry-unit">m</span></div>
            <div class="telemetry-label">altitude</div>
          </div>
        </div>

        <div class="telemetry-card">
          <div class="telemetry-card-icon" style="background:rgba(245,158,11,0.08)">
            <span class="material-symbols-outlined" style="color:#f59e0b;transform:rotate(${headingDeg}deg);transition:transform 0.5s">navigation</span>
          </div>
          <div class="telemetry-card-data">
            <div class="telemetry-value">${headingDeg}°<span class="telemetry-unit">${compassDir}</span></div>
            <div class="telemetry-label">heading</div>
          </div>
        </div>

        <div class="telemetry-card">
          <div class="telemetry-card-icon" style="background:${batteryColor}14">
            <svg viewBox="0 0 50 50" width="22" height="22">
              <path d="${batBgArc}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4" stroke-linecap="round"/>
              <path d="${batArcPath}" fill="none" stroke="${batteryColor}" stroke-width="4" stroke-linecap="round" class="gauge-arc-animated"/>
              <text x="25" y="28" text-anchor="middle" fill="${batteryColor}" font-family="'Space Grotesk',sans-serif" font-weight="700" font-size="10">${bat}</text>
            </svg>
          </div>
          <div class="telemetry-card-data">
            <div class="telemetry-value" style="color:${batteryColor}">${bat}%</div>
            <div class="telemetry-label">battery</div>
          </div>
        </div>

        <div class="telemetry-card">
          <div class="telemetry-card-icon" style="background:${signalColor}14">
            <div style="display:flex;align-items:flex-end;gap:2px;height:16px">
              ${[1,2,3,4].map(i => `<div style="width:3.5px;height:${i * 3 + 2}px;border-radius:1px;background:${i <= signalBars ? signalColor : 'rgba(255,255,255,0.08)'};transition:background 0.3s"></div>`).join('')}
            </div>
          </div>
          <div class="telemetry-card-data">
            <div class="telemetry-value" style="color:${signalColor};font-size:0.85em">${signalLabel}</div>
            <div class="telemetry-label">±${Math.round(device.accuracy)}m signal</div>
          </div>
        </div>
      </div>

      <!-- Coordinates Card -->
      <div class="telemetry-coords-card">
        <div class="telemetry-coords-title">
          <span class="material-symbols-outlined" style="font-size:14px;color:var(--primary-400)">pin_drop</span>
          Position Data
          <button class="telemetry-copy-btn" onclick="LocationTracker.copyCoords()" title="Copy coordinates">
            <span class="material-symbols-outlined" style="font-size:13px">content_copy</span>
          </button>
        </div>
        <div class="telemetry-coords">
          <div class="telemetry-coord-row">
            <span class="telemetry-coord-label">Latitude</span>
            <span class="telemetry-coord-value">${device.lat ? device.lat.toFixed(6) : 'Acquiring...'}</span>
          </div>
          <div class="telemetry-coord-row">
            <span class="telemetry-coord-label">Longitude</span>
            <span class="telemetry-coord-value">${device.lng ? device.lng.toFixed(6) : 'Acquiring...'}</span>
          </div>
          <div class="telemetry-coord-row">
            <span class="telemetry-coord-label">Accuracy</span>
            <span class="telemetry-coord-value accuracy-value"><span style="color:${signalColor}">±${Math.round(device.accuracy)}m</span></span>
          </div>
          <div class="telemetry-coord-row">
            <span class="telemetry-coord-label">Last Update</span>
            <span class="telemetry-coord-value">${device.lastSeen ? Utils.timeAgo(device.lastSeen) : 'Never'}</span>
          </div>
        </div>
      </div>
    `;
  },

  copyCoords() {
    let device;
    if (this.selectedDevice === 'my-device' || !this.selectedDevice) {
      device = this.myDevice;
    } else {
      device = this.trackedDevices.find(d => d.id === this.selectedDevice);
    }
    if (device && device.lat && device.lng) {
      const text = `${device.lat.toFixed(6)}, ${device.lng.toFixed(6)}`;
      navigator.clipboard.writeText(text).then(() => {
        ImpactBridge.ui.showToast('success', '📋 Copied', text);
      }).catch(() => {
        ImpactBridge.ui.showToast('info', '📍 Coordinates', text);
      });
    }
  },

  updateTrackingStats() {
    const el = document.getElementById('tracker-active-count');
    if (el) {
      const activeCount = this.trackedDevices.filter(d => d.status === 'active').length + (this.myDevice.lat ? 1 : 0);
      el.textContent = activeCount;
    }

    const totalEl = document.getElementById('tracker-total-count');
    if (totalEl) {
      totalEl.textContent = this.trackedDevices.length + 1;
    }
  },

  setupControls() {

    const centerAllBtn = document.getElementById('tracker-center-all');
    if (centerAllBtn) {
      centerAllBtn.onclick = () => this.centerOnAll();
    }


    const toggleHistoryBtn = document.getElementById('tracker-toggle-history');
    if (toggleHistoryBtn) {
      toggleHistoryBtn.onclick = () => {
        this.showHistory = !this.showHistory;
        toggleHistoryBtn.classList.toggle('btn-primary', this.showHistory);
        toggleHistoryBtn.classList.toggle('btn-secondary', !this.showHistory);

        Object.keys(this.historyPolylines).forEach(id => {
          if (this.historyPolylines[id]) {
            if (this.showHistory) {
              this.historyPolylines[id].addTo(this.map);
            } else {
              this.map.removeLayer(this.historyPolylines[id]);
            }
          }
        });
      };
    }


    const toggleGeofenceBtn = document.getElementById('tracker-toggle-geofence');
    if (toggleGeofenceBtn) {
      let gfVisible = true;
      toggleGeofenceBtn.onclick = () => {
        gfVisible = !gfVisible;
        toggleGeofenceBtn.classList.toggle('btn-primary', gfVisible);
        toggleGeofenceBtn.classList.toggle('btn-secondary', !gfVisible);
        this.geofenceCircles.forEach(c => {
          if (gfVisible) c.addTo(this.map);
          else this.map.removeLayer(c);
        });
      };
    }


    const locateMeBtn = document.getElementById('tracker-locate-me');
    if (locateMeBtn) {
      locateMeBtn.onclick = () => {
        if (this.myDevice.lat && this.myDevice.lng) {
          this.map.flyTo([this.myDevice.lat, this.myDevice.lng], 15, { duration: 1 });
          this.selectDevice('my-device');
        } else {
          ImpactBridge.ui.showToast('warning', 'Location Unavailable', 'GPS signal not acquired yet');
        }
      };
    }


    const pauseBtn = document.getElementById('tracker-pause');
    if (pauseBtn) {
      pauseBtn.onclick = () => {
        if (this.trackingActive) {
          this.trackingActive = false;
          pauseBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px">play_arrow</span> Resume';
          pauseBtn.classList.remove('btn-danger');
          pauseBtn.classList.add('btn-primary');
          ImpactBridge.ui.showToast('warning', '⏸ Tracking Paused', 'Real-time updates suspended');
        } else {
          this.trackingActive = true;
          pauseBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px">pause</span> Pause';
          pauseBtn.classList.add('btn-danger');
          pauseBtn.classList.remove('btn-primary');
          ImpactBridge.ui.showToast('success', '▶ Tracking Resumed', 'Real-time updates active');
        }
      };
    }
  },

  centerOnAll() {
    const bounds = L.latLngBounds([]);

    if (this.myDevice.lat && this.myDevice.lng) {
      bounds.extend([this.myDevice.lat, this.myDevice.lng]);
    }

    this.trackedDevices.forEach(d => {
      if (d.lat && d.lng) bounds.extend([d.lat, d.lng]);
    });

    if (bounds.isValid()) {
      this.map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    }
  },

  addCustomDevice(name, icon, color) {
    const id = 'dev-custom-' + Utils.generateId().slice(0, 8);

    const center = this.map.getCenter();

    const device = {
      id,
      name,
      icon: icon || '📱',
      lat: center.lat + (Math.random() - 0.5) * 0.02,
      lng: center.lng + (Math.random() - 0.5) * 0.02,
      accuracy: Utils.randomInt(5, 20),
      speed: 0,
      altitude: Utils.randomInt(180, 250),
      heading: Utils.randomInt(0, 360),
      battery: Utils.randomInt(40, 100),
      status: 'active',
      lastSeen: Date.now(),
      color: color || '#10b981',
      history: [],
      movement: { type: 'walk', radius: 0.005, speed: 0.0001 }
    };

    this.trackedDevices.push(device);
    this.generateFakeHistory(device);
    this.addDeviceMarker(device);
    this.addDeviceHistory(device);
    this.renderDeviceList();

    ImpactBridge.ui.showToast('success', '📱 Device Added', `${name} is now being tracked`);
    ImpactBridge.ui.closeModal('modal-add-device');
  },


  openAddDeviceModal() {
    ImpactBridge.ui.openModal('modal-add-device');
  },


  _selectedIcon: '📱',
  _selectedColor: '#10b981',

  _selectIcon(el) {
    document.querySelectorAll('.device-icon-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    this._selectedIcon = el.dataset.icon;
  },

  _selectColor(el) {
    document.querySelectorAll('.device-color-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    this._selectedColor = el.dataset.color;
  },

  _submitDevice() {
    const nameInput = document.getElementById('add-device-name');
    const name = nameInput?.value?.trim();
    if (!name) {
      ImpactBridge.ui.showToast('error', 'Name Required', 'Please enter a device name');
      return;
    }
    this.addCustomDevice(name, this._selectedIcon, this._selectedColor);
    if (nameInput) nameInput.value = '';

    this._selectedIcon = '📱';
    this._selectedColor = '#10b981';
  },


  destroy() {
    this.stopTracking();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.initialized = false;
  }
};
