const ActivityLog = {
  activities: [],
  maxEntries: 50,

  init() {
    this.activities = Utils.loadFromStorage('activity_log') || [];
    

    if (this.activities.length === 0) {
      this.seedFromRealData();
    }
  },

  seedFromRealData() {
    const needs = NeedsManager.getAllNeeds();
    const vols = VolunteerManager.getAll();

    needs.forEach(need => {
      const cat = Utils.categoryColors[need.category] || { icon: '📋' };
      this.activities.push({
        type: 'need',
        text: `<strong>Need reported:</strong> ${need.title.substring(0, 50)}${need.title.length > 50 ? '...' : ''}`,
        timestamp: new Date(need.createdAt).getTime(),
        color: need.priority === 'critical' ? '#ef4444' : need.priority === 'high' ? '#f59e0b' : '#06b6d4'
      });
    });

    vols.forEach(vol => {
      this.activities.push({
        type: 'volunteer',
        text: `<strong>${vol.name}</strong> joined as volunteer (${vol.skills[0]})`,
        timestamp: new Date(vol.joinedAt).getTime(),
        color: '#10b981'
      });
    });

    vols.filter(v => v.status === 'deployed').forEach(vol => {
      this.activities.push({
        type: 'deploy',
        text: `<strong>${vol.name}</strong> deployed: ${vol.currentMission || 'Active mission'}`,
        timestamp: Date.now() - Math.random() * 24 * 3600000,
        color: '#fbbf24'
      });
    });

    this.activities.sort((a, b) => b.timestamp - a.timestamp);
    this.save();
  },

  add(type, text) {
    const colors = {
      need: '#ef4444',
      volunteer: '#10b981',
      match: '#8b5cf6',
      deploy: '#fbbf24',
      resolve: '#06b6d4',
      ai: '#a78bfa',
      export: '#06b6d4'
    };

    this.activities.unshift({
      type,
      text: `<strong>${type === 'ai' ? 'AI:' : ''}</strong> ${text}`,
      timestamp: Date.now(),
      color: colors[type] || '#94a3b8'
    });

    if (this.activities.length > this.maxEntries) {
      this.activities = this.activities.slice(0, this.maxEntries);
    }

    this.save();
    this.renderFeed();
  },

  save() {
    Utils.saveToStorage('activity_log', this.activities);
  },

  getRecent(count = 10) {
    return this.activities.slice(0, count);
  },

  renderFeed() {
    const container = document.getElementById('activity-feed');
    if (!container) return;

    const recent = this.getRecent(10);
    
    if (recent.length === 0) {
      container.innerHTML = '<p style="font-size:var(--text-xs);color:var(--text-muted);text-align:center;padding:16px">No activity yet. Submit a need or register a volunteer to see events here.</p>';
      return;
    }

    container.innerHTML = recent.map(act => `
      <div class="activity-item">
        <div class="activity-dot" style="background:${act.color}"></div>
        <div>
          <div class="activity-text">${act.text}</div>
          <div class="activity-time">${Utils.timeAgo(new Date(act.timestamp).toISOString())}</div>
        </div>
      </div>
    `).join('');
  }
};
