# Parsify

Parsify is a Next.js resume-analysis app with a Hiring Agent-inspired, explainable evaluation workflow. It extracts real text from a PDF in the browser, evaluates the resume against a job description through a server-side Gemini request, optionally enriches the result with public GitHub repositories, and presents evidence instead of an opaque score.

> The application is designed for Vercel deployment. API keys remain server-side; they are never exposed to the browser.

## Features

- PDF upload, first-page preview, and selectable-text extraction from every page.
- Evidence-based 120-point Hiring Agent rubric:
  - Open Source: 35 points
  - Self Projects: 30 points
  - Production Experience: 25 points
  - Technical Skills: 10 points
  - Bonus points: up to 20, with explicit deductions
- Job-description matching with matched and missing keywords.
- Role templates for general software, frontend, backend, and data/ML roles.
- Optional GitHub profile enrichment: identifies a profile from the resume or a manually supplied URL, then shows up to seven relevant public repositories.
- Structured JSON Resume-style parsing for basics, work, education, skills, projects, and awards.
- Score evidence, key strengths, highest-impact improvements, safety signal, fairness notice, model metadata, and page count.
- Prompt-injection detection: suspicious instruction-like text in a resume is flagged and the model is explicitly instructed to treat resume content as untrusted data.
- Parsed-resume JSON editor for correcting extraction output.
- JSON report export and browser-native Print / Save as PDF support.
- Resume-history dashboard, analysis deletion, and side-by-side comparison of score, job match, and missing keywords.
- Dark mode, responsive layout, client-side authentication flow, and local browser persistence.

## Architecture

```text
PDF selected in browser
  -> pdf.js extracts text locally
  -> Next.js /api/analyze route on Vercel
  -> optional GitHub REST lookup (server-side)
  -> Gemini structured evaluation
  -> explainable Hiring Agent report in the browser
```

The PDF itself is not uploaded by the current flow; only extracted text is sent to the analysis API. Resume history is currently stored in `localStorage`, so it belongs to the current browser/device.

## Tech Stack

- Next.js 15 / React 19 / TypeScript
- Tailwind CSS 3
- pdf.js and react-dropzone
- Gemini Generative Language API
- GitHub REST API
- Zustand and browser local storage

## Local Setup

The application lives in `frontend/`.

```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

Add the required values to `frontend/.env.local`:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
# Optional; defaults to gemini-1.5-flash
GEMINI_MODEL=gemini-1.5-flash
# Optional; raises GitHub API quota for public-project enrichment
GITHUB_TOKEN=github_pat_your_token
```

Run checks and a production build with:

```bash
npx tsc --noEmit
npm run build
```

## Vercel Deployment

1. Import this repository into Vercel and set the **Root Directory** to `frontend`.
2. Add `GEMINI_API_KEY`; optionally add `GEMINI_MODEL` and `GITHUB_TOKEN` under Project Settings → Environment Variables.
3. Deploy. The `/api/analyze` route runs as a Vercel serverless function and has `no-store` response caching enabled.

Never use `NEXT_PUBLIC_` for API keys. `GITHUB_TOKEN` is optional: without it GitHub enrichment has GitHub's unauthenticated API rate limit.

## Project Structure

- `frontend/app/api/analyze/route.ts` — Vercel-safe analysis API, GitHub enrichment, model request, validation, and score normalization.
- `frontend/app/upload/page.tsx` — upload form, role selection, GitHub override, client-side PDF extraction, and progress status.
- `frontend/app/components/HiringAgentReport.tsx` — transparent score/evidence report.
- `frontend/app/components/AnalysisActions.tsx` — export, print, parsed JSON editor, and deletion controls.
- `frontend/app/components/ComparisonPanel.tsx` — local analysis comparison dashboard.
- `frontend/app/lib/pdf2img.ts` — PDF preview plus text extraction.
- `frontend/app/lib/storage.ts` — browser-local resume history.
- `hiring-agent/` — the reference Python pipeline studied for this implementation.

## Important Limits and Next Production Steps

This project implements the Hiring Agent user experience and compatible evaluation contract in Next.js. Python pipeline uses PyMuPDF, Pydantic, caching, and local Ollama/Gemini integration.

For multi-device production storage, replace browser `localStorage` with authentication plus Vercel Postgres/Neon and Vercel Blob. Add OCR for scanned PDFs, rate limiting for `/api/analyze`, and a durable job queue for expensive or multi-run score stability checks.

## Privacy and Fairness

- GitHub enrichment is optional and its absence is not treated as a negative signal.
- The app should support human review; it should not be the sole basis for hiring decisions.
- Users can delete their locally stored analyses from the report page.
