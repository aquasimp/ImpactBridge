const Dashboard = {
  charts: {},

  render() {
    this.renderStats();
    this.renderNeedsChart();
    this.renderCategoryChart();
    NeedsManager.renderUrgentNeedsList();
    ActivityLog.renderFeed();
  },

  renderStats() {
    const container = document.getElementById('dashboard-stats');
    if (!container) return;

    const needStats = NeedsManager.getStats();
    const volStats = VolunteerManager.getStats();
    const fulfillment = needStats.totalVolunteersNeeded > 0
      ? Math.round((needStats.totalVolunteersAssigned / needStats.totalVolunteersNeeded) * 100)
      : 0;

    container.innerHTML = `
      <div class="glass-card stat-card no-hover">
        <div class="stat-header">
          <div class="stat-icon emerald">📋</div>
        </div>
        <div class="stat-value">${needStats.total}</div>
        <div class="stat-label">Active Needs</div>
      </div>
      <div class="glass-card stat-card no-hover">
        <div class="stat-header">
          <div class="stat-icon red">🚨</div>
        </div>
        <div class="stat-value">${needStats.critical}</div>
        <div class="stat-label">Critical Needs</div>
      </div>
      <div class="glass-card stat-card no-hover">
        <div class="stat-header">
          <div class="stat-icon cyan">👥</div>
          <span class="stat-trend ${volStats.available > volStats.deployed ? 'up' : 'down'}">${volStats.available} available</span>
        </div>
        <div class="stat-value">${volStats.total}</div>
        <div class="stat-label">Total Volunteers</div>
      </div>
      <div class="glass-card stat-card no-hover">
        <div class="stat-header">
          <div class="stat-icon violet">🎯</div>
          <span class="stat-trend ${fulfillment >= 50 ? 'up' : 'down'}">${fulfillment}% filled</span>
        </div>
        <div class="stat-value">${Utils.formatNumber(needStats.totalAffected)}</div>
        <div class="stat-label">People Affected</div>
      </div>
    `;
  },

  renderNeedsChart() {
    const canvas = document.getElementById('needs-chart');
    if (!canvas) return;

    if (this.charts.needs) this.charts.needs.destroy();

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 280);
    gradient2.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
    gradient2.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

    const chartData = this.computeNeedsOverTime('week');
    const defaults = Utils.getChartDefaults();

    this.charts.needs = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Needs Reported',
            data: chartData.reported,
            borderColor: '#10b981',
            backgroundColor: gradient,
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#0a0f1e',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Volunteer Slots Filled',
            data: chartData.filled,
            borderColor: '#06b6d4',
            backgroundColor: gradient2,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#0a0f1e',
            pointBorderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            borderDash: [5, 5],
          }
        ]
      },
      options: {
        ...defaults,
        plugins: {
          ...defaults.plugins,
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              font: { family: "'Inter', sans-serif", size: 11 },
              padding: 20,
              usePointStyle: true,
              pointStyleWidth: 10,
            }
          }
        },
        interaction: { intersect: false, mode: 'index' }
      }
    });

    document.querySelectorAll('[data-period]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const newData = this.computeNeedsOverTime(btn.dataset.period);
        this.charts.needs.data.labels = newData.labels;
        this.charts.needs.data.datasets[0].data = newData.reported;
        this.charts.needs.data.datasets[1].data = newData.filled;
        this.charts.needs.update('active');
      });
    });
  },

  computeNeedsOverTime(period) {
    const needs = NeedsManager.getAllNeeds();
    const now = Date.now();

    if (period === 'week') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const labels = [];
      const reported = [];
      const filled = [];

      for (let i = 6; i >= 0; i--) {
        const day = new Date(now - i * 86400000);
        labels.push(days[day.getDay()]);
        const dayNeeds = needs.filter(n => {
          const created = new Date(n.createdAt);
          return created.toDateString() === day.toDateString();
        });
        reported.push(dayNeeds.length);
        filled.push(dayNeeds.reduce((sum, n) => sum + n.volunteersAssigned, 0));
      }
      return { labels, reported, filled };
    }

    if (period === 'month') {
      const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const reported = [0, 0, 0, 0];
      const filled = [0, 0, 0, 0];

      needs.forEach(n => {
        const age = (now - new Date(n.createdAt).getTime()) / 86400000;
        if (age <= 7) { reported[3]++; filled[3] += n.volunteersAssigned; }
        else if (age <= 14) { reported[2]++; filled[2] += n.volunteersAssigned; }
        else if (age <= 21) { reported[1]++; filled[1] += n.volunteersAssigned; }
        else { reported[0]++; filled[0] += n.volunteersAssigned; }
      });
      return { labels, reported, filled };
    }

    // Year — distribute by category instead
    const categories = NeedsManager.getCategoryBreakdown();
    return {
      labels: Object.keys(categories).map(c => c.charAt(0).toUpperCase() + c.slice(1)),
      reported: Object.values(categories),
      filled: Object.keys(categories).map(cat => {
        return needs.filter(n => n.category === cat).reduce((s, n) => s + n.volunteersAssigned, 0);
      })
    };
  },

  renderCategoryChart() {
    const canvas = document.getElementById('category-chart');
    if (!canvas) return;

    if (this.charts.category) this.charts.category.destroy();

    const breakdown = NeedsManager.getCategoryBreakdown();
    const categories = Object.keys(breakdown);
    const values = Object.values(breakdown);
    const colors = categories.map(c => {
      const config = Utils.categoryColors[c];
      return config ? config.text : '#94a3b8';
    });
    const icons = categories.map(c => {
      const config = Utils.categoryColors[c];
      return config ? config.icon : '📋';
    });

    const defaults = Utils.getChartDefaults();

    this.charts.category = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: categories.map((c, i) => `${icons[i]} ${c.charAt(0).toUpperCase() + c.slice(1)}`),
        datasets: [{
          data: values,
          backgroundColor: colors.map(c => c + '30'),
          borderColor: colors,
          borderWidth: 2,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              color: '#94a3b8',
              font: { family: "'Inter', sans-serif", size: 11 },
              padding: 12,
              usePointStyle: true,
            }
          },
          tooltip: defaults.plugins.tooltip
        }
      }
    });
  }
};
