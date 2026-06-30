/**
 * ELI UI Components
 * Toast, Modal, Confetti, Sidebar, Search, Mobile Menu
 */
const UI = {
  init() {
    this.renderSidebar();
    this.renderTopbar();
    this.renderFooter();
    this.initMobileMenu();
    this.initSearch();
    this.initTheme();
    this.renderToastContainer();
    this.renderModalOverlay();
  },

  renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const current = location.pathname.split('/').pop() || 'index.html';
    const isActive = (href) => href === current || (current === '' && href === 'index.html') ? 'active' : '';
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <a href="index.html" class="brand">
          <div class="brand-icon">ELI</div>
          <div>
            <div>ELI Digital Academy</div>
            <div class="brand-subtitle">Powered by The Room</div>
          </div>
        </a>
      </div>
      <ul class="nav-list">
        <li class="nav-item"><a href="index.html" class="nav-link ${isActive('index.html')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> Dashboard</a></li>
        <li class="nav-item"><a href="course.html" class="nav-link ${isActive('course.html')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg> Courses</a></li>
        <li class="nav-item"><a href="resources.html" class="nav-link ${isActive('resources.html')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Resources</a></li>
        <li class="nav-item"><a href="achievements.html" class="nav-link ${isActive('achievements.html')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> Achievements</a></li>
        <li class="nav-item"><a href="progress.html" class="nav-link ${isActive('progress.html')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Progress</a></li>
        <li class="nav-item"><a href="settings.html" class="nav-link ${isActive('settings.html')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.62 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg> Settings</a></li>
      </ul>
      <div class="sidebar-footer">Powered by The Room</div>
    `;
  },

  renderTopbar() {
    const topbar = document.getElementById('topbar');
    if (!topbar) return;
    const state = window.EliStorage.get();
    topbar.innerHTML = `
      <div class="topbar-left">
        <button class="menu-toggle" id="menuToggle" aria-label="Open menu"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
        <span class="page-title" id="pageTitle">ELI Digital Academy</span>
      </div>
      <div class="topbar-right">
        <div class="search-box" id="searchBox">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="searchInput" placeholder="Search lessons, resources..." aria-label="Search" autocomplete="off">
          <div class="search-results-dropdown" id="searchResults"></div>
        </div>
        <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg></button>
      </div>
    `;
  },

  renderFooter() {
    const footer = document.getElementById('footer');
    if (footer) footer.innerHTML = `<div>ELI Digital Academy &mdash; Practical Digital Skills for the Modern Workplace</div>`;
  },

  initMobileMenu() {
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('#menuToggle');
      if (toggle) {
        document.getElementById('sidebar').classList.toggle('closed');
        document.getElementById('sidebarOverlay').classList.toggle('open');
      }
      const overlay = e.target.closest('#sidebarOverlay');
      if (overlay) {
        document.getElementById('sidebar').classList.add('closed');
        document.getElementById('sidebarOverlay').classList.remove('open');
      }
    });
  },

  initTheme() {
    const stored = window.EliStorage.getSettings();
    if (stored.darkMode) document.body.classList.add('dark-mode');
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#themeToggle');
      if (btn) {
        document.body.classList.toggle('dark-mode');
        window.EliStorage.setSettings({ darkMode: document.body.classList.contains('dark-mode') });
      }
    });
  },

  async initSearch() {
    const input = document.getElementById('searchInput');
    const dropdown = document.getElementById('searchResults');
    if (!input) return;
    let allLessons = [];
    try {
      allLessons = await window.EliContent.loadAllLessons();
    } catch (e) {}
    const resources = [
      { title: 'Word Template - Business Letter', desc: 'Downloadable template', type: 'resource', url: 'resources/templates/business-letter.docx' },
      { title: 'Excel Invoice Template', desc: 'Practice file', type: 'resource', url: 'resources/templates/invoice.xlsx' },
      { title: 'PDF Guide - Creating Fillable Forms', desc: 'PDF guide', type: 'resource', url: 'resources/pdfs/fillable-forms.pdf' },
      { title: 'Practice Budget Worksheet', desc: 'Excel exercise', type: 'resource', url: 'resources/exercises/budget.xlsx' },
    ];
    const allItems = [
      ...allLessons.map(l => ({ ...l, type: 'lesson', url: `lesson.html?module=${l.moduleId}&lesson=${l.lessonId}` })),
      ...resources
    ];
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { dropdown.classList.remove('open'); return; }
      const results = allItems.filter(i => (i.title || i.lessonTitle || '').toLowerCase().includes(q) || (i.description || i.lessonMeta || '').toLowerCase().includes(q)).slice(0, 8);
      if (results.length === 0) {
        dropdown.innerHTML = '<div class="search-result-item"><p>No results found</p></div>';
      } else {
        dropdown.innerHTML = results.map(r => `
          <div class="search-result-item" data-url="${r.url || r.lessonId ? `lesson.html?module=${r.moduleId}&lesson=${r.lessonId}` : '#'}">
            <h4>${r.title || r.lessonTitle}</h4>
            <p>${r.type === 'lesson' ? 'Lesson' : 'Resource'} &mdash; ${r.description || r.lessonMeta || r.moduleTitle || ''}</p>
          </div>
        `).join('');
      }
      dropdown.classList.add('open');
    });
    dropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.search-result-item');
      if (item && item.dataset.url) { location.href = item.dataset.url; }
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#searchBox')) dropdown.classList.remove('open');
    });
  },

  renderToastContainer() {
    if (!document.getElementById('toastContainer')) {
      const div = document.createElement('div');
      div.id = 'toastContainer';
      div.className = 'toast-container';
      document.body.appendChild(div);
    }
  },

  toast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  },

  renderModalOverlay() {
    if (!document.getElementById('modalOverlay')) {
      const div = document.createElement('div');
      div.id = 'modalOverlay';
      div.className = 'modal-overlay';
      document.body.appendChild(div);
    }
  },

  showModal({ title, text, icon = '\2705', actions = [] }) {
    const overlay = document.getElementById('modalOverlay');
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-icon">${icon}</div>
        <div class="modal-title">${title}</div>
        <div class="modal-text">${text}</div>
        <div class="modal-actions">${actions.map(a => `<button class="btn ${a.class||'btn-primary'}" data-action="${a.id}">${a.label}</button>`).join('')}</div>
      </div>
    `;
    overlay.classList.add('open');
    return new Promise(resolve => {
      overlay.addEventListener('click', function handler(e) {
        const btn = e.target.closest('[data-action]');
        if (btn) { overlay.classList.remove('open'); overlay.removeEventListener('click', handler); resolve(btn.dataset.action); }
        if (e.target === overlay) { overlay.classList.remove('open'); overlay.removeEventListener('click', handler); resolve(null); }
      });
    });
  },

  confetti() {
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2, y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16, vy: (Math.random() - 0.5) * 16 - 4,
        color: ['#1a56db','#0d9488','#f59e0b','#10b981','#ef4444'][Math.floor(Math.random()*5)],
        size: Math.random() * 6 + 3,
        life: 1
      });
    }
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.life -= 0.015;
        ctx.fillStyle = p.color; ctx.globalAlpha = p.life;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      if (particles.some(p => p.life > 0)) requestAnimationFrame(animate);
      else canvas.remove();
    }
    animate();
  }
};

window.EliUI = UI;
