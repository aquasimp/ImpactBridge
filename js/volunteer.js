const VolunteerManager = {
  volunteers: [],

  generateDemoVolunteers() {
    return [
      {
        id: Utils.generateId(),
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@gmail.com',
        phone: '+91 98765 43210',
        location: 'Mumbai, Maharashtra',
        lat: 19.0760, lng: 72.8777,
        skills: ['Medical', 'First Aid', 'Emergency Response', 'Surgery'],
        availability: 'fulltime',
        experience: 8,
        organization: 'Doctors Without Borders India',
        status: 'available',
        hoursContributed: 240,
        missionsCompleted: 15,
        rating: 4.9,
        joinedAt: new Date(Date.now() - 180 * 86400000).toISOString()
      },
      {
        id: Utils.generateId(),
        name: 'Rajesh Kumar Singh',
        email: 'rajesh.logistics@gmail.com',
        phone: '+91 99887 65432',
        location: 'Pune, Maharashtra',
        lat: 18.5204, lng: 73.8567,
        skills: ['Logistics', 'Transport', 'Supply Chain', 'Coordination'],
        availability: 'weekends',
        experience: 5,
        organization: 'Indian Red Cross',
        status: 'available',
        hoursContributed: 180,
        missionsCompleted: 12,
        rating: 4.7,
        joinedAt: new Date(Date.now() - 120 * 86400000).toISOString()
      },
      {
        id: Utils.generateId(),
        name: 'Anita Desai',
        email: 'anita.desai@outlook.com',
        phone: '+91 88776 55443',
        location: 'Thane, Maharashtra',
        lat: 19.2183, lng: 72.9781,
        skills: ['Teaching', 'Counseling', 'Community Organizing', 'Hindi', 'Marathi'],
        availability: 'parttime',
        experience: 6,
        organization: 'Teach For India',
        status: 'deployed',
        currentMission: 'Education support in Dharavi',
        hoursContributed: 320,
        missionsCompleted: 22,
        rating: 4.8,
        joinedAt: new Date(Date.now() - 365 * 86400000).toISOString()
      },
      {
        id: Utils.generateId(),
        name: 'Mohammed Irfan',
        email: 'irfan.rescue@gmail.com',
        phone: '+91 77665 44332',
        location: 'Guwahati, Assam',
        lat: 26.1445, lng: 91.7362,
        skills: ['Disaster Relief', 'Swimming', 'Rescue Operations', 'Boat Navigation'],
        availability: 'oncall',
        experience: 10,
        organization: 'NDRF Volunteer Corps',
        status: 'deployed',
        currentMission: 'Flood rescue in Silchar',
        hoursContributed: 560,
        missionsCompleted: 35,
        rating: 5.0,
        joinedAt: new Date(Date.now() - 730 * 86400000).toISOString()
      },
      {
        id: Utils.generateId(),
        name: 'Kavitha Nair',
        email: 'kavitha.env@gmail.com',
        phone: '+91 66554 33221',
        location: 'Kochi, Kerala',
        lat: 9.9312, lng: 76.2673,
        skills: ['Environmental Science', 'Mangrove Restoration', 'Water Testing', 'Research'],
        availability: 'fulltime',
        experience: 4,
        organization: 'WWF India - Kerala',
        status: 'available',
        hoursContributed: 150,
        missionsCompleted: 8,
        rating: 4.6,
        joinedAt: new Date(Date.now() - 90 * 86400000).toISOString()
      },
      {
        id: Utils.generateId(),
        name: 'Arjun Patel',
        email: 'arjun.build@gmail.com',
        phone: '+91 55443 22110',
        location: 'Ahmedabad, Gujarat',
        lat: 23.0225, lng: 72.5714,
        skills: ['Construction', 'Carpentry', 'Electrical Work', 'Project Management'],
        availability: 'weekends',
        experience: 12,
        organization: 'Habitat for Humanity Gujarat',
        status: 'available',
        hoursContributed: 420,
        missionsCompleted: 28,
        rating: 4.8,
        joinedAt: new Date(Date.now() - 400 * 86400000).toISOString()
      },
      {
        id: Utils.generateId(),
        name: 'Sunita Devi',
        email: 'sunita.health@gmail.com',
        phone: '+91 44332 11009',
        location: 'Patna, Bihar',
        lat: 25.6093, lng: 85.1376,
        skills: ['Nursing', 'Midwifery', 'Health Education', 'Hindi'],
        availability: 'parttime',
        experience: 15,
        organization: 'ASHA Worker Network',
        status: 'available',
        hoursContributed: 350,
        missionsCompleted: 40,
        rating: 4.9,
        joinedAt: new Date(Date.now() - 500 * 86400000).toISOString()
      },
      {
        id: Utils.generateId(),
        name: 'Vikram Reddy',
        email: 'vikram.tech@gmail.com',
        phone: '+91 33221 00998',
        location: 'Hyderabad, Telangana',
        lat: 17.3850, lng: 78.4867,
        skills: ['Software Development', 'Data Analysis', 'Digital Literacy', 'GIS Mapping'],
        availability: 'weekends',
        experience: 3,
        organization: 'Tech4Good India',
        status: 'available',
        hoursContributed: 90,
        missionsCompleted: 6,
        rating: 4.5,
        joinedAt: new Date(Date.now() - 60 * 86400000).toISOString()
      },
      {
        id: Utils.generateId(),
        name: 'Meera Krishnamurthy',
        email: 'meera.psych@gmail.com',
        phone: '+91 22110 99887',
        location: 'Chennai, Tamil Nadu',
        lat: 13.0827, lng: 80.2707,
        skills: ['Psychology', 'Trauma Counseling', 'Child Psychology', 'Tamil', 'English'],
        availability: 'parttime',
        experience: 7,
        organization: 'iCall Psychosocial',
        status: 'available',
        hoursContributed: 200,
        missionsCompleted: 18,
        rating: 4.9,
        joinedAt: new Date(Date.now() - 200 * 86400000).toISOString()
      },
      {
        id: Utils.generateId(),
        name: 'Gurpreet Singh',
        email: 'gurpreet.food@gmail.com',
        phone: '+91 11009 88776',
        location: 'Amritsar, Punjab',
        lat: 31.6340, lng: 74.8723,
        skills: ['Cooking', 'Food Distribution', 'Community Kitchen', 'Logistics'],
        availability: 'fulltime',
        experience: 6,
        organization: 'Khalsa Aid International',
        status: 'deployed',
        currentMission: 'Community kitchen in Wayanad',
        hoursContributed: 480,
        missionsCompleted: 30,
        rating: 5.0,
        joinedAt: new Date(Date.now() - 600 * 86400000).toISOString()
      },
      {
        id: Utils.generateId(),
        name: 'Deepika Joshi',
        email: 'deepika.edu@gmail.com',
        phone: '+91 00998 77665',
        location: 'Dehradun, Uttarakhand',
        lat: 30.3165, lng: 78.0322,
        skills: ['Teaching', 'Curriculum Design', 'Child Development', 'Hindi', 'English'],
        availability: 'fulltime',
        experience: 9,
        organization: 'Pratham Education Foundation',
        status: 'deployed',
        currentMission: 'Education recovery in Joshimath',
        hoursContributed: 380,
        missionsCompleted: 25,
        rating: 4.7,
        joinedAt: new Date(Date.now() - 300 * 86400000).toISOString()
      },
      {
        id: Utils.generateId(),
        name: 'Ravi Shankar Dubey',
        email: 'ravi.water@gmail.com',
        phone: '+91 99876 54321',
        location: 'Jaipur, Rajasthan',
        lat: 26.9124, lng: 75.7873,
        skills: ['Water Engineering', 'Sanitation', 'Well Construction', 'Water Testing'],
        availability: 'oncall',
        experience: 11,
        organization: 'WaterAid India',
        status: 'available',
        hoursContributed: 300,
        missionsCompleted: 20,
        rating: 4.8,
        joinedAt: new Date(Date.now() - 450 * 86400000).toISOString()
      }
    ];
  },

  init() {
    const stored = Utils.loadFromStorage('volunteers');
    this.volunteers = stored || this.generateDemoVolunteers();
    Utils.saveToStorage('volunteers', this.volunteers);
  },

  getAll(filter = 'all') {
    if (filter === 'available') return this.volunteers.filter(v => v.status === 'available');
    if (filter === 'deployed') return this.volunteers.filter(v => v.status === 'deployed');
    return [...this.volunteers];
  },

  getById(id) {
    return this.volunteers.find(v => v.id === id);
  },

  search(query) {
    const q = query.toLowerCase();
    return this.volunteers.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.skills.some(s => s.toLowerCase().includes(q)) ||
      v.location.toLowerCase().includes(q)
    );
  },

  addVolunteer(vol) {
    const newVol = {
      id: Utils.generateId(),
      ...vol,
      status: 'available',
      hoursContributed: 0,
      missionsCompleted: 0,
      rating: 0,
      joinedAt: new Date().toISOString()
    };
    this.volunteers.unshift(newVol);
    Utils.saveToStorage('volunteers', this.volunteers);
    return newVol;
  },

  getStats() {
    const total = this.volunteers.length;
    const available = this.volunteers.filter(v => v.status === 'available').length;
    const deployed = this.volunteers.filter(v => v.status === 'deployed').length;
    const totalHours = this.volunteers.reduce((sum, v) => sum + v.hoursContributed, 0);
    const totalMissions = this.volunteers.reduce((sum, v) => sum + v.missionsCompleted, 0);
    const avgRating = this.volunteers.reduce((sum, v) => sum + v.rating, 0) / total;

    return { total, available, deployed, totalHours, totalMissions, avgRating: avgRating.toFixed(1) };
  },

  matchVolunteersToNeed(needId) {
    const need = NeedsManager.getNeedById(needId);
    if (!need) return [];

    const available = this.getAll('available');
    const categorySkillMap = {
      healthcare: ['Medical', 'First Aid', 'Nursing', 'Surgery', 'Psychology', 'Health Education', 'Midwifery', 'Trauma Counseling'],
      education: ['Teaching', 'Curriculum Design', 'Child Development', 'Digital Literacy', 'Tutoring'],
      disaster: ['Disaster Relief', 'Rescue Operations', 'Swimming', 'Boat Navigation', 'Emergency Response'],
      environment: ['Environmental Science', 'Mangrove Restoration', 'Water Testing', 'Research'],
      shelter: ['Construction', 'Carpentry', 'Electrical Work', 'Project Management'],
      food: ['Cooking', 'Food Distribution', 'Community Kitchen', 'Water Engineering', 'Sanitation'],
      livelihood: ['Software Development', 'Data Analysis', 'Digital Literacy', 'Community Organizing']
    };

    const relevantSkills = categorySkillMap[need.category] || [];

    return available.map(vol => {
      let score = 0;

      // Skill match (0-50)
      const skillMatches = vol.skills.filter(s => 
        relevantSkills.some(rs => rs.toLowerCase() === s.toLowerCase())
      ).length;
      score += Math.min(skillMatches * 15, 50);

      // Experience score (0-20)
      score += Math.min(vol.experience * 2, 20);

      // Rating score (0-15)
      score += Math.round(vol.rating * 3);

      // Availability bonus (0-15)
      if (vol.availability === 'fulltime') score += 15;
      else if (vol.availability === 'oncall') score += 12;
      else if (vol.availability === 'parttime') score += 8;
      else score += 5;

      return { ...vol, matchScore: Math.min(score, 100) };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
  },

  openRegisterModal() {
    ImpactBridge.ui.openModal('modal-register-volunteer');
  },

  openMatchModal() {
    const select = document.getElementById('match-need-select');
    select.innerHTML = NeedsManager.getAllNeeds().map(n => {
      const pri = Utils.priorityConfig[n.priority];
      return `<option value="${n.id}">${pri.icon} ${n.title.substring(0, 60)}${n.title.length > 60 ? '...' : ''}</option>`;
    }).join('');
    document.getElementById('match-results').classList.add('hidden');
    ImpactBridge.ui.openModal('modal-ai-match');
  },

  registerVolunteer(event) {
    event.preventDefault();

    const vol = {
      name: document.getElementById('vol-name').value,
      email: document.getElementById('vol-email').value,
      phone: document.getElementById('vol-phone').value,
      location: document.getElementById('vol-location').value,
      skills: document.getElementById('vol-skills').value.split(',').map(s => s.trim()).filter(Boolean),
      availability: document.getElementById('vol-availability').value,
      experience: parseInt(document.getElementById('vol-experience').value) || 0,
      organization: document.getElementById('vol-org').value,
      lat: 20 + Math.random() * 10,
      lng: 75 + Math.random() * 15
    };

    this.addVolunteer(vol);
    ImpactBridge.ui.closeModal('modal-register-volunteer');
    document.getElementById('volunteer-form').reset();
    ImpactBridge.ui.showToast('success', 'Volunteer Registered! 🎉', `${vol.name} has been added to the volunteer network.`);
    ActivityLog.add('volunteer', `${vol.name} registered as volunteer (${vol.skills[0]})`);

    if (ImpactBridge.currentView === 'volunteers') this.renderVolunteersGrid();
  },

  async runAIMatch() {
    const needId = document.getElementById('match-need-select').value;
    if (!needId) {
      ImpactBridge.ui.showToast('warning', 'Select a Need', 'Please select a community need to match volunteers against.');
      return;
    }

    const need = NeedsManager.getNeedById(needId);
    const resultsContainer = document.getElementById('match-results');
    const resultsList = document.getElementById('match-results-list');
    
    resultsContainer.classList.remove('hidden');
    resultsList.innerHTML = '<div class="flex-center" style="padding:24px"><div class="loading-spinner"></div></div>';

    await Utils.sleep(1500);

    const matches = this.matchVolunteersToNeed(needId);

    if (matches.length === 0) {
      resultsList.innerHTML = `<div class="empty-state" style="padding:24px"><p>No matching volunteers found. Try adjusting the need or adding more volunteers.</p></div>`;
      return;
    }

    const gradientColors = ['var(--primary-400)', 'var(--cyan-400)', 'var(--accent-400)', 'var(--amber-400)', 'var(--red-400)'];

    resultsList.innerHTML = matches.map((vol, i) => `
      <div class="glass-card volunteer-card" style="animation:fadeInUp 0.4s ease ${i * 0.1}s forwards;opacity:0">
        <div class="volunteer-avatar" style="background:${gradientColors[i] || gradientColors[0]};color:var(--bg-primary)">
          ${vol.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </div>
        <div class="volunteer-info">
          <div class="volunteer-name">${vol.name}</div>
          <div class="volunteer-location">📍 ${vol.location} | ${Utils.availabilityLabels[vol.availability]}</div>
          <div class="volunteer-skills">
            ${vol.skills.slice(0, 4).map(s => `<span class="skill-tag">${s}</span>`).join('')}
          </div>
        </div>
        <div class="volunteer-match-score">
          <div class="match-score-value">${vol.matchScore}%</div>
          <div class="match-score-label">Match</div>
        </div>
      </div>
    `).join('');

    ImpactBridge.ui.showToast('success', '🧠 AI Matching Complete', `Found ${matches.length} volunteers matching "${need.title.substring(0, 30)}..."`);
    ActivityLog.add('match', `AI matched ${matches.length} volunteers to "${need.title.substring(0, 40)}"`);
  },

  renderVolunteersGrid(filter = 'all', searchQuery = '') {
    const grid = document.getElementById('volunteers-grid');
    let vols = this.getAll(filter);
    
    if (searchQuery) {
      vols = this.search(searchQuery);
    }

    const gradientColors = [
      'linear-gradient(135deg, #10b981, #06b6d4)',
      'linear-gradient(135deg, #8b5cf6, #06b6d4)',
      'linear-gradient(135deg, #f59e0b, #ef4444)',
      'linear-gradient(135deg, #06b6d4, #3b82f6)',
      'linear-gradient(135deg, #ec4899, #8b5cf6)',
      'linear-gradient(135deg, #14b8a6, #22d3ee)',
    ];

    grid.innerHTML = vols.map((vol, i) => `
      <div class="glass-card volunteer-card" style="flex-direction:column;align-items:center;text-align:center;padding:var(--space-6)">
        <div class="volunteer-avatar" style="background:${gradientColors[i % gradientColors.length]};color:white;width:56px;height:56px;font-size:var(--text-xl);margin-bottom:var(--space-3)">
          ${vol.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </div>
        <div class="volunteer-name" style="margin-bottom:2px">${vol.name}</div>
        <div class="volunteer-location" style="margin-bottom:var(--space-3)">📍 ${vol.location}</div>
        <div class="volunteer-skills" style="justify-content:center;margin-bottom:var(--space-3)">
          ${vol.skills.slice(0, 3).map(s => `<span class="skill-tag">${s}</span>`).join('')}
          ${vol.skills.length > 3 ? `<span class="skill-tag" style="opacity:0.6">+${vol.skills.length - 3}</span>` : ''}
        </div>
        <div style="display:flex;gap:var(--space-4);font-size:var(--text-xs);color:var(--text-tertiary);margin-bottom:var(--space-3)">
          <span>⏱️ ${vol.hoursContributed}h</span>
          <span>✅ ${vol.missionsCompleted} missions</span>
          <span>⭐ ${vol.rating}</span>
        </div>
        <div style="margin-bottom:var(--space-3)">
          ${vol.status === 'available' 
            ? '<span class="badge badge-primary"><span class="status-dot-active" style="width:6px;height:6px"></span> Available</span>'
            : `<span class="badge badge-warning">🔄 Deployed</span>`
          }
        </div>
        <span style="font-size:var(--text-xs);color:var(--text-muted)">${Utils.availabilityLabels[vol.availability]} • ${vol.experience}yr exp</span>
      </div>
    `).join('');

    this.renderVolunteerStats();

    this.setupVolunteerTabs();
    this.setupVolunteerSearch();
  },

  renderVolunteerStats() {
    const stats = this.getStats();
    const container = document.getElementById('volunteer-stats');
    if (!container) return;

    container.innerHTML = `
      <div class="glass-card stat-card no-hover">
        <div class="stat-header">
          <div class="stat-icon emerald">👥</div>
        </div>
        <div class="stat-value">${stats.total}</div>
        <div class="stat-label">Total Volunteers</div>
      </div>
      <div class="glass-card stat-card no-hover">
        <div class="stat-header">
          <div class="stat-icon cyan">✅</div>
        </div>
        <div class="stat-value">${stats.available}</div>
        <div class="stat-label">Available Now</div>
      </div>
      <div class="glass-card stat-card no-hover">
        <div class="stat-header">
          <div class="stat-icon violet">🚀</div>
        </div>
        <div class="stat-value">${stats.deployed}</div>
        <div class="stat-label">Currently Deployed</div>
      </div>
      <div class="glass-card stat-card no-hover">
        <div class="stat-header">
          <div class="stat-icon amber">⭐</div>
        </div>
        <div class="stat-value">${stats.avgRating}</div>
        <div class="stat-label">Avg Rating</div>
      </div>
    `;
  },

  setupVolunteerTabs() {
    document.querySelectorAll('#volunteer-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#volunteer-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderVolunteersGrid(btn.dataset.tab);
      });
    });
  },

  setupVolunteerSearch() {
    const searchInput = document.getElementById('volunteer-search');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        const query = e.target.value.trim();
        this.renderVolunteersGrid('all', query);
      }, 300));
    }
  }
};
