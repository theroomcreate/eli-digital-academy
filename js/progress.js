/**
 * ELI Progress Engine
 * Calculates percentages, streaks, XP levels, and course completion.
 */
const Progress = {
  xpLevels: [
    { level: 1, xp: 0, title: 'Digital Scout' },
    { level: 2, xp: 50, title: 'Office Explorer' },
    { level: 3, xp: 150, title: 'Word Beginner' },
    { level: 4, xp: 300, title: 'Excel Beginner' },
    { level: 5, xp: 500, title: 'Word Professional' },
    { level: 6, xp: 750, title: 'Excel Professional' },
    { level: 7, xp: 1000, title: 'Workplace Ready' },
  ],

  getLevel(xp) {
    let current = this.xpLevels[0];
    for (const lvl of this.xpLevels) {
      if (xp >= lvl.xp) current = lvl;
    }
    const next = this.xpLevels.find(l => l.xp > xp);
    return { current, next, progress: next ? (xp - current.xp) / (next.xp - current.xp) : 1 };
  },

  getCourseProgress(course, state) {
    let totalLessons = 0, completedLessons = 0;
    let totalQuizzes = 0, passedQuizzes = 0;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        totalLessons++;
        if (state.progress[lesson.id]?.completed) completedLessons++;
        if (lesson.quiz && lesson.quiz.length) {
          totalQuizzes++;
          if (state.quizResults[lesson.id]?.passed) passedQuizzes++;
        }
      }
    }
    return {
      totalLessons, completedLessons,
      totalQuizzes, passedQuizzes,
      lessonPercent: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0,
      quizPercent: totalQuizzes ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0
    };
  },

  getModuleProgress(module, state) {
    const total = module.lessons.length;
    const completed = module.lessons.filter(l => state.progress[l.id]?.completed).length;
    return { total, completed, percent: total ? Math.round((completed / total) * 100) : 0 };
  },

  isModuleUnlocked(module, course, state) {
    if (!module.locked) return true;
    const idx = course.modules.indexOf(module);
    if (idx <= 0) return true;
    const prev = course.modules[idx - 1];
    const p = this.getModuleProgress(prev, state);
    return p.percent >= 80; // unlock when 80% complete
  },

  streakText(state) {
    const s = state.streak;
    if (!s.current) return 'Start learning to build your streak!';
    return `${s.current} day streak` + (s.current === s.longest ? ' (Best!)' : '');
  }
};

window.EliProgress = Progress;
