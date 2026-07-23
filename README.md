# Parsify Frontend

**Know Your Worth. Track Your Progress. Get Hired.**

Parsify is a frontend-only resume feedback and tracking app built with a modern Next.js stack. The app focuses on a polished dashboard experience for uploading resumes, reviewing ATS-style feedback, and tracking progress with a dark themed interface.

## What’s Included

- Resume dashboard with stored resume cards and upload prompts.
- Auth-gated home flow that redirects unauthenticated users to sign in.
- Resume upload and feedback views with a structured score breakdown.
- Dark mode toggle and theme-aware layout shell.
- Client-side storage helpers for keeping resume data between sessions.

## Recent Frontend Updates

- Fixed the app shell so the theme provider runs in a client-safe layout.
- Reworked the styling pipeline to match the installed Tailwind CSS 3 setup.
- Added a typed feedback model to the details view so category scores and tips render cleanly.
- Kept the home page focused on the resume dashboard, loading state, and upload call to action.

## Tech Stack

- **Framework:** Next.js 15
- **UI:** React 19 + TypeScript
- **Styling:** Tailwind CSS 3
- **State:** Zustand and local storage helpers
- **Media:** pdf.js, react-dropzone, and custom SVG assets
- **Scripts:** `npm run dev`, `npm run build`, `npm run start`, `npm run lint`

## Project Structure

- `app/` - App Router pages, layout, and feature routes.
- `app/components/` - Shared UI blocks such as the navbar, resume cards, and feedback details.
- `app/lib/` - Theme, auth, storage, and utility helpers.
- `types/` - Shared TypeScript types for resumes and feedback data.

## Getting Started

```bash
npm install
npm run dev
```

For production builds:

```bash
npm run build
npm run start
```

The app is configured to run from the `frontend/` folder.
