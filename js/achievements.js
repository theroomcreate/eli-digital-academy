/**
 * ELI Achievements Engine
 * Badge definitions and award logic.
 */
const Achievements = {
  badges: [
    { id: 'digital-scout', name: 'Digital Scout', icon: '\1F30D', desc: 'Complete your first lesson', condition: (s, c) => Object.keys(s.progress).length >= 1 },
    { id: 'office-explorer', name: 'Office Explorer', icon: '\1F3D7', desc: 'Complete 5 lessons', condition: (s, c) => Object.keys(s.progress).length >= 5 },
    { id: 'word-beginner', name: 'Word Beginner', icon: '\1F4C4', desc: 'Complete Module 2 (Word Basics)', condition: (s, c) => {
      const m2 = c.modules.find(m => m.id === 'module2');
      return m2 && m2.lessons.every(l => s.progress[l.id]?.completed);
    }},
    { id: 'word-pro', name: 'Word Professional', icon: '\1F4DD', desc: 'Complete Module 3 (Word Projects)', condition: (s, c) => {
      const m3 = c.modules.find(m => m.id === 'module3');
      return m3 && m3.lessons.every(l => s.progress[l.id]?.completed);
    }},
    { id: 'excel-beginner', name: 'Excel Beginner', icon: '\1F4CA', desc: 'Complete Module 5 (Excel Foundations)', condition: (s, c) => {
      const m5 = c.modules.find(m => m.id === 'module5');
      return m5 && m5.lessons.every(l => s.progress[l.id]?.completed);
    }},
    { id: 'excel-pro', name: 'Excel Professional', icon: '\1F4C8', desc: 'Complete Module 6 (Excel Functions)', condition: (s, c) => {
      const m6 = c.modules.find(m => m.id === 'module6');
      return m6 && m6.lessons.every(l => s.progress[l.id]?.completed);
    }},
    { id: 'workplace-ready', name: 'Workplace Ready', icon: '\1F3E2', desc: 'Complete 80% of the course', condition: (s, c) => {
      const p = window.EliProgress.getCourseProgress(c, s);
      return p.lessonPercent >= 80;
    }},
  ],

  checkAll(state, course) {
    const newBadges = [];
    for (const badge of this.badges) {
      if (!state.achievements[badge.id]?.earned && badge.condition(state, course)) {
        window.EliStorage.earnBadge(badge.id);
        newBadges.push(badge);
      }
    }
    return newBadges;
  },

  renderBadgeList(containerId, state) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = this.badges.map(b => {
      const earned = !!state.achievements[b.id]?.earned;
      return `
        <div class="achievement-card ${earned ? 'earned' : ''}">
          <div class="achievement-icon">${b.icon}</div>
          <h4>${b.name}</h4>
          <p>${b.desc}</p>
          <span class="badge ${earned ? 'badge-earned' : 'badge-locked'}">${earned ? 'Earned' : 'Locked'}</span>
        </div>
      `;
    }).join('');
  }
};

window.EliAchievements = Achievements;
