# Vaibhav Goel — Portfolio

<div align="center">
  <img alt="Project Status" src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge&logo=appveyor">
  <img alt="React" src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white">
</div>

<br />

**Live:** [vaibhavgoel.dev](https://www.vaibhavgoel.dev/)

A minimal, monochrome portfolio built around interaction rather than decoration: you can trace requests through a live architecture diagram, read a case study for every project, filter projects, explore where each technology was used, and drive the whole site from a command palette.

## Features

- **Case studies:** Every project has its own page at `/work/<id>` covering the problem, approach, architecture, results and what's next. The architecture diagram pins in place and builds up step by step as you scroll, key numbers count up, and charts animate in. Everything is drawn in SVG and CSS from data, with no screenshots.
- **Interactive architecture diagram:** The Agentic Ledger centerpiece traces a vendor bill or a payment ping through its agents, with packets animating along the active route. Hover, focus or tap a node to read what it does.
- **Project filters:** AI/ML, Backend, Hardware and Frontend chips with animated layout transitions and a live result count.
- **Skill explorer:** Technologies used in a project or role show where they were used, and one click filters the Work section to match.
- **Command palette:** Open it with `Ctrl/⌘ + K` or `/` to jump to sections, open case studies by name or tech, copy the email address, download the résumé, or open GitHub and LinkedIn. It is fully keyboard-driven.
- **Pre-rendered pages:** `npm run build` renders every route to static HTML with its own title, description and social tags, then hydrates it in the browser, so crawlers and link previews see real content.
- **Scroll-aware UI:** The navbar highlights the section in view, a progress bar runs along the top, and the experience timeline fills as you scroll.
- **Accessible by default:** Respects `prefers-reduced-motion`, has visible focus rings and a skip link, keeps text contrast at WCAG AA, and labels interactive SVG.
- **Smooth, cheap animation:** Lenis smooth scrolling, plus pointer effects (hero glow, spotlight cards, custom cursor) that run on motion values and CSS variables instead of React re-renders.

## Tech Stack

- **Framework:** React 19, Vite 7
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **Scrolling:** Lenis
- **Icons:** Lucide
- **Hosting:** Vercel

## Project Structure

```
src/
├── data/
│   ├── content.js         # Profile links, projects, experience, skills
│   ├── caseStudies.js     # Case study write-ups and their diagram layouts
│   └── meta.js            # Routes plus per-page title, description and canonical URL
├── lib/                   # Router, scroll, diagram geometry, hooks
├── pages/                 # Home, CaseStudy, NotFound
├── components/
│   ├── layout/            # Navbar, grid background, scroll progress
│   ├── sections/          # Hero, About, Work, Experience, Stack, Contact, Footer
│   ├── case-study/        # Scroll-driven diagram, stat counters, bar charts
│   └── ui/                # Command palette, Agentic Ledger diagram, cursor, cards, Link
├── entry-server.jsx       # Server render used by scripts/prerender.js
└── App.jsx
```

To update projects, roles or skills, edit `src/data/content.js`. Tech names are matched exactly between `projects[].tech`, `experience[].tech` and `skills`, which is how the skill explorer links them.

To add a case study, add an entry to `src/data/caseStudies.js` keyed by the project's `id`. It gets a page, a sitemap entry and a pre-rendered HTML file automatically. Diagram nodes take positions per layout (`wide` for desktop, `tall` for phones) and a `step` that decides when they appear as you scroll.

## Getting Started

You need Node.js 20.19+ or 22.12+ (required by Vite 7).

```bash
npm install      # install dependencies
npm run dev      # start the dev server
npm run lint     # lint
npm run build    # production build in dist/, then pre-render every route
npm run preview  # serve the production build locally
```

## Contact & Links

- **Email:** [vaibhav.goel0531@gmail.com](mailto:vaibhav.goel0531@gmail.com)
- **GitHub:** [@Vaibhav8075](https://github.com/Vaibhav8075)
- **LinkedIn:** [Vaibhav Goel](https://www.linkedin.com/in/vaibhav-goel-23983b344)

---
*Designed and engineered by Vaibhav Goel.*
