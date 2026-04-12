
const GeminiAI = {
  API_KEY: '',
  API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  chatOpen: false,


  buildSystemContext() {
    const needs = NeedsManager.getAllNeeds();
    const vols = VolunteerManager.getAll();
    const needStats = NeedsManager.getStats();
    const volStats = VolunteerManager.getStats();

    const needsSummary = needs.map(n => 
      `- "${n.title}" | ${n.category} | Priority: ${n.priority} | Location: ${n.location} | Affected: ${n.affected} | Volunteers: ${n.volunteersAssigned}/${n.volunteersNeeded}`
    ).join('\n');

    const volsSummary = vols.map(v =>
      `- ${v.name} | Skills: ${v.skills.join(', ')} | Location: ${v.location} | Status: ${v.status} | Availability: ${v.availability} | Experience: ${v.experience}yr | Rating: ${v.rating}`
    ).join('\n');

    return `You are ImpactBridge AI, a volunteer coordination assistant. You have access to REAL platform data below. ALWAYS use this actual data in your responses — never make up information.

PLATFORM STATS:
- Total active needs: ${needStats.total}
- Critical needs: ${needStats.critical}
- Total volunteers: ${volStats.total}
- Available volunteers: ${volStats.available}
- Deployed volunteers: ${volStats.deployed}
- Total hours contributed: ${volStats.totalHours}
- Missions completed: ${volStats.totalMissions}
- People affected: ${needStats.totalAffected}

ACTIVE COMMUNITY NEEDS:
${needsSummary}

REGISTERED VOLUNTEERS:
${volsSummary}

RULES:
- Always reference REAL data from above
- When matching volunteers, use the actual volunteer names, skills, and locations listed
- When discussing needs, use actual need titles and locations
- Be concise, use markdown formatting with ## headers and **bold**
- Provide actionable recommendations`;
  },

  async callGemini(prompt, additionalContext = '') {
    const systemContext = this.buildSystemContext();
    const fullContext = additionalContext ? `${systemContext}\n\n${additionalContext}` : systemContext;

    if (this.API_KEY && this.API_KEY !== '') {
      try {
        const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `${fullContext}\n\nUSER REQUEST: ${prompt}` }]
            }],
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
              maxOutputTokens: 2048
            }
          })
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
      } catch (e) {
        console.warn('Gemini API call failed:', e);
        return this.buildLocalResponse(prompt);
      }
    }


    await Utils.sleep(600 + Math.random() * 800);
    return this.buildLocalResponse(prompt);
  },

  buildLocalResponse(prompt) {
    const lower = prompt.toLowerCase();
    const needs = NeedsManager.getAllNeeds();
    const vols = VolunteerManager.getAll();
    const needStats = NeedsManager.getStats();
    const volStats = VolunteerManager.getStats();


    if (lower.includes('volunteer') && (lower.includes('find') || lower.includes('match') || lower.includes('need'))) {
      const available = vols.filter(v => v.status === 'available');
      const topVols = available.slice(0, 3);
      const volList = topVols.map((v, i) => 
        `${i + 1}. **${v.name}** (${v.location})\n   - Skills: ${v.skills.slice(0, 4).join(', ')}\n   - Availability: ${Utils.availabilityLabels[v.availability]}\n   - Experience: ${v.experience} years | Rating: ${v.rating}/5\n   - Hours contributed: ${v.hoursContributed}`
      ).join('\n\n');

      return `## 🎯 Volunteer Matching Results\n\nFound **${available.length} available volunteers** in the platform. Top matches:\n\n${volList}\n\n**Recommendation:** Based on skills and experience, ${topVols[0]?.name || 'the top volunteer'} is the strongest match for immediate deployment.\n\n*Add a Gemini API key for AI-powered skill matching with scoring.*`;
    }


    if (lower.includes('urgent') || lower.includes('priority') || lower.includes('critical')) {
      const critical = needs.filter(n => n.priority === 'critical');
      const high = needs.filter(n => n.priority === 'high');
      const critList = critical.map((n, i) => 
        `${i + 1}. **🔴 ${n.title}**\n   - Location: ${n.location}\n   - Affected: ${Utils.formatNumber(n.affected)} people\n   - Volunteers: ${n.volunteersAssigned}/${n.volunteersNeeded} (need ${n.volunteersNeeded - n.volunteersAssigned} more)\n   - Reported: ${Utils.timeAgo(n.createdAt)}`
      ).join('\n\n');
      const highList = high.slice(0, 2).map((n, i) =>
        `${i + 1}. **🟠 ${n.title}**\n   - ${n.location} | ${Utils.formatNumber(n.affected)} affected | ${n.volunteersAssigned}/${n.volunteersNeeded} volunteers`
      ).join('\n');

      return `## 🚨 Current Urgent Needs\n\n**${critical.length} critical** and **${high.length} high priority** needs across the platform.\n\n### Critical Needs\n${critList}\n\n### High Priority\n${highList}\n\n**Gap Analysis:** ${needStats.totalVolunteersNeeded - needStats.totalVolunteersAssigned} more volunteers needed across all active needs.`;
    }


    if (lower.includes('report') || lower.includes('impact') || lower.includes('summary') || lower.includes('analys')) {
      const categories = NeedsManager.getCategoryBreakdown();
      const catLines = Object.entries(categories).map(([cat, count]) =>
        `| ${cat.charAt(0).toUpperCase() + cat.slice(1)} | ${count} |`
      ).join('\n');

      const fulfillment = needStats.totalVolunteersNeeded > 0 
        ? Math.round((needStats.totalVolunteersAssigned / needStats.totalVolunteersNeeded) * 100) 
        : 0;

      return `## 📊 Platform Impact Summary\n**Generated from live platform data**\n\n### Key Metrics\n- **${needStats.total}** active community needs tracked\n- **${needStats.critical}** critical needs requiring immediate action\n- **${volStats.total}** registered volunteers\n- **${volStats.deployed}** currently deployed in the field\n- **${Utils.formatNumber(volStats.totalHours)}** total hours contributed\n- **${volStats.totalMissions}** missions completed\n- **${Utils.formatNumber(needStats.totalAffected)}** people in affected communities\n\n### Volunteer Fulfillment: ${fulfillment}%\n${needStats.totalVolunteersAssigned} of ${needStats.totalVolunteersNeeded} volunteer slots filled.\n\n### Needs by Category\n| Category | Count |\n|----------|-------|\n${catLines}\n\n### Gaps Identified\n- **${needStats.totalVolunteersNeeded - needStats.totalVolunteersAssigned} volunteer slots** remain unfilled\n- **${needStats.critical} critical needs** still active\n- Average volunteer rating: **${volStats.avgRating}/5**\n\n*For a full AI-generated report with recommendations, add your Gemini API key.*`;
    }


    if (lower.includes('parse') || lower.includes('extract') || lower.includes('field') || lower.includes('survey')) {
      return `## 📋 Field Report Parser\n\nTo parse a field report, use the **"AI Parse Report"** button on the **Needs** page. Paste your report text and I'll extract:\n\n- **Title** and **Category** classification\n- **Priority Level** assessment\n- **Location** and geo-coordinates\n- **Affected population** count\n- **Specific requirements** broken down\n- **Urgency Score** (0-10)\n\nThis feature works best with a **Gemini API key** for accurate NLP extraction.\n\n**Current platform status:** ${needStats.total} needs tracked, ${needStats.critical} critical.`;
    }


    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('help')) {
      return `Hello! 👋 I'm ImpactBridge AI. I have access to **${needStats.total} active needs** and **${volStats.total} volunteers** on this platform.\n\nHere's what I can do:\n\n• **"Show urgent needs"** — I'll list critical needs from the platform\n• **"Find available volunteers"** — I'll search the volunteer database\n• **"Generate impact report"** — I'll analyze platform metrics\n• **"What are the biggest gaps?"** — I'll identify where help is needed most\n\n💡 **Tip:** Add a Gemini API key in \`js/gemini.js\` for full AI-powered responses.\n\nWhat would you like to know?`;
    }


    return `Based on the current platform data:\n\n**Active Needs:** ${needStats.total} (${needStats.critical} critical)\n**Volunteers:** ${volStats.total} registered (${volStats.available} available, ${volStats.deployed} deployed)\n**People Affected:** ${Utils.formatNumber(needStats.totalAffected)}\n**Hours Contributed:** ${Utils.formatNumber(volStats.totalHours)}\n\nTry asking:\n- "Show me urgent needs"\n- "Find volunteers for medical help"\n- "Generate an impact report"\n\n*For advanced AI responses, set your Gemini API key in js/gemini.js*`;
  },


  toggleChat() {
    this.chatOpen = !this.chatOpen;
    document.getElementById('ai-chat-panel').classList.toggle('open', this.chatOpen);
    document.getElementById('ai-chat-fab').classList.toggle('hidden', this.chatOpen);
  },

  openChat() {
    this.chatOpen = true;
    document.getElementById('ai-chat-panel').classList.add('open');
    document.getElementById('ai-chat-fab').classList.add('hidden');
    document.getElementById('ai-chat-input-field').focus();
  },

  closeChat() {
    this.chatOpen = false;
    document.getElementById('ai-chat-panel').classList.remove('open');
    document.getElementById('ai-chat-fab').classList.remove('hidden');
  },

  async sendMessage() {
    const input = document.getElementById('ai-chat-input-field');
    const message = input.value.trim();
    if (!message) return;

    const messagesContainer = document.getElementById('ai-chat-messages');


    const userMsg = document.createElement('div');
    userMsg.className = 'ai-message user';
    userMsg.innerHTML = `<div class="ai-message-bubble">${this.escapeHtml(message)}</div>`;
    messagesContainer.appendChild(userMsg);
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;


    const typing = document.createElement('div');
    typing.className = 'ai-message assistant';
    typing.innerHTML = `<div class="ai-message-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;


    const response = await this.callGemini(message);


    typing.remove();
    const aiMsg = document.createElement('div');
    aiMsg.className = 'ai-message assistant';
    aiMsg.innerHTML = `<div class="ai-message-bubble">${this.formatMarkdown(response)}</div>`;
    messagesContainer.appendChild(aiMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;


    ActivityLog.add('ai', `AI query: "${message.substring(0, 40)}${message.length > 40 ? '...' : ''}"`);
  },

  async parseReport() {
    const input = document.getElementById('ai-parse-input').value.trim();
    if (!input) {
      ImpactBridge.ui.showToast('warning', 'Empty Input', 'Please paste a field report or describe the community need.');
      return;
    }

    const resultSection = document.getElementById('ai-parse-result');
    const outputEl = document.getElementById('ai-parse-output');
    resultSection.classList.remove('hidden');
    outputEl.innerHTML = '<div class="typing-indicator" style="padding:16px"><span></span><span></span><span></span></div>';

    const prompt = `Analyze this field report and extract structured information. Identify: Title, Category (one of: healthcare, education, disaster, environment, shelter, food, livelihood), Priority level (critical/high/medium/low), Location, Affected population count, Specific needs/requirements, and an urgency score out of 10.\n\nField Report:\n${input}`;

    const response = await this.callGemini(prompt);
    outputEl.innerHTML = this.formatMarkdown(response);

    ImpactBridge.ui.showToast('success', 'Analysis Complete', 'Report data has been extracted.');
    ActivityLog.add('ai', 'Field report parsed via AI');
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  formatMarkdown(text) {
    return text
      .replace(/## (.*)/g, '<h3 style="font-size:14px;font-weight:700;margin:12px 0 8px;color:var(--text-primary)">$1</h3>')
      .replace(/### (.*)/g, '<h4 style="font-size:13px;font-weight:600;margin:10px 0 6px;color:var(--text-primary)">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(139,92,246,0.12);padding:1px 5px;border-radius:4px;font-size:12px;color:#a78bfa">$1</code>')
      .replace(/\n- (.*)/g, '<br>• $1')
      .replace(/\n\d+\. (.*)/g, '<br>$&')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
      .replace(/\|(.+)\|/g, (match) => {
        return `<span style="font-family:monospace;font-size:12px">${match}</span>`;
      });
  }
};
