/**
 * ELI Storage Module
 * Handles all LocalStorage operations with schema versioning
 * and offline queue for future Firebase sync.
 */
const STORAGE_KEY = 'eli_academy_v1';
const OFFLINE_QUEUE_KEY = 'eli_offline_queue';

const defaultState = {
  version: 1,
  user: { name: 'Learner', joined: new Date().toISOString() },
  progress: {},       // lessonId -> { completed, completedAt, score }
  quizResults: {},    // quizId -> { score, passed, attempts, bestScore, timestamp }
  xp: 0,
  streak: { current: 0, lastActive: null, longest: 0 },
  achievements: {},   // badgeId -> { earned, earnedAt }
  settings: { darkMode: false, notifications: true },
  currentCourse: 'office-essentials'
};

function getState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    // Merge with defaults for any missing keys
    return { ...structuredClone(defaultState), ...parsed };
  } catch (e) {
    console.error('Storage read error', e);
    return structuredClone(defaultState);
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    queueForSync(state);
  } catch (e) {
    console.error('Storage write error', e);
  }
}

function queueForSync(state) {
  try {
    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
    queue.push({ timestamp: Date.now(), payload: state });
    // Keep only last 50 entries
    while (queue.length > 50) queue.shift();
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(sw => sw.sync.register('sync-progress').catch(() => {}));
    }
  } catch (e) {}
}

const Storage = {
  get: () => getState(),
  save: (state) => saveState(state),

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
    location.reload();
  },

  export() {
    const state = getState();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eli-progress-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  import(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (data.version && data.progress) {
            saveState(data);
            resolve(data);
          } else {
            reject(new Error('Invalid backup file'));
          }
        } catch (e) { reject(e); }
      };
      reader.readAsText(file);
    });
  },

  completeLesson(lessonId, score = null) {
    const state = getState();
    if (!state.progress[lessonId]) {
      state.progress[lessonId] = { completed: true, completedAt: new Date().toISOString(), score };
      state.xp += 10;
      this.updateStreak(state);
      saveState(state);
    }
    return state;
  },

  isLessonComplete(lessonId) {
    return !!getState().progress[lessonId]?.completed;
  },

  saveQuiz(quizId, score, passed) {
    const state = getState();
    const existing = state.quizResults[quizId] || { attempts: 0, bestScore: 0 };
    state.quizResults[quizId] = {
      score,
      passed,
      attempts: existing.attempts + 1,
      bestScore: Math.max(score, existing.bestScore),
      timestamp: new Date().toISOString()
    };
    if (passed) state.xp += 20;
    this.updateStreak(state);
    saveState(state);
    return state;
  },

  updateStreak(state) {
    const today = new Date().toDateString();
    const last = state.streak.lastActive ? new Date(state.streak.lastActive).toDateString() : null;
    if (last === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (last === yesterday.toDateString()) {
      state.streak.current += 1;
    } else {
      state.streak.current = 1;
    }
    state.streak.lastActive = new Date().toISOString();
    if (state.streak.current > state.streak.longest) state.streak.longest = state.streak.current;
  },

  earnBadge(badgeId) {
    const state = getState();
    if (!state.achievements[badgeId]) {
      state.achievements[badgeId] = { earned: true, earnedAt: new Date().toISOString() };
      state.xp += 50;
      saveState(state);
    }
    return state;
  },

  hasBadge(badgeId) {
    return !!getState().achievements[badgeId]?.earned;
  },

  getSettings() { return getState().settings; },
  setSettings(settings) {
    const state = getState();
    state.settings = { ...state.settings, ...settings };
    saveState(state);
  }
};

// Expose for other modules
window.EliStorage = Storage;
