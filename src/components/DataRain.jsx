import { useEffect, useRef } from 'react';

const CHARS =
  'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789@#$%&*+=';
const EASTER_EGGS = [
  'ADARSH', 'AV', 'HELLO', 'HUH', '404', '500', '403',
  'BUILD', 'SHIP', 'SCROLL', 'SCROLL NOW', 'CTRL+K', 'README'
];
const DEPTH = [
  { fontScale: 1.2, maxOpacity: 0.45, speedScale: 0.5, weight: 0.25 },
  { fontScale: 1.6, maxOpacity: 0.75, speedScale: 0.8, weight: 0.45 },
  { fontScale: 2.3, maxOpacity: 1.0, speedScale: 1.1, weight: 0.30 }
];

function pickDepth() {
  const t = Math.random();
  let acc = 0;
  for (let i = 0; i < DEPTH.length; i++) {
    acc += DEPTH[i].weight;
    if (t < acc) return i;
  }
  return DEPTH.length - 1;
}
function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}
function rollEgg() {
  return Math.random() < 0.25
    ? EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)]
    : null;
}

export default function DataRain({
  speed = 0.4,
  columnGap = 22,
  fontSize = 13,
  density = 50,
  opacity = 0.08
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const dens = Math.max(0, Math.min(1, density / 100));

    let width = 0;
    let height = 0;
    let streams = [];
    let columnX = [];
    let raf = null;
    let visible = false;
    let aborted = false;
    let lastTime = 0;

    const measure = () => {
      const r = container.getBoundingClientRect();
      width = r.width;
      height = r.height;
      if (!width || !height) return;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createStream = (initial) => {
      const layer = pickDepth();
      const cfg = DEPTH[layer];
      const word = rollEgg();
      const length = word
        ? word.length + 2 + Math.floor(Math.random() * 4)
        : 5 + Math.floor(Math.random() * 23);
      return {
        headRow: initial
          ? -Math.floor((Math.random() * height * 2) / (fontSize * cfg.fontScale))
          : 0,
        length,
        speed: (0.3 + Math.random() * 0.9) * speed * cfg.speedScale,
        accumulator: 0,
        glyphs: [],
        active: true,
        spacing: 0,
        headChar: randomChar(),
        depthLayer: layer,
        fontSize: Math.round(fontSize * cfg.fontScale),
        maxOpacity: cfg.maxOpacity,
        word,
        wordIndex: 0
      };
    };

    const resetStream = (s) => {
      const layer = pickDepth();
      const cfg = DEPTH[layer];
      const word = rollEgg();
      s.length = word
        ? word.length + 2 + Math.floor(Math.random() * 4)
        : 5 + Math.floor(Math.random() * 23);
      s.speed = (0.3 + Math.random() * 0.9) * speed * cfg.speedScale;
      s.accumulator = 0;
      s.glyphs = [];
      s.active = false;
      s.spacing = 4 + Math.floor(Math.random() * 26);
      s.headRow = 0;
      s.headChar = randomChar();
      s.depthLayer = layer;
      s.fontSize = Math.round(fontSize * cfg.fontScale);
      s.maxOpacity = cfg.maxOpacity;
      s.word = word;
      s.wordIndex = 0;
    };

    const initStreams = () => {
      if (!width) return;
      const cols = Math.floor(width / columnGap);
      columnX = [];
      for (let i = 0; i < cols; i++) columnX.push((i + 0.5) * columnGap);
      const prev = streams.length;
      if (cols < prev) streams.length = cols;
      else for (let i = prev; i < cols; i++) streams.push(createStream(true));
    };

    const updateStream = (s) => {
      if (!s.active) {
        s.spacing--;
        if (s.spacing <= 0) {
          if (Math.random() > dens) {
            s.spacing = 4 + Math.floor(Math.random() * 26);
            return;
          }
          s.active = true;
          s.headRow = -1;
          s.glyphs = [];
        }
        return;
      }
      s.accumulator += s.speed;
      while (s.accumulator >= 1) {
        s.accumulator -= 1;
        s.headRow++;
        s.glyphs.push(s.headChar);
        if (s.word && s.wordIndex < s.word.length) {
          s.headChar = s.word[s.wordIndex];
          s.wordIndex++;
        } else {
          s.headChar = randomChar();
        }
        if (s.glyphs.length > s.length) s.glyphs.shift();
      }
      if (s.headRow - s.length > Math.ceil(height / s.fontSize)) resetStream(s);
    };

    const drawStream = (s, x) => {
      if (!s.active) return;
      const fs = s.fontSize;
      const max = s.maxOpacity;
      ctx.font = `${fs}px JetBrains Mono, ui-monospace, monospace`;
      const headY = s.headRow * fs;
      if (headY >= 0 && headY < height) {
        ctx.globalAlpha = max;
        ctx.fillText(s.headChar, x, headY);
      }
      const len = s.glyphs.length;
      for (let i = 0; i < len - 1; i++) {
        const y = (s.headRow - (len - 1 - i)) * fs;
        if (y < 0 || y >= height) continue;
        const ch = s.glyphs[i];
        const protect =
          (ch >= 'A' && ch <= 'Z') ||
          (ch >= '0' && ch <= '9') ||
          ch === ' ' || ch === '-';
        if (Math.random() < 0.003 && !protect) s.glyphs[i] = randomChar();
        const dist = len - 1 - i;
        const a = max * Math.pow(0.82, dist);
        if (a < 0.03) continue;
        ctx.globalAlpha = a;
        ctx.fillText(s.glyphs[i], x, y);
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#191818';
      for (let i = 0; i < streams.length; i++) updateStream(streams[i]);
      for (let layer = 0; layer < DEPTH.length; layer++) {
        for (let i = 0; i < streams.length; i++) {
          if (streams[i].depthLayer === layer) drawStream(streams[i], columnX[i]);
        }
      }
      ctx.globalAlpha = 1;
    };

    const start = () => {
      if (raf !== null || aborted) return;
      lastTime = performance.now();
      const loop = (t) => {
        if (aborted) return;
        raf = requestAnimationFrame(loop);
        if (t - lastTime < 33) return;
        lastTime = t;
        render();
      };
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    measure();
    initStreams();

    const ro = new ResizeObserver(() => {
      measure();
      initStreams();
    });
    ro.observe(container);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          start();
        } else {
          visible = false;
          stop();
        }
      },
      { threshold: 0 }
    );
    io.observe(container);

    const onVis = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      aborted = true;
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [speed, columnGap, fontSize, density]);

  return (
    <div
      className="data-rain"
      ref={containerRef}
      aria-hidden="true"
      style={{ '--rain-opacity': opacity }}
    >
      <canvas className="data-rain__canvas" ref={canvasRef} />
      <div className="data-rain__fade" />
    </div>
  );
}
