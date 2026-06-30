/**
 * ELI App Router & Page Initializers
 * Handles page-specific logic for multi-page app.
 */
const App = {
  async init() {
    // Core UI init
    if (window.EliUI) window.EliUI.init();
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    }
    // Page-specific init
    const page = location.pathname.split('/').pop() || 'index.html';
    if (page === 'index.html' || page === '') await this.initDashboard();
    if (page === 'course.html') await this.initCourse();
    if (page === 'lesson.html') await this.initLesson();
    if (page === 'resources.html') this.initResources();
    if (page === 'achievements.html') await this.initAchievements();
    if (page === 'progress.html') await this.initProgress();
    if (page === 'settings.html') this.initSettings();
  },

  // ============== DASHBOARD ==============
  async initDashboard() {
    const course = await window.EliContent.loadCourse();
    const state = window.EliStorage.get();
    const stats = window.EliProgress.getCourseProgress(course, state);
    const levelInfo = window.EliProgress.getLevel(state.xp);
    const streak = window.EliProgress.streakText(state);

    const welcome = document.getElementById('welcomeHero');
    if (welcome) {
      welcome.innerHTML = `
        <div class="hero animate-fade-up">
          <h1 class="hero-title">Welcome back, ${state.user.name}!</h1>
          <p class="hero-text">Continue your journey to master practical workplace digital skills. You're doing great!</p>
          <a href="course.html" class="btn btn-lg">Continue Learning</a>
        </div>
      `;
    }

    const statsEl = document.getElementById('dashboardStats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="grid grid-4">
          <div class="card stat-card card-hover">
            <div class="stat-value">${stats.lessonPercent}%</div>
            <div class="stat-label">Course Progress</div>
          </div>
          <div class="card stat-card card-hover">
            <div class="stat-value">${stats.completedLessons}</div>
            <div class="stat-label">Lessons Done</div>
          </div>
          <div class="card stat-card card-hover">
            <div class="stat-value">${state.xp}</div>
            <div class="stat-label">XP Points</div>
          </div>
          <div class="card stat-card card-hover">
            <div class="stat-value">${state.streak.current}</div>
            <div class="stat-label">Day Streak</div>
          </div>
        </div>
      `;
    }

    const recentEl = document.getElementById('recentActivity');
    if (recentEl) {
      // Find most recent completed lessons
      const recent = Object.entries(state.progress)
        .sort((a, b) => new Date(b[1].completedAt) - new Date(a[1].completedAt))
        .slice(0, 5);
      if (recent.length === 0) {
        recentEl.innerHTML = `<div class="card"><p>No activity yet. Start your first lesson in <a href="course.html">Courses</a>!</p></div>`;
      } else {
        recentEl.innerHTML = recent.map(([id, p]) => `
          <div class="card" style="display:flex;align-items:center;gap:16px;padding:16px 20px;">
            <div class="lesson-status complete">✓</div>
            <div style="flex:1;">
              <div style="font-weight:600;">Lesson completed</div>
              <div style="font-size:0.85rem;color:var(--color-text-muted);">${new Date(p.completedAt).toLocaleDateString()}</div>
            </div>
            <span class="badge">+10 XP</span>
          </div>
        `).join('');
      }
    }

    const levelEl = document.getElementById('levelDisplay');
    if (levelEl) {
      levelEl.innerHTML = `
        <div class="card">
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;">
            <div style="font-size:2.5rem;">🎯</div>
            <div>
              <div style="font-weight:700;font-size:1.1rem;">Level ${levelInfo.current.level}: ${levelInfo.current.title}</div>
              <div style="font-size:0.85rem;color:var(--color-text-muted);">${levelInfo.next ? `${levelInfo.next.xp - state.xp} XP to next level` : 'Max level reached!'}</div>
            </div>
          </div>
          <div class="xp-bar-container">
            <div class="xp-bar"><div class="xp-bar-fill" style="width:${Math.round(levelInfo.progress * 100)}%"></div></div>
            <span class="xp-text">${state.xp} / ${levelInfo.next ? levelInfo.next.xp : state.xp} XP</span>
          </div>
        </div>
      `;
    }
  },

  // ============== COURSE ==============
  async initCourse() {
    const course = await window.EliContent.loadCourse();
    const state = window.EliStorage.get();
    const container = document.getElementById('courseContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="card" style="margin-bottom:24px;">
        <h1>${course.title}</h1>
        <p>${course.description}</p>
        <div class="progress-bar" style="margin-top:12px;">
          <div class="progress-fill" id="courseProgressFill" style="width:0%"></div>
        </div>
        <div style="margin-top:8px;font-size:0.85rem;color:var(--color-text-muted);" id="courseProgressText">Loading...</div>
      </div>
      <div class="grid" id="modulesGrid"></div>
    `;

    const stats = window.EliProgress.getCourseProgress(course, state);
    const fill = document.getElementById('courseProgressFill');
    const text = document.getElementById('courseProgressText');
    if (fill) fill.style.width = stats.lessonPercent + '%';
    if (text) text.textContent = `${stats.completedLessons} of ${stats.totalLessons} lessons completed (${stats.lessonPercent}%)`;

    const grid = document.getElementById('modulesGrid');
    grid.innerHTML = course.modules.map((mod, idx) => {
      const progress = window.EliProgress.getModuleProgress(mod, state);
      const unlocked = window.EliProgress.isModuleUnlocked(mod, course, state);
      const allDone = progress.percent === 100;
      return `
        <div class="module-card ${unlocked ? '' : 'module-locked'}">
          <div class="module-header">
            <div>
              <div style="font-weight:700;">${mod.title}</div>
              <div style="font-size:0.8rem;color:var(--color-text-muted);">${mod.lessons.length} lessons</div>
            </div>
            ${allDone ? '<span class="badge badge-earned">Complete</span>' : ''}
          </div>
          <div class="module-body">
            <div class="progress-bar"><div class="progress-fill" style="width:${progress.percent}%"></div></div>
            <div class="module-progress">${progress.completed}/${progress.total} complete</div>
            <ul class="lesson-list" style="margin-top:12px;">
              ${mod.lessons.map(lesson => {
                const done = state.progress[lesson.id]?.completed;
                return `
                  <li class="lesson-item" ${unlocked ? `onclick="location.href='lesson.html?module=${mod.id}&lesson=${lesson.id}'"` : ''}>
                    <div class="lesson-status ${done ? 'complete' : (unlocked ? 'in-progress' : '')}">${done ? '✓' : ''}</div>
                    <div class="lesson-info">
                      <div class="lesson-title">${lesson.title}</div>
                      <div class="lesson-meta">${lesson.duration || '10 min'}</div>
                    </div>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        </div>
      `;
    }).join('');

    // Check achievements after rendering
    const newBadges = window.EliAchievements.checkAll(state, course);
    if (newBadges.length) {
      for (const b of newBadges) {
        window.EliUI.toast(`Badge earned: ${b.name}! +50 XP`, 'success');
      }
      window.EliUI.confetti();
    }
  },

  // ============== LESSON ==============
  async initLesson() {
    const params = new URLSearchParams(location.search);
    const moduleId = params.get('module');
    const lessonId = params.get('lesson');
    if (!moduleId || !lessonId) {
      document.getElementById('lessonContainer').innerHTML = '<div class="card">Lesson not found. <a href="course.html">Back to course</a></div>';
      return;
    }
    const content = await window.EliContent.loadLesson(moduleId, lessonId);
    if (!content) {
      document.getElementById('lessonContainer').innerHTML = '<div class="card">Lesson not found. <a href="course.html">Back to course</a></div>';
      return;
    }
    const state = window.EliStorage.get();
    const completed = window.EliStorage.isLessonComplete(lessonId);
    const quizPassed = state.quizResults[lessonId]?.passed;

    const container = document.getElementById('lessonContainer');
    container.innerHTML = `
      <div class="card" style="margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <a href="course.html" class="btn btn-sm btn-ghost">← Back</a>
          <span class="badge">${content.moduleTitle || moduleId}</span>
        </div>
        <h1>${content.title}</h1>
        <p>${content.description}</p>
        ${content.objectives ? `
          <div style="margin-top:16px;">
            <h4>Learning Objectives</h4>
            <ul style="margin-left:20px;color:var(--color-text-muted);">
              ${content.objectives.map(o => `<li>${o}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>

      <div class="card" style="margin-bottom:16px;">
        <h3>Lesson Content</h3>
        <div class="lesson-content" style="line-height:1.8;">
          ${content.content || '<p>Content loading...</p>'}
        </div>
      </div>

      ${content.video ? `
        <div class="card" style="margin-bottom:16px;">
          <h3>Video Tutorial</h3>
          <div style="position:relative;padding-top:56.25%;background:var(--color-bg);border-radius:var(--radius-md);overflow:hidden;">
            <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="${content.video}" allowfullscreen></iframe>
          </div>
        </div>
      ` : ''}

      ${content.downloads && content.downloads.length ? `
        <div class="card" style="margin-bottom:16px;">
          <h3>Downloads</h3>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${content.downloads.map(d => `
              <div class="resource-card">
                <div class="resource-icon">📎</div>
                <div class="resource-info">
                  <div class="resource-title">${d.title}</div>
                  <div class="resource-desc">${d.description || ''}</div>
                </div>
                <a href="${d.url}" class="btn btn-sm btn-outline" download>Download</a>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${content.exercise ? `
        <div class="card" style="margin-bottom:16px;">
          <h3>Practical Exercise</h3>
          <div style="background:var(--color-bg);padding:20px;border-radius:var(--radius-md);border:1px dashed var(--color-border);">
            <p style="margin:0;">${content.exercise}</p>
          </div>
        </div>
      ` : ''}

      <div class="card" style="margin-bottom:16px;">
        <h3>Quiz</h3>
        <div id="quizContainer"></div>
      </div>

      <div class="card" style="display:flex;gap:12px;justify-content:space-between;align-items:center;">
        <div id="completionStatus">
          ${completed ? '<span class="badge badge-earned">✓ Lesson Complete</span>' : '<span class="badge">Not yet complete</span>'}
        </div>
        <button class="btn btn-primary btn-lg" id="markCompleteBtn" ${completed ? 'disabled' : ''}>
          ${completed ? 'Completed' : 'Mark Complete'}
        </button>
      </div>
    `;

    // Render quiz
    if (window.EliQuiz && content.quiz) {
      window.EliQuiz.render('quizContainer', content.quiz, lessonId);
    }

    // Mark complete
    const btn = document.getElementById('markCompleteBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        if (completed) return;
        window.EliStorage.completeLesson(lessonId);
        btn.disabled = true;
        btn.textContent = 'Completed';
        document.getElementById('completionStatus').innerHTML = '<span class="badge badge-earned">✓ Lesson Complete</span>';
        window.EliUI.confetti();
        window.EliUI.toast('Lesson completed! +10 XP', 'success');
      });
    }

    // Update page title
    document.title = `${content.title} | ELI Digital Academy`;
  },

  // ============== RESOURCES ==============
  initResources() {
    const resources = [
      { category: 'PDF Guides', items: [
        { title: 'Creating Fillable PDF Forms', desc: 'Step-by-step guide to create interactive forms in PDF', icon: '📄', url: 'resources/pdfs/fillable-forms.pdf' },
        { title: 'Word Formatting Best Practices', desc: 'Professional document formatting standards', icon: '📝', url: 'resources/pdfs/word-formatting.pdf' },
        { title: 'Excel Shortcuts Cheat Sheet', desc: '50+ keyboard shortcuts to speed up your work', icon: '⌨️', url: 'resources/pdfs/excel-shortcuts.pdf' },
      ]},
      { category: 'Templates', items: [
        { title: 'Business Letter Template', desc: 'Professional Word template for business correspondence', icon: '📨', url: 'resources/templates/business-letter.docx' },
        { title: 'Invoice Template', desc: 'Ready-to-use Excel invoice with formulas', icon: '💵', url: 'resources/templates/invoice.xlsx' },
        { title: 'Meeting Minutes Template', desc: 'Structured Word template for meeting notes', icon: '📋', url: 'resources/templates/meeting-minutes.docx' },
      ]},
      { category: 'Practice Files', items: [
        { title: 'Budget Worksheet', desc: 'Excel practice file for monthly business budget', icon: '📊', url: 'resources/exercises/budget.xlsx' },
        { title: 'Data Cleanup Exercise', desc: 'Raw data file to practice cleaning and formatting', icon: '🧹', url: 'resources/exercises/data-cleanup.xlsx' },
        { title: 'Mail Merge Data', desc: 'Sample data for practicing Word mail merge', icon: '📬', url: 'resources/exercises/mail-merge-data.csv' },
      ]},
      { category: 'External Resources', items: [
        { title: 'Microsoft Learn - Excel', desc: 'Official Microsoft Excel training', icon: '🔗', url: 'https://learn.microsoft.com/en-us/training/excel/' },
        { title: 'W3Schools Excel Tutorial', desc: 'Free online Excel tutorial with exercises', icon: '🔗', url: 'https://www.w3schools.com/excel/' },
        { title: 'Microsoft Word Support', desc: 'Official Word documentation and help', icon: '🔗', url: 'https://support.microsoft.com/en-us/word' },
      ]},
    ];

    const container = document.getElementById('resourcesContainer');
    if (!container) return;
    container.innerHTML = resources.map(cat => `
      <div class="card" style="margin-bottom:24px;">
        <h3>${cat.category}</h3>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:12px;">
          ${cat.items.map(item => `
            <div class="resource-card">
              <div class="resource-icon">${item.icon}</div>
              <div class="resource-info">
                <div class="resource-title">${item.title}</div>
                <div class="resource-desc">${item.desc}</div>
              </div>
              <a href="${item.url}" class="btn btn-sm btn-outline" ${item.url.startsWith('http') ? 'target="_blank" rel="noopener"' : 'download'}>Open</a>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  },

  // ============== ACHIEVEMENTS ==============
  async initAchievements() {
    const course = await window.EliContent.loadCourse();
    const state = window.EliStorage.get();
    window.EliAchievements.renderBadgeList('achievementsGrid', state);
    const levelInfo = window.EliProgress.getLevel(state.xp);
    const header = document.getElementById('achievementsHeader');
    if (header) {
      const earned = Object.keys(state.achievements).length;
      header.innerHTML = `
        <div class="grid grid-3">
          <div class="card stat-card">
            <div class="stat-value">${state.xp}</div>
            <div class="stat-label">Total XP</div>
          </div>
          <div class="card stat-card">
            <div class="stat-value">${earned}</div>
            <div class="stat-label">Badges Earned</div>
          </div>
          <div class="card stat-card">
            <div class="stat-value">Level ${levelInfo.current.level}</div>
            <div class="stat-label">${levelInfo.current.title}</div>
          </div>
        </div>
      `;
    }
  },

  // ============== PROGRESS ==============
  async initProgress() {
    const course = await window.EliContent.loadCourse();
    const state = window.EliStorage.get();
    const stats = window.EliProgress.getCourseProgress(course, state);
    const container = document.getElementById('progressContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="card" style="margin-bottom:24px;">
        <h2>Overall Progress</h2>
        <div class="progress-bar" style="margin-top:12px;"><div class="progress-fill" style="width:${stats.lessonPercent}%"></div></div>
        <div style="margin-top:8px;font-size:0.9rem;">${stats.completedLessons} of ${stats.totalLessons} lessons completed (${stats.lessonPercent}%)</div>
      </div>
      <div class="grid grid-2">
        <div class="card">
          <h3>Quiz Performance</h3>
          <div class="progress-bar" style="margin-top:12px;"><div class="progress-fill" style="width:${stats.quizPercent}%"></div></div>
          <div style="margin-top:8px;font-size:0.9rem;">${stats.passedQuizzes} of ${stats.totalQuizzes} quizzes passed (${stats.quizPercent}%)</div>
        </div>
        <div class="card">
          <h3>XP & Level</h3>
          <div style="font-size:2rem;font-weight:800;color:var(--color-primary);margin-top:8px;">${state.xp} XP</div>
          <div style="margin-top:8px;font-size:0.9rem;color:var(--color-text-muted);">${window.EliProgress.streakText(state)}</div>
        </div>
      </div>
      <div class="card" style="margin-top:24px;">
        <h3>Module Breakdown</h3>
        <div style="margin-top:16px;display:flex;flex-direction:column;gap:16px;">
          ${course.modules.map(mod => {
            const p = window.EliProgress.getModuleProgress(mod, state);
            return `
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                  <span style="font-weight:600;">${mod.title}</span>
                  <span style="font-size:0.85rem;color:var(--color-text-muted);">${p.completed}/${p.total}</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${p.percent}%"></div></div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // ============== SETTINGS ==============
  initSettings() {
    const state = window.EliStorage.get();
    const settings = state.settings;

    const toggle = (id, checked, onChange) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle('active', checked);
      el.addEventListener('click', () => {
        const now = !el.classList.contains('active');
        el.classList.toggle('active', now);
        onChange(now);
      });
    };

    toggle('darkModeToggle', settings.darkMode || document.body.classList.contains('dark-mode'), (v) => {
      document.body.classList.toggle('dark-mode', v);
      window.EliStorage.setSettings({ darkMode: v });
    });

    const resetBtn = document.getElementById('resetProgressBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        const action = await window.EliUI.showModal({
          title: 'Reset All Progress?',
          text: 'This will delete all your progress, XP, and achievements. This cannot be undone.',
          icon: '⚠️',
          actions: [{ id: 'confirm', label: 'Reset Everything', class: 'btn-danger' }, { id: 'cancel', label: 'Cancel', class: 'btn-outline' }]
        });
        if (action === 'confirm') {
          window.EliStorage.reset();
        }
      });
    }

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) exportBtn.addEventListener('click', () => window.EliStorage.export());

    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    if (importBtn && importFile) {
      importBtn.addEventListener('click', () => importFile.click());
      importFile.addEventListener('change', async (e) => {
        if (e.target.files[0]) {
          try {
            await window.EliStorage.import(e.target.files[0]);
            window.EliUI.toast('Progress imported successfully!', 'success');
            setTimeout(() => location.reload(), 800);
          } catch (err) {
            window.EliUI.toast('Failed to import file', 'error');
          }
        }
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
window.EliApp = App;
