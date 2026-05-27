# Adarsh Vijay — Portfolio

> A React + Vite portfolio with a developer-terminal aesthetic. Boot animations, custom cursor, glass-morphism nav, status bar with live clock, and a roster of canvas/WebGL background effects that actually pull their weight.

```
$ whoami
adarsh.vijay — software engineer
$ status
[ MODE: EXPLORING ]  // home  •  ► Ready or Not  •  01:40:13
```

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle
npm run preview  # preview the build
```

That's it. No env vars, no backend, no auth — drop in and go.

---

## What's inside

A single-page application with four routes, a persistent layout shell, and a small set of reusable visual primitives. The fun parts are the backgrounds: each section gets its own canvas-driven effect that responds to scroll, hover, and theme.

### Routes

| Path        | Page    | Background                         | Hook                                    |
| ----------- | ------- | ---------------------------------- | --------------------------------------- |
| `/`         | Home    | `DataRain`, `PixelBackground`, `DotGrid` | hero + about glance + featured work     |
| `/about`    | About   | `Aurora` shader, `LogoLoop`        | intro, stats, stack carousel, lets-talk |
| `/work`     | Work    | `LetterGlitch`                     | full project list with glass cards      |
| `/contact`  | Contact | `GameOfLife`                       | CTA buttons + email link                |

### Persistent layout

`App.jsx` mounts these once and keeps them across route changes:

- `BootSequence` — 1.7s clip-path intro on first load
- `NoiseOverlay` — subtle film grain, blends differently per theme
- `Cursor` — custom dot + ring + corner brackets when hovering interactive elements
- `ScrollFX` — a top progress bar
- `TopNav` — floating glass pill with `GlassSurface` SVG distortion
- `StatusBar` — bottom strip with mode, theme toggle, current path, a quote, the song you're not actually listening to, and a live clock

---

## Theme system

Light is the default. Dark mode is a token override on `[data-theme="dark"]` — switching it flips the entire palette without re-rendering the React tree.

```css
:root        { --bg: #f4f4f4; --text: #191818; ... }
[data-theme="dark"] { --bg: #1a1a1c; --text: #e8e8e8; ... }
```

The toggle lives in the status bar, next to `[ MODE: EXPLORING ]`. It:

1. Reads `localStorage.getItem('av-theme')` on mount
2. Falls back to `prefers-color-scheme`
3. Sets `data-theme` on `<html>` and persists the choice

Canvas-based backgrounds (`DataRain`, `GameOfLife`, `LetterGlitch`) read the current theme at render time and swap to a light-grey stroke color when dark, since the original `#191818` would vanish into the dark background.

A `useTheme` hook (in `src/hooks/`) observes the attribute via `MutationObserver` so any component can re-render on theme flips.

---

## Project structure

```
.
├── public/
│   └── favicon.svg              blue square + cream "A" — matches nav brand
├── index.html                   loads Fraunces, Plus Jakarta, JetBrains Mono
├── vite.config.js               port 5173, opens automatically
├── package.json
└── src/
    ├── main.jsx                 entry, BrowserRouter
    ├── App.jsx                  layout shell, route table, scroll-to-top
    ├── data/
    │   └── projects.js          three featured projects, hardcoded
    ├── hooks/
    │   └── useTheme.js          observes data-theme on <html>
    ├── pages/
    │   ├── Home.jsx             hero + about glance + featured work
    │   ├── About.jsx            intro, stats, stack carousel, lets-talk
    │   ├── Work.jsx             grid of glass project cards
    │   └── Contact.jsx          centered CTA + email
    ├── components/
    │   ├── TopNav.jsx           glass pill, NavLink active states
    │   ├── StatusBar.jsx        bottom HUD strip
    │   ├── ThemeToggle.jsx      sun/moon button
    │   ├── BootSequence.jsx     1.7s intro, clip-path reveal
    │   ├── Cursor.jsx           dot + ring + target brackets
    │   ├── NoiseOverlay.jsx
    │   ├── ScrollFX.jsx         top progress bar
    │   ├── Reveal.jsx           IntersectionObserver-based fade-in
    │   ├── HoverDecrypt.jsx     character-scramble on hover
    │   ├── GlassSurface.jsx     SVG-filter glass distortion
    │   ├── Footer.jsx           huge serif sign-off
    │   ├── Aurora.jsx           shader gradient (ogl)
    │   ├── DataRain.jsx         matrix-style falling glyphs
    │   ├── DotGrid.jsx          interactive dot field
    │   ├── PixelBackground.jsx  cellular pixel drift
    │   ├── LetterGlitch.jsx     animated character grid
    │   ├── GameOfLife.jsx       conway's, with reseed-on-stable
    │   ├── LogoLoop.jsx         infinite marquee for the stack list
    │   ├── Dither.jsx           postprocessing dither shader
    │   └── Cursor.jsx
    └── styles/
        └── styles.css           every token + every component, single file
```

---

## Stack

| Layer    | Tooling                                                         |
| -------- | --------------------------------------------------------------- |
| Build    | Vite 5, `@vitejs/plugin-react`                                  |
| Runtime  | React 18, react-router-dom 6                                    |
| WebGL    | three, `@react-three/fiber`, `@react-three/postprocessing`, ogl |
| Type     | Plain JSX (no TS — could be added easily)                       |
| Styling  | Hand-written CSS, design tokens, no preprocessor                |

Type system, test runner, and linter are intentionally absent — this is a portfolio, not a framework.

---

## How the visual effects work

Each effect is a self-contained component that:

1. Mounts a `<canvas>` (or shader) absolutely-positioned inside its section
2. Uses `ResizeObserver` to track its container, `IntersectionObserver` to pause when offscreen
3. Respects `prefers-reduced-motion: reduce` and bails out early when set
4. Reads `data-theme` (where applicable) so colors stay legible in both themes

`DataRain` and `GameOfLife` adjust their stroke color and CSS opacity when dark is active. `LetterGlitch` is remounted via a `key={theme}` prop on the Work page since its effect doesn't track color changes internally.

---

## Things worth noticing

- The custom cursor manually subtracts each element's radius every frame so the small dot stays centered inside the larger ring even as the ring scales on hover.
- The status bar uses `backdrop-filter: blur` with theme-aware glass tokens, so it adapts seamlessly.
- The boot sequence uses `clip-path` to wipe upward — it's pure CSS once mounted, no extra JS.
- `HoverDecrypt` rebuilds its scramble on every hover; the speed is tunable per-instance.
- Section watermarks (the giant `01`, `02`, `03`, `04`) are absolutely-positioned with `color: color-mix(...)` so they automatically tint to the current theme.

---

## Scripts

```json
{
  "dev":     "vite",
  "build":   "vite build",
  "preview": "vite preview"
}
```

---

## License

Personal project, not currently licensed for redistribution. If you want to use a chunk of this for your own site, open an issue and ask — I'm friendly.

---

```
// section.fin
```
