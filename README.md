# ELI Digital Academy

**Practical Digital Skills for the Modern Workplace**

Powered by The Room

---

## Overview

ELI Digital Academy is a modern, mobile-first Progressive Web App (PWA) designed to teach practical workplace technology skills through guided learning, real-world exercises, quizzes, downloadable resources, and progress tracking.

Built with vanilla HTML, CSS, and JavaScript — no frameworks, no backend, no authentication required.

## Learning Philosophy

**Learn → Practice → Quiz → Complete**

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage for progress tracking
- Service Worker for offline support
- JSON-driven content system

## Deployment

### GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings > Pages** and select the branch you want to deploy (usually `main`).
3. If deploying to a **project site** (`username.github.io/repo-name`), update the root paths in `service-worker.js`, `content-loader.js`, and `manifest.json` to include the repository base path.

### Vercel

1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` in this folder and follow the prompts.
3. Or drag and drop this folder into the Vercel dashboard.

## Folder Structure

```
├── index.html              # Dashboard
├── course.html             # Course overview
├── lesson.html             # Lesson view
├── resources.html          # Resource library
├── achievements.html       # Achievements & badges
├── progress.html           # Progress tracking
├── settings.html           # Settings (dark mode, import/export)
├── 404.html                # Offline fallback page
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline caching & sync
├── css/
│   └── styles.css          # Design system & components
├── js/
│   ├── app.js              # Page initializers & routing logic
│   ├── storage.js          # LocalStorage wrapper & progress
│   ├── content-loader.js   # JSON content loading & caching
│   ├── ui.js               # Sidebar, search, toast, modal, confetti
│   ├── progress.js         # Progress calculations, XP, streaks
│   ├── achievements.js     # Badge definitions & award logic
│   └── quiz-engine.js      # Quiz rendering, scoring, feedback
├── content/
│   ├── course.json         # Course metadata & module structure
│   ├── module1/
│   │   ├── lesson1.json    # Understanding Files and Folders
│   │   ├── lesson2.json    # File Types Explained
│   │   ├── lesson3.json    # Saving and Organizing Documents
│   │   ├── lesson4.json    # Introduction to PDF Documents
│   │   └── lesson5.json    # PDF Conversion Basics
│   ├── module2/            # Microsoft Word Basics
│   ├── module3/            # Microsoft Word Projects
│   ├── module4/            # PDF Skills
│   ├── module5/            # Excel Foundations
│   ├── module6/            # Excel Functions
│   ├── module7/            # Workplace Projects
│   └── module8/            # Final Assessment
├── resources/
│   ├── pdfs/               # PDF guides and checklists
│   ├── templates/          # Word & Excel templates
│   ├── exercises/          # Practice files
│   └── downloads/          # Additional downloads
└── icons/
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    └── icon-512x512.png
```

## Content Architecture

All lessons load from JSON files. To add or edit content, update the corresponding JSON file in `content/`. The schema is:

```json
{
  "title": "Lesson Title",
  "moduleTitle": "Module Name",
  "description": "Short description",
  "objectives": ["Objective 1", "Objective 2"],
  "content": "HTML string of lesson content",
  "downloads": [
    { "title": "File Name", "description": "What it is", "url": "path/to/file" }
  ],
  "exercise": "Practical exercise instructions",
  "quiz": [
    {
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correct": 1,
      "explanation": "Why this is correct."
    }
  ]
}
```

## PWA Features

- **Installable** on desktop, Android, and iPhone
- **Add to Home Screen** support
- **Offline-first** — previously opened lessons, quizzes, and resources remain accessible
- **Service Worker** caches assets and content for offline use
- **Progress sync** queue ready for future Firebase integration

## Progress Tracking

Stored entirely in LocalStorage. Users can:

- Complete lessons (+10 XP)
- Pass quizzes (+20 XP)
- Earn badges (+50 XP)
- Build learning streaks
- Track module and course completion

Data can be exported/imported as JSON from the Settings page.

## Future Scaling

The architecture is designed for easy migration to Firebase or any backend:

1. Replace `LocalStorage` calls in `storage.js` with API calls.
2. The offline queue (`eli_offline_queue`) already captures all state changes.
3. The `sync` event in the service worker can trigger background sync.

## License

Created for ELI Digital Academy — Powered by The Room.
