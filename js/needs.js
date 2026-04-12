const NeedsManager = {
  needs: [],
  currentFilter: 'all',

  generateDemoNeeds() {
    return [
      {
        id: Utils.generateId(),
        title: 'Flood Relief for 500 Families in Silchar, Assam',
        category: 'disaster',
        description: 'Devastating floods have displaced over 500 families in Silchar after the Barak River breached its banks. Urgent need for temporary shelters, clean drinking water, dry food packets, and medical supplies. Three relief camps have been set up but are running out of supplies.',
        location: 'Silchar, Assam',
        lat: 24.8333, lng: 92.7789,
        priority: 'critical',
        affected: 2200,
        organization: 'Assam State Disaster Management',
        contact: 'relief@asdma.gov.in',
        status: 'active',
        volunteersNeeded: 25,
        volunteersAssigned: 12,
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        title: 'Mobile Medical Camp for Tribal Villages in Odisha',
        category: 'healthcare',
        description: 'Three remote tribal villages in Koraput district have no access to healthcare — nearest hospital is 55km away. High prevalence of malaria and waterborne diseases reported. Need doctors, nurses, basic medicines, and diagnostic equipment for a 5-day medical camp.',
        location: 'Koraput, Odisha',
        lat: 18.8135, lng: 82.7123,
        priority: 'critical',
        affected: 1800,
        organization: 'Tribal Health Mission',
        contact: '+91 98765 12345',
        status: 'active',
        volunteersNeeded: 15,
        volunteersAssigned: 3,
        createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        title: 'Education Supplies for Earthquake-Affected Schools in Joshimath',
        category: 'education',
        description: 'Following the land subsidence crisis, 12 schools in Joshimath have lost classroom materials, textbooks, and digital learning equipment. 2,500+ students are without proper study materials. Need textbooks, notebooks, tablets for digital learning, and volunteer teachers.',
        location: 'Joshimath, Uttarakhand',
        lat: 30.5581, lng: 79.5659,
        priority: 'high',
        affected: 2500,
        organization: 'Uttarakhand Education Foundation',
        contact: 'help@ukeducation.org',
        status: 'active',
        volunteersNeeded: 20,
        volunteersAssigned: 8,
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        title: 'Mangrove Restoration Drive in Sundarbans',
        category: 'environment',
        description: 'Cyclone Remal damaged 40% of mangrove cover in South 24 Parganas. Local fishing communities are losing their natural storm barrier. Need volunteers for large-scale mangrove planting, seed collection, and community awareness campaigns.',
        location: 'Sundarbans, West Bengal',
        lat: 21.9497, lng: 88.8988,
        priority: 'high',
        affected: 5000,
        organization: 'Sundarban Conservation Society',
        contact: 'restore@sundarbanscs.org',
        status: 'active',
        volunteersNeeded: 50,
        volunteersAssigned: 18,
        createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        title: 'Emergency Shelters for Homeless Families in Delhi Winter',
        category: 'shelter',
        description: 'With temperatures dropping below 4°C, an estimated 300 homeless families near Yamuna Pushta need emergency night shelters, warm clothing, and blankets. Current shelters are at 150% capacity. NGOs need volunteers to manage additional temporary shelters.',
        location: 'Yamuna Pushta, Delhi',
        lat: 28.6692, lng: 77.2487,
        priority: 'critical',
        affected: 1200,
        organization: 'Delhi Urban Shelter Board',
        contact: '+91 98123 45678',
        status: 'active',
        volunteersNeeded: 30,
        volunteersAssigned: 15,
        createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        title: 'Community Kitchen for Flood-Affected Wayanad',
        category: 'food',
        description: 'Landslides in Wayanad have cut off 8 villages from food supply chains. Over 3,000 people need daily meal support. Community kitchens are being set up but need cooks, food supplies, and logistics volunteers to transport meals to isolated areas.',
        location: 'Wayanad, Kerala',
        lat: 11.6854, lng: 76.1320,
        priority: 'critical',
        affected: 3000,
        organization: 'Kerala Disaster Relief Network',
        contact: 'food@kdrn.org',
        status: 'active',
        volunteersNeeded: 40,
        volunteersAssigned: 22,
        createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        title: 'Skill Training for Youth in Dharavi, Mumbai',
        category: 'livelihood',
        description: 'Youth unemployment in Dharavi exceeds 45%. Need tutors to teach digital literacy, basic coding, and spoken English. Local community center has space for 100 students but needs volunteer trainers and donated laptops.',
        location: 'Dharavi, Mumbai',
        lat: 19.0438, lng: 72.8534,
        priority: 'medium',
        affected: 800,
        organization: 'Dharavi Youth Foundation',
        contact: 'train@dharaviyouth.org',
        status: 'active',
        volunteersNeeded: 15,
        volunteersAssigned: 6,
        createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        title: 'Clean Water Access for Remote Rajasthan Villages',
        category: 'food',
        description: 'Five villages in Barmer district depend on a single contaminated well. 600+ cases of waterborne illness reported in the last month. Need volunteers to install water purification systems and educate communities on water safety.',
        location: 'Barmer, Rajasthan',
        lat: 25.7521, lng: 71.3967,
        priority: 'high',
        affected: 3500,
        organization: 'Water.org India',
        contact: 'clean@waterorg.in',
        status: 'active',
        volunteersNeeded: 10,
        volunteersAssigned: 4,
        createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        title: 'Mental Health Support for Manipur Conflict Survivors',
        category: 'healthcare',
        description: 'Ethnic conflict in Manipur has displaced over 60,000 people. Relief camps report high rates of PTSD, anxiety, and depression among displaced families. Urgent need for trained counselors and mental health professionals.',
        location: 'Imphal, Manipur',
        lat: 24.8170, lng: 93.9368,
        priority: 'high',
        affected: 4500,
        organization: 'Manipur Mental Health Alliance',
        contact: 'help@mmha.org',
        status: 'active',
        volunteersNeeded: 12,
        volunteersAssigned: 2,
        createdAt: new Date(Date.now() - 96 * 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        title: 'Tree Plantation Drive in Aravalli Hills',
        category: 'environment',
        description: 'Extensive mining has denuded 200 hectares of Aravalli forest cover near Gurugram. Local communities face dust storms and groundwater depletion. Need volunteers for upcoming mega plantation drive — target 50,000 saplings.',
        location: 'Gurugram, Haryana',
        lat: 28.4595, lng: 77.0266,
        priority: 'medium',
        affected: 15000,
        organization: 'Aravalli Foundation',
        contact: 'plant@aravalli.org',
        status: 'active',
        volunteersNeeded: 100,
        volunteersAssigned: 35,
        createdAt: new Date(Date.now() - 120 * 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        title: 'Women Self-Help Group Setup in Rural Bihar',
        category: 'livelihood',
        description: 'Village women in Muzaffarpur need support establishing self-help groups for micro-enterprises. Need trainers for financial literacy, business planning, and access to government schemes. 200 women have expressed interest.',
        location: 'Muzaffarpur, Bihar',
        lat: 26.1209, lng: 85.3647,
        priority: 'medium',
        affected: 200,
        organization: 'Bihar Women Empowerment Trust',
        contact: 'empower@bwet.org',
        status: 'active',
        volunteersNeeded: 8,
        volunteersAssigned: 3,
        createdAt: new Date(Date.now() - 168 * 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: Utils.generateId(),
        title: 'After-School Tutoring for Migrant Worker Children',
        category: 'education',
        description: 'Children of migrant construction workers in Bangalore lack access to education. 150 children identified near Whitefield construction sites who need daily tutoring, stationery, and nutritious meals. Need volunteer teachers fluent in Hindi and Kannada.',
        location: 'Whitefield, Bangalore',
        lat: 12.9698, lng: 77.7500,
        priority: 'medium',
        affected: 150,
        organization: 'Mobile Creches Foundation',
        contact: 'teach@mobilecreches.org',
        status: 'active',
        volunteersNeeded: 12,
        volunteersAssigned: 5,
        createdAt: new Date(Date.now() - 200 * 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  },

  init() {

    const stored = Utils.loadFromStorage('needs');
    this.needs = stored || this.generateDemoNeeds();
    Utils.saveToStorage('needs', this.needs);
  },


  getAllNeeds() {
    return this.needs.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  },

  getNeedById(id) {
    return this.needs.find(n => n.id === id);
  },

  getNeedsByCategory(category) {
    if (category === 'all') return this.getAllNeeds();
    return this.getAllNeeds().filter(n => n.category === category);
  },

  getUrgentNeeds(limit = 5) {
    return this.getAllNeeds()
      .filter(n => n.priority === 'critical' || n.priority === 'high')
      .slice(0, limit);
  },

  addNeed(need) {
    const newNeed = {
      id: Utils.generateId(),
      ...need,
      status: 'active',
      volunteersNeeded: need.volunteersNeeded || 10,
      volunteersAssigned: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.needs.unshift(newNeed);
    Utils.saveToStorage('needs', this.needs);
    return newNeed;
  },

  updateNeed(id, updates) {
    const idx = this.needs.findIndex(n => n.id === id);
    if (idx >= 0) {
      this.needs[idx] = { ...this.needs[idx], ...updates, updatedAt: new Date().toISOString() };
      Utils.saveToStorage('needs', this.needs);
      return this.needs[idx];
    }
    return null;
  },


  getStats() {
    const total = this.needs.length;
    const critical = this.needs.filter(n => n.priority === 'critical').length;
    const active = this.needs.filter(n => n.status === 'active').length;
    const totalAffected = this.needs.reduce((sum, n) => sum + (n.affected || 0), 0);
    const totalVolunteersNeeded = this.needs.reduce((sum, n) => sum + (n.volunteersNeeded || 0), 0);
    const totalVolunteersAssigned = this.needs.reduce((sum, n) => sum + (n.volunteersAssigned || 0), 0);

    return { total, critical, active, totalAffected, totalVolunteersNeeded, totalVolunteersAssigned };
  },

  getCategoryBreakdown() {
    const breakdown = {};
    this.needs.forEach(n => {
      if (!breakdown[n.category]) breakdown[n.category] = 0;
      breakdown[n.category]++;
    });
    return breakdown;
  },

  openSubmitModal() {
    ImpactBridge.ui.openModal('modal-submit-need');
  },

  openAIParseModal() {
    ImpactBridge.ui.openModal('modal-ai-parse');
  },

  submitNeed(event) {
    event.preventDefault();

    const need = {
      title: document.getElementById('need-title').value,
      category: document.getElementById('need-category').value,
      description: document.getElementById('need-description').value,
      location: document.getElementById('need-location').value,
      affected: parseInt(document.getElementById('need-affected').value) || 0,
      priority: document.getElementById('need-priority').value,
      organization: document.getElementById('need-org').value,
      contact: document.getElementById('need-contact').value,
      lat: 20 + Math.random() * 10,
      lng: 75 + Math.random() * 15
    };

    this.addNeed(need);
    ImpactBridge.ui.closeModal('modal-submit-need');
    document.getElementById('need-form').reset();
    ImpactBridge.ui.showToast('success', 'Need Submitted', 'Community need has been recorded and prioritized.');
    ActivityLog.add('need', `New ${need.priority} need: "${need.title}" in ${need.location}`);


    if (ImpactBridge.currentView === 'needs') this.renderNeedsGrid();
    if (ImpactBridge.currentView === 'dashboard') ImpactBridge.dashboard.render();
  },

  renderNeedsGrid() {
    const grid = document.getElementById('needs-grid');
    const needs = this.getNeedsByCategory(this.currentFilter);

    if (needs.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">No needs found</div>
          <div class="empty-state-desc">No community needs match this filter. Try a different category or submit a new need.</div>
          <button class="btn btn-primary" onclick="ImpactBridge.needs.openSubmitModal()">
            <span class="material-symbols-outlined" style="font-size:16px">add_circle</span>
            Submit Need
          </button>
        </div>`;
      return;
    }

    grid.innerHTML = needs.map((need, i) => {
      const cat = Utils.categoryColors[need.category] || { bg: 'rgba(16,185,129,0.12)', text: '#34d399', icon: '📋' };
      const pri = Utils.priorityConfig[need.priority] || Utils.priorityConfig.medium;
      const progress = need.volunteersNeeded > 0 
        ? Math.round((need.volunteersAssigned / need.volunteersNeeded) * 100) 
        : 0;

      return `
        <div class="glass-card need-card" style="animation-delay:${i * 60}ms" onclick="ImpactBridge.needs.showNeedDetail('${need.id}')">
          <div class="need-card-header">
            <span class="need-card-category">
              <span>${cat.icon}</span>
              ${need.category.charAt(0).toUpperCase() + need.category.slice(1)}
            </span>
            <span class="badge badge-${need.priority === 'critical' ? 'critical' : need.priority === 'high' ? 'warning' : need.priority === 'medium' ? 'info' : 'primary'}" style="font-size:10px">
              ${pri.icon} ${pri.label}
            </span>
          </div>
          <div class="need-card-title">${need.title}</div>
          <div class="need-card-desc">${need.description}</div>
          <div class="need-card-location">
            <span class="material-symbols-outlined" style="font-size:14px">location_on</span>
            ${need.location}
          </div>
          <div style="margin-bottom:12px">
            <div class="flex-between" style="margin-bottom:6px">
              <span style="font-size:11px;color:var(--text-tertiary)">Volunteers: ${need.volunteersAssigned}/${need.volunteersNeeded}</span>
              <span style="font-size:11px;color:var(--primary-400);font-weight:600">${progress}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-bar-fill" style="width:${progress}%"></div>
            </div>
          </div>
          <div class="need-card-meta">
            <span>
              <span class="material-symbols-outlined" style="font-size:13px">group</span>
              ${Utils.formatNumber(need.affected)} affected
            </span>
            <span>
              <span class="material-symbols-outlined" style="font-size:13px">schedule</span>
              ${Utils.timeAgo(need.createdAt)}
            </span>
          </div>
        </div>
      `;
    }).join('');


    this.setupFilters();
  },

  setupFilters() {
    document.querySelectorAll('#needs-filter-bar .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#needs-filter-bar .filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentFilter = chip.dataset.filter;
        this.renderNeedsGrid();
      });
    });
  },

  showNeedDetail(id) {
    const need = this.getNeedById(id);
    if (!need) return;

    const cat = Utils.categoryColors[need.category] || { icon: '📋' };
    const pri = Utils.priorityConfig[need.priority];
    const progress = need.volunteersNeeded > 0 
      ? Math.round((need.volunteersAssigned / need.volunteersNeeded) * 100) 
      : 0;

    ImpactBridge.ui.showToast('info', `${cat.icon} ${need.title}`, `${need.location} — ${pri.label} priority — ${need.affected} people affected`);
  },

  renderUrgentNeedsList() {
    const container = document.getElementById('urgent-needs-list');
    if (!container) return;

    const urgent = this.getUrgentNeeds(5);
    container.innerHTML = urgent.map(need => {
      const cat = Utils.categoryColors[need.category] || { icon: '📋' };
      const pri = Utils.priorityConfig[need.priority];
      return `
        <div class="glass-card need-card" style="padding:12px;margin:0" onclick="ImpactBridge.needs.showNeedDetail('${need.id}')">
          <div class="flex-between" style="margin-bottom:6px">
            <span style="font-size:12px;font-weight:600">${cat.icon} ${need.title.substring(0, 40)}${need.title.length > 40 ? '...' : ''}</span>
            <span class="badge badge-${need.priority === 'critical' ? 'critical' : 'warning'}" style="font-size:9px;padding:1px 6px">${pri.label}</span>
          </div>
          <div style="font-size:11px;color:var(--text-tertiary);display:flex;align-items:center;gap:4px">
            <span class="material-symbols-outlined" style="font-size:12px">location_on</span>
            ${need.location}
            <span style="margin-left:auto">${Utils.formatNumber(need.affected)} affected</span>
          </div>
        </div>
      `;
    }).join('');
  }
};
