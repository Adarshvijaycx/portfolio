import { useEffect, useRef } from 'react';

const MIN_OPACITY = 0.03;
const MAX_OPACITY = 0.22;

export default function GameOfLife({
  cellSize = 8,
  speed = 280,
  density = 25,
  color = '25, 24, 24'
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let grid = new Uint8Array(0);
    let nextGrid = new Uint8Array(0);
    let cellOpacity = new Float32Array(0);
    let generation = 0;
    let stableCount = 0;
    let lastPopulation = -1;
    let lastStepTime = 0;
    let globalOpacity = 0;
    let reseeding = false;
    let aborted = false;
    let visible = false;
    let raf = null;

    const measure = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      if (w === 0 || h === 0) return;
      width = w;
      height = h;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = 1;
      cols = Math.floor(w / (cellSize + gap));
      rows = Math.floor(h / (cellSize + gap));
    };

    const seed = () => {
      const total = cols * rows;
      if (total === 0) return;
      grid = new Uint8Array(total);
      nextGrid = new Uint8Array(total);
      cellOpacity = new Float32Array(total);
      generation = 0;
      stableCount = 0;
      lastPopulation = -1;
      lastStepTime = performance.now();
      for (let i = 0; i < total; i++) {
        const alive = Math.random() * 100 < density ? 1 : 0;
        grid[i] = alive;
        cellOpacity[i] = alive ? 1 : 0;
      }
    };

    const idx = (x, y) => {
      const sx = (x + cols) % cols;
      const sy = (y + rows) % rows;
      return sy * cols + sx;
    };

    const countNeighbors = (x, y) => {
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          n += grid[idx(x + dx, y + dy)];
        }
      }
      return n;
    };

    const step = () => {
      let pop = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const n = countNeighbors(x, y);
          nextGrid[i] = grid[i] ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
          pop += nextGrid[i];
        }
      }
      const tmp = grid;
      grid = nextGrid;
      nextGrid = tmp;
      generation++;
      if (pop === lastPopulation) stableCount++;
      else stableCount = 0;
      lastPopulation = pop;
      if (stableCount > 12 || pop === 0 || generation > 300) {
        reseedWithFade();
      }
    };

    const reseedWithFade = async () => {
      if (reseeding) return;
      reseeding = true;
      const t1 = performance.now();
      await new Promise((resolve) => {
        const tick = () => {
          if (aborted) return resolve();
          const k = Math.min((performance.now() - t1) / 400, 1);
          globalOpacity = 1 - k;
          k < 1 ? requestAnimationFrame(tick) : resolve();
        };
        requestAnimationFrame(tick);
      });
      if (aborted) return;
      seed();
      const t2 = performance.now();
      await new Promise((resolve) => {
        const tick = () => {
          if (aborted) return resolve();
          const k = Math.min((performance.now() - t2) / 600, 1);
          globalOpacity = k;
          k < 1 ? requestAnimationFrame(tick) : resolve();
        };
        requestAnimationFrame(tick);
      });
      reseeding = false;
    };

    const interpolate = () => {
      for (let i = 0; i < cellOpacity.length; i++) {
        const target = grid[i] ? 1 : 0;
        const cur = cellOpacity[i];
        if (cur === target) continue;
        const next = cur + (target - cur) * 0.08;
        cellOpacity[i] = Math.abs(next - target) < 0.01 ? target : next;
      }
    };

    const render = () => {
      if (aborted || width === 0 || height === 0) return;
      const gap = 1;
      ctx.clearRect(0, 0, width, height);
      const totalW = cols * (cellSize + gap);
      const totalH = rows * (cellSize + gap);
      const ox = (width - totalW) / 2;
      const oy = (height - totalH) / 2;
      const g = globalOpacity;
      if (g <= 0) return;
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const fillColor = isDark ? '184, 188, 196' : color;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const op = cellOpacity[i];
          const a = (MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * op) * g;
          ctx.fillStyle = `rgba(${fillColor}, ${a})`;
          ctx.fillRect(ox + x * (cellSize + gap), oy + y * (cellSize + gap), cellSize, cellSize);
        }
      }
    };

    const startLoop = () => {
      if (raf) return;
      if (globalOpacity === 0 && !reseeding) globalOpacity = 1;
      lastStepTime = performance.now();
      const tick = () => {
        if (aborted || !visible) {
          raf = null;
          return;
        }
        const now = performance.now();
        if (!reseeding && now - lastStepTime >= speed) {
          step();
          lastStepTime = now;
        }
        interpolate();
        render();
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    measure();
    seed();

    if (reduce) {
      for (let i = 0; i < 20; i++) step();
      globalOpacity = 1;
      for (let i = 0; i < cellOpacity.length; i++) cellOpacity[i] = grid[i] ? 1 : 0;
      render();
    }

    const ro = new ResizeObserver(() => {
      measure();
      seed();
      if (reduce) {
        for (let i = 0; i < 20; i++) step();
        for (let i = 0; i < cellOpacity.length; i++) cellOpacity[i] = grid[i] ? 1 : 0;
        render();
      }
    });
    ro.observe(container);

    const io = new IntersectionObserver(
      ([entry]) => {
        const isVis = entry.isIntersecting;
        if (isVis && !visible) {
          visible = true;
          if (!reduce) startLoop();
        } else if (!isVis && visible) {
          visible = false;
          stopLoop();
        }
      },
      { threshold: 0 }
    );
    io.observe(container);

    return () => {
      aborted = true;
      stopLoop();
      ro.disconnect();
      io.disconnect();
    };
  }, [cellSize, speed, density, color]);

  return (
    <div ref={containerRef} className="game-of-life" aria-hidden="true">
      <canvas ref={canvasRef} className="game-of-life__canvas" />
    </div>
  );
}
