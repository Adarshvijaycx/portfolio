import { useEffect, useRef } from 'react';

const INFLUENCE = 120;
const MAX_DISPLACE = 18;
const MAX_SCALE = 2.5;
const LERP_TARGET = 0.12;
const LERP_RETURN = 0.06;
const BREATHE_SPEED = 0.008;
const DPR_CAP = 2;
const FRAME_INTERVAL = 1000 / 30;

export default function DotGrid({
  spacing = 24,
  dotSize = 1.5,
  opacity = 18,
  color = '#1b5def'
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window && navigator.maxTouchPoints > 0;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');

    let dots = [];
    let width = 0;
    let height = 0;
    let cachedRect = null;
    let isVisible = false;
    let breathePhase = Math.random() * Math.PI * 2;
    let dotSprite = null;
    let spriteSize = 0;
    let raf = null;
    let lastTime = 0;
    let resizeTimer = null;

    const pointer = { x: -9999, y: -9999, active: false };

    const setupSprite = () => {
      const r = dotSize * MAX_SCALE;
      const size = Math.ceil(r * 2) + 2;
      const sprite = document.createElement('canvas');
      sprite.width = size;
      sprite.height = size;
      const sctx = sprite.getContext('2d');
      sctx.fillStyle = color;
      sctx.beginPath();
      sctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
      sctx.fill();
      dotSprite = sprite;
      spriteSize = size;
    };

    const layout = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      width = rect.width;
      height = rect.height;
      cachedRect = null;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      setupSprite();

      const half = spacing / 2;
      dots = [];
      for (let y = half; y < height; y += spacing) {
        for (let x = half; x < width; x += spacing) {
          dots.push({
            homeX: x,
            homeY: y,
            x,
            y,
            size: dotSize,
            targetX: x,
            targetY: y,
            targetSize: dotSize
          });
        }
      }
    };

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => (pointer.active = false);
    const onEnter = () => (pointer.active = true);

    const onScrollOrResize = () => {
      cachedRect = null;
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layout, 200);
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (now - lastTime < FRAME_INTERVAL) return;
      lastTime = now;
      if (!isVisible) return;

      breathePhase += BREATHE_SPEED;
      if (breathePhase > Math.PI * 2) breathePhase -= Math.PI * 2;

      if (!cachedRect) cachedRect = container.getBoundingClientRect();
      const rect = cachedRect;
      const px = pointer.x - rect.left;
      const py = pointer.y - rect.top;
      const inField =
        pointer.active &&
        px >= -INFLUENCE && px <= width + INFLUENCE &&
        py >= -INFLUENCE && py <= height + INFLUENCE;

      for (const dot of dots) {
        if (inField) {
          const dx = dot.homeX - px;
          const dy = dot.homeY - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < INFLUENCE && dist > 0) {
            const t = 1 - dist / INFLUENCE;
            const t2 = t * t;
            const angle = Math.atan2(dy, dx);
            dot.targetX = dot.homeX + Math.cos(angle) * MAX_DISPLACE * t2;
            dot.targetY = dot.homeY + Math.sin(angle) * MAX_DISPLACE * t2;
            dot.targetSize = dotSize * (1 + (MAX_SCALE - 1) * t2);
          } else {
            dot.targetX = dot.homeX;
            dot.targetY = dot.homeY;
            dot.targetSize = dotSize;
          }
        } else {
          dot.targetX = dot.homeX;
          dot.targetY = dot.homeY;
          dot.targetSize = dotSize;
        }
        const lerp =
          dot.targetX === dot.homeX && dot.targetY === dot.homeY
            ? LERP_RETURN
            : LERP_TARGET;
        dot.x += (dot.targetX - dot.x) * lerp;
        dot.y += (dot.targetY - dot.y) * lerp;
        dot.size += (dot.targetSize - dot.size) * lerp;
      }

      const breathe = 1 + 0.2 * Math.sin(breathePhase);
      const alpha = (opacity / 100) * breathe;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = alpha;
      const sprite = dotSprite;
      const ssize = spriteSize;
      for (const dot of dots) {
        const s = (dot.size / (dotSize * MAX_SCALE)) * ssize;
        ctx.drawImage(sprite, dot.x - s * 0.5, dot.y - s * 0.5, s, s);
      }
      ctx.globalAlpha = 1;
    };

    layout();

    if (reduce) {
      // draw a static frame and stop
      lastTime = 0;
      isVisible = true;
      requestAnimationFrame((t) => {
        lastTime = t - FRAME_INTERVAL;
        tick(t);
        cancelAnimationFrame(raf);
      });
      return () => {};
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: '50px', threshold: 0 }
    );
    io.observe(container);

    if (!isTouch) {
      document.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('mouseleave', onLeave);
      document.addEventListener('mouseenter', onEnter);
    }
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScrollOrResize, { passive: true });

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScrollOrResize);
      clearTimeout(resizeTimer);
    };
  }, [spacing, dotSize, opacity, color]);

  return (
    <div ref={containerRef} className="dot-grid" aria-hidden="true">
      <canvas ref={canvasRef} className="dot-grid__canvas" />
    </div>
  );
}
