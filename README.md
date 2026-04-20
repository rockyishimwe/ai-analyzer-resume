# Resumind

Resumind is an AI-powered resume review web app built to help job seekers upload resumes, compare them against a target role, receive ATS-style feedback, and track reviewed submissions from a clean dashboard.

This project started as a simple React Router app and evolved into a more complete product experience with authentication, file upload, AI analysis, dashboard history, reusable UI components, validation, loading states, and a much stronger UI/UX system.

## Overview

Resumind is designed around a practical workflow:

1. Sign in to the app.
2. Upload a resume PDF.
3. Add the company name, job title, and job description.
4. Let the app analyze the resume with AI.
5. Review ATS score, category scores, strengths, and improvement suggestions.
6. Return later from the dashboard to revisit saved reviews.

## Core Features

- Public landing page that introduces the product clearly
- Authentication flow for protected workspace routes
- Resume upload with PDF validation
- AI-powered resume analysis
- ATS scoring and category-based feedback
- Detailed review panels for tone, content, structure, and skills
- Private dashboard for saved resume reviews
- Upload, auth, dashboard, and review flows with improved UI/UX
- Better error handling and user feedback with alerts and toasts
- Loading skeletons for a smoother experience
- Mobile-friendly layout improvements
- Reusable UI components for cleaner maintenance

## Project Journey

This repository is easier to understand when viewed in stages.

### Stage 1: Base App Setup

The project began as a React Router starter with Tailwind support and a basic app structure.

At this stage, the focus was:

- creating the initial routes
- setting up the project structure
- connecting the frontend shell
- preparing the app for resume-related workflows

### Stage 2: Core Resume Review Flow

The app then moved into its first functional product version.

This stage introduced:

- resume upload flow
- job/company input fields
- PDF-to-image preview support
- AI feedback generation
- storing review data for later access
- resume details page for feedback output

This was the point where the app became usable, but still felt closer to a prototype than a polished product.

### Stage 3: Stability and Developer Experience Improvements

After the core flow worked, the next stage focused on making the app safer and easier to maintain.

Improvements included:

- stronger utility helpers
- better type safety
- more reliable validation
- safer UUID generation
- clearer error handling for async operations
- project-wide cleanup to reduce fragile flows

### Stage 4: UX Foundations

The next step improved the experience of actually using the app.

This stage added:

- reusable form components
- loading skeletons
- alert and toast feedback
- better empty states
- improved accessibility support
- responsive utility patterns
- performance helper utilities

This stage made the app feel more complete and less abrupt during loading, failure, and retry states.

### Stage 5: Product-Level UI/UX Redesign

The latest major stage focused on presentation, product clarity, and consistency.

This redesign introduced:

- a proper landing page instead of using the dashboard as the homepage
- a dedicated dashboard route
- a more intentional visual language
- cleaner navigation
- improved auth screen
- redesigned upload screen
- redesigned dashboard cards
- redesigned review summary and ATS panels
- redesigned accordion-based detailed feedback sections
- stronger spacing, hierarchy, and visual consistency across the app

This is the stage that pushed the project from "working app" to "strong portfolio-ready product experience."

### Stage 6: Current Status

Right now, Resumind is in a strong MVP / beta stage.

It is already suitable for:

- portfolio presentation
- GitHub showcase
- demo submission
- coursework/project presentation
- early client or stakeholder review

The app is close to final, but a true production-ready final stage would still benefit from:

- full end-to-end testing
- final deployment verification
- more production QA
- more edge-case testing around uploads and AI responses
- final accessibility and device testing

## Screens and Flow

### Landing Page

The landing page introduces Resumind as a polished product and explains the workflow before users sign in.

### Auth Page

The auth page explains why sign-in matters and connects users back into the protected review workspace.

### Upload Page

Users provide:

- company name
- job title
- job description
- resume PDF

After submission, the app uploads the file, prepares the preview, runs analysis, stores the result, and redirects the user to the review page.

### Dashboard

The dashboard shows previously analyzed resumes, score summaries, and quick access back into each review.

### Review Page

The detailed review page shows:

- overall score
- ATS score
- score breakdown
- strengths
- areas to improve
- resume preview

## Tech Stack

### Frontend

- React 19
- React Router 7
- TypeScript
- Tailwind CSS 4

### UI and Utilities

- shadcn-style component setup
- `clsx`
- `tailwind-merge`
- `lucide-react`
- `zustand`
- `zod`
- `react-dropzone`

### File and AI Handling

- `pdfjs-dist` for PDF-related processing
- Puter SDK integration for:
  - authentication
  - file storage
  - key-value storage
  - AI calls

## Project Structure

```text
app/
  components/        Reusable UI and feature components
  hooks/             Custom hooks
  lib/               Utilities, store setup, validation, performance helpers
  routes/            App routes such as home, auth, upload, dashboard, resume
  types/             Shared project types
public/
  icons/             UI icons
  images/            Backgrounds, previews, and visual assets
README.md            Project documentation
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Open the app

The default local URL should be:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run typecheck
```

Runs React Router type generation and TypeScript checks.

```bash
npm run build
```

Builds the project for production.

```bash
npm start
```

Serves the production build.

## Validation and UX Improvements Added

Some of the major internal improvements made during development include:

- Zod form validation
- reusable form input components
- toast notifications
- alert components
- loading skeleton states
- accessibility improvements
- responsive layout utilities
- performance helper utilities
- safer utility functions

The detailed implementation summary is also documented in [IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md).

## Why This Project Matters

Many resume tools stop at giving a score. Resumind aims to be more useful than that by combining:

- role-specific context
- readable feedback
- saved review history
- clearer UI
- better user flow from first visit to repeat usage

The goal is not just analysis, but a product experience that helps users improve over time.

## Current Strengths

- clear product flow
- improved visual design
- reusable components
- better UX feedback states
- protected dashboard workflow
- structured analysis output
- GitHub-ready organization

## Remaining Improvements for a Final Production Stage

- full integration and end-to-end tests
- deployment QA
- stronger retry/recovery flows
- deeper accessibility audit
- advanced dashboard filters and search
- better analytics and usage tracking
- optional export/share features

## Author Notes

This project reflects a progression from a starter codebase into a much more intentional product experience. The most important improvements were not only technical, but also structural and experiential:

- separating the landing page from the dashboard
- improving clarity of the app's purpose
- making the workflow easier to understand
- making the interface feel more polished and trustworthy

## License

This project is currently shared for portfolio and educational purposes unless a separate license is added later.
