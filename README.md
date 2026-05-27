# Adarsh Vijay — Portfolio

React + Vite single-page portfolio. Routes for Home / About / Work / Contact.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Structure

```
.
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              app entry, router
    ├── App.jsx               layout shell + routes
    ├── components/
    │   ├── TopNav.jsx        nav with active route
    │   ├── StatusBar.jsx     bottom bar with clock
    │   ├── BootSequence.jsx  load animation
    │   ├── Cursor.jsx        custom cursor + target brackets
    │   ├── Footer.jsx
    │   ├── NoiseOverlay.jsx
    │   └── Reveal.jsx        scroll-reveal wrapper
    ├── pages/
    │   ├── Home.jsx          hero + intro
    │   ├── About.jsx         intro + stats
    │   ├── Work.jsx          project cards
    │   └── Contact.jsx       CTAs
    └── styles/
        └── styles.css
```
