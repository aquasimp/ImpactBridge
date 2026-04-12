const Analytics = {
  charts: {},

  render() {
    this.renderStats();
    this.renderCategoryNeedsChart();
    this.renderVolunteerFulfillmentChart();
    this.renderRegionChart();
    this.renderSkillsChart();
  },

  renderStats() {
    const container = document.getElementById('analytics-stats');
    if (!container) return;

    const volStats = VolunteerManager.getStats();
    const needStats = NeedsManager.getStats();
    const fulfillment = needStats.totalVolunteersNeeded > 0
      ? Math.round((needStats.totalVolunteersAssigned / needStats.totalVolunteersNeeded) * 100)
      : 0;

    container.innerHTML = `
      <div class="glass-card stat-card no-hover">
        <div class="stat-header">
          <div class="stat-icon emerald">🚀</div>
        </div>
        <div class="stat-value">${volStats.totalMissions}</div>
        <div class="stat-label">Missions Completed</div>
      </div>
      <div class="glass-card stat-card no-hover">
        <div class="stat-header">
          <div class="stat-icon cyan">⏱️</div>
        </div>
        <div class="stat-value">${Utils.formatNumber(volStats.totalHours)}</div>
        <div class="stat-label">Hours Contributed</div>
      </div>
      <div class="glass-card stat-card no-hover">
        <div class="stat-header">
          <div class="stat-icon violet">🎯</div>
        </div>
        <div class="stat-value">${fulfillment}%</div>
        <div class="stat-label">Volunteer Fulfillment</div>
      </div>
      <div class="glass-card stat-card no-hover">
        <div class="stat-header">
          <div class="stat-icon amber">⭐</div>
        </div>
        <div class="stat-value">${volStats.avgRating}</div>
        <div class="stat-label">Avg Volunteer Rating</div>
      </div>
    `;
  },

  renderCategoryNeedsChart() {
    const canvas = document.getElementById('deployment-chart');
    if (!canvas) return;

    if (this.charts.deployment) this.charts.deployment.destroy();

    const needs = NeedsManager.getAllNeeds();
    const breakdown = NeedsManager.getCategoryBreakdown();
    const categories = Object.keys(breakdown);
    const catLabels = categories.map(c => c.charAt(0).toUpperCase() + c.slice(1));

    // Compute actual volunteer assignment per category
    const assigned = categories.map(cat => 
      needs.filter(n => n.category === cat).reduce((sum, n) => sum + n.volunteersAssigned, 0)
    );
    const needed = categories.map(cat =>
      needs.filter(n => n.category === cat).reduce((sum, n) => sum + n.volunteersNeeded, 0)
    );

    const defaults = Utils.getChartDefaults();

    this.charts.deployment = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: catLabels,
        datasets: [
          {
            label: 'Volunteers Needed',
            data: needed,
            backgroundColor: 'rgba(245,158,11,0.4)',
            borderColor: '#f59e0b',
            borderWidth: 1.5,
            borderRadius: 6,
          },
          {
            label: 'Volunteers Assigned',
            data: assigned,
            backgroundColor: 'rgba(16,185,129,0.5)',
            borderColor: '#10b981',
            borderWidth: 1.5,
            borderRadius: 6,
          }
        ]
      },
      options: {
        ...defaults,
        plugins: {
          ...defaults.plugins,
          legend: {
            display: true, position: 'bottom',
            labels: { color: '#94a3b8', font: { family: "'Inter', sans-serif", size: 11 }, padding: 16, usePointStyle: true }
          }
        },
        scales: {
          ...defaults.scales,
          y: { ...defaults.scales.y, beginAtZero: true }
        }
      }
    });
  },

  renderVolunteerFulfillmentChart() {
    const canvas = document.getElementById('response-chart');
    if (!canvas) return;

    if (this.charts.response) this.charts.response.destroy();

    const needs = NeedsManager.getAllNeeds();
    const priorities = ['critical', 'high', 'medium', 'low'];
    const priLabels = priorities.map(p => p.charAt(0).toUpperCase() + p.slice(1));
    const priCounts = priorities.map(p => needs.filter(n => n.priority === p).length);
    const priAffected = priorities.map(p => 
      needs.filter(n => n.priority === p).reduce((s, n) => s + n.affected, 0)
    );

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 280);
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');

    const defaults = Utils.getChartDefaults();

    this.charts.response = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: priLabels,
        datasets: [
          {
            label: 'Needs Count',
            data: priCounts,
            backgroundColor: ['rgba(239,68,68,0.5)', 'rgba(245,158,11,0.5)', 'rgba(6,182,212,0.5)', 'rgba(16,185,129,0.5)'],
            borderColor: ['#ef4444', '#f59e0b', '#06b6d4', '#10b981'],
            borderWidth: 1.5,
            borderRadius: 6,
            yAxisID: 'y',
          },
          {
            label: 'People Affected',
            data: priAffected,
            type: 'line',
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139,92,246,0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#8b5cf6',
            yAxisID: 'y1',
          }
        ]
      },
      options: {
        ...defaults,
        plugins: {
          ...defaults.plugins,
          legend: {
            display: true, position: 'bottom',
            labels: { color: '#94a3b8', font: { family: "'Inter', sans-serif", size: 11 }, padding: 16, usePointStyle: true }
          }
        },
        scales: {
          x: defaults.scales.x,
          y: { ...defaults.scales.y, beginAtZero: true, position: 'left' },
          y1: { ...defaults.scales.y, beginAtZero: true, position: 'right', grid: { drawOnChartArea: false } }
        }
      }
    });
  },

  renderRegionChart() {
    const canvas = document.getElementById('region-chart');
    if (!canvas) return;

    if (this.charts.region) this.charts.region.destroy();

    const needs = NeedsManager.getAllNeeds();
    
    // extract state from "City, State" format
    const stateCount = {};
    const stateAffected = {};
    needs.forEach(n => {
      const parts = n.location.split(',');
      const state = (parts[parts.length - 1] || '').trim();
      if (state) {
        stateCount[state] = (stateCount[state] || 0) + 1;
        stateAffected[state] = (stateAffected[state] || 0) + n.affected;
      }
    });

    const states = Object.keys(stateCount).sort((a, b) => stateCount[b] - stateCount[a]);
    const defaults = Utils.getChartDefaults();

    this.charts.region = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: states,
        datasets: [
          {
            label: 'Needs',
            data: states.map(s => stateCount[s]),
            backgroundColor: 'rgba(6,182,212,0.5)',
            borderColor: '#06b6d4',
            borderWidth: 1.5,
            borderRadius: 4,
          },
          {
            label: 'Affected (hundreds)',
            data: states.map(s => Math.round(stateAffected[s] / 100)),
            backgroundColor: 'rgba(245,158,11,0.4)',
            borderColor: '#f59e0b',
            borderWidth: 1.5,
            borderRadius: 4,
          }
        ]
      },
      options: {
        ...defaults,
        indexAxis: 'y',
        plugins: {
          ...defaults.plugins,
          legend: {
            display: true, position: 'bottom',
            labels: { color: '#94a3b8', font: { family: "'Inter', sans-serif", size: 11 }, padding: 16, usePointStyle: true }
          }
        },
        scales: {
          x: { ...defaults.scales.x, beginAtZero: true },
          y: { ...defaults.scales.y }
        }
      }
    });
  },

  renderSkillsChart() {
    const canvas = document.getElementById('skills-chart');
    if (!canvas) return;

    if (this.charts.skills) this.charts.skills.destroy();

    const vols = VolunteerManager.getAll();

    const skillAreas = {};
    vols.forEach(v => {
      v.skills.forEach(skill => {
        skillAreas[skill] = (skillAreas[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillAreas)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const skillLabels = topSkills.map(s => s[0]);
    const skillCounts = topSkills.map(s => s[1]);

    const needs = NeedsManager.getAllNeeds();
    const catSkillDemand = {
      'Medical': needs.filter(n => n.category === 'healthcare').length,
      'First Aid': needs.filter(n => n.category === 'healthcare' || n.category === 'disaster').length,
      'Teaching': needs.filter(n => n.category === 'education').length,
      'Cooking': needs.filter(n => n.category === 'food').length,
      'Construction': needs.filter(n => n.category === 'shelter').length,
      'Environmental Science': needs.filter(n => n.category === 'environment').length,
      'Logistics': needs.filter(n => n.category === 'disaster' || n.category === 'food').length,
      'Counseling': needs.filter(n => n.category === 'healthcare').length,
      'Software Development': needs.filter(n => n.category === 'livelihood').length,
      'Disaster Relief': needs.filter(n => n.category === 'disaster').length,
    };

    const demandValues = skillLabels.map(s => catSkillDemand[s] || 1);

    const defaults = Utils.getChartDefaults();

    this.charts.skills = new Chart(canvas.getContext('2d'), {
      type: 'radar',
      data: {
        labels: skillLabels,
        datasets: [
          {
            label: 'Volunteers with Skill',
            data: skillCounts,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#10b981',
            pointRadius: 3,
          },
          {
            label: 'Demand (# needs)',
            data: demandValues,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.08)',
            borderWidth: 2,
            pointBackgroundColor: '#f59e0b',
            pointRadius: 3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true, position: 'bottom',
            labels: { color: '#94a3b8', font: { family: "'Inter', sans-serif", size: 11 }, padding: 16, usePointStyle: true }
          },
          tooltip: defaults.plugins.tooltip
        },
        scales: {
          r: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            angleLines: { color: 'rgba(255,255,255,0.04)' },
            pointLabels: { color: '#94a3b8', font: { family: "'Inter', sans-serif", size: 10 } },
            ticks: { color: '#64748b', backdropColor: 'transparent', font: { size: 9 } }
          }
        }
      }
    });
  },

  async generateReport() {
    const contentEl = document.getElementById('ai-report-content');
    if (!contentEl) return;

    contentEl.innerHTML = '<div class="flex-center" style="padding:32px"><div class="loading-spinner"></div><p style="margin-left:16px;color:var(--text-secondary)">Gemini AI is analyzing platform data...</p></div>';

    const prompt = `Generate a comprehensive impact report. Analyse the real platform data I've provided in the system context. Include:
1. Executive Summary
2. Key achievements
3. Critical gaps and areas needing immediate attention
4. Skill gap analysis
5. Geographic coverage assessment
6. Specific actionable recommendations

Format with ## headers and bullet points. Be specific — reference actual needs and volunteers from the data.`;

    const report = await GeminiAI.callGemini(prompt);
    contentEl.innerHTML = GeminiAI.formatMarkdown(report);

    ImpactBridge.ui.showToast('success', '📊 Report Generated', 'Impact report generated from platform data.');
    ActivityLog.add('ai', 'Impact report generated');
  },

  exportData() {
    const needs = NeedsManager.getAllNeeds();
    const vols = VolunteerManager.getAll();

    const exportData = {
      exportedAt: new Date().toISOString(),
      platform: 'ImpactBridge',
      summary: {
        needs: NeedsManager.getStats(),
        volunteers: VolunteerManager.getStats()
      },
      needs,
      volunteers: vols,
      activityLog: ActivityLog.getRecent(20)
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `impactbridge-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    ImpactBridge.ui.showToast('success', '📥 Data Exported', 'Full dataset exported as JSON.');
    ActivityLog.add('export', 'Platform data exported to JSON');
  }
};
