/**
 * ELI Content Loader
 * Fetches and caches JSON lesson/course content.
 */
const ContentLoader = {
  cache: new Map(),

  async fetchJSON(url) {
    if (this.cache.has(url)) return this.cache.get(url);
    try {
      const res = await fetch(url, { cache: 'default' });
      if (!res.ok) throw new Error('Failed to load ' + url);
      const data = await res.json();
      this.cache.set(url, data);
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async loadCourse() {
    return this.fetchJSON('content/course.json');
  },

  async loadLesson(moduleId, lessonId) {
    return this.fetchJSON(`content/${moduleId}/${lessonId}.json`);
  },

  async loadAllLessons() {
    const course = await this.loadCourse();
    if (!course) return [];
    const promises = [];
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        promises.push(
          this.loadLesson(mod.id, lesson.id).then(content => ({
            moduleId: mod.id, moduleTitle: mod.title,
            lessonId: lesson.id, lessonTitle: lesson.title,
            ...content
          }))
        );
      }
    }
    return Promise.all(promises);
  }
};

window.EliContent = ContentLoader;
