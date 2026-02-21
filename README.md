# Portfolio 2026

A modern personal portfolio built with React, Vite, and Three.js, focused on interactive visuals, clean section-based architecture, and a production-ready contact flow.

## Highlights
- Animated hero with 3D scene and custom loading experience
- Dedicated sections for About, Skills, Experience, Projects, and Contact
- Responsive navigation with section tracking
- Contact form integrated with Formspree for real message delivery
- Modular component structure for easier maintenance and scaling

## Tech Stack
- React 19
- Vite 7
- Three.js + React Three Fiber + Drei
- Framer Motion
- Tailwind CSS
- ESLint

## Project Structure
```text
src/
  components/
    about/
    contact/
    home/
      scene/
      sections/
    navbar/
    ui/
  App.jsx
  main.jsx
```

## Getting Started
1. Install dependencies:
```bash
npm install
```
2. Create `.env` in the project root:
```bash
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
```
3. Start development server:
```bash
npm run dev
```

## Available Scripts
- `npm run dev` starts local development server
- `npm run build` creates production build
- `npm run preview` previews production build locally
- `npm run lint` runs ESLint checks

## Contact Form Setup
This project uses Formspree for handling contact form submissions.

1. Create a form in Formspree.
2. Copy your endpoint URL.
3. Set `VITE_FORMSPREE_ENDPOINT` in `.env`.

Submissions from the portfolio contact form will be forwarded to your configured email.

## Customization Notes
- Update section data in `src/components/home/sections/data.js`.
- Update personal profile text in `src/components/about/AboutCassette.jsx`.
- Update contact links and social URLs in `src/components/contact/Reachout.jsx`.

## Deployment
You can deploy on Vercel, Netlify, or any static hosting platform that supports Vite builds.

Build command:
```bash
npm run build
```

Output directory:
```text
dist
```
