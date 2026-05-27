import { useEffect, useRef } from 'react';

class Pixel {
  constructor(canvas, ctx, x, y, color, speed, delay) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.rand(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = this.rand(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (canvas.width + canvas.height) * 0.01;
    this.isShimmer = false;
    this.isReverse = false;
  }
  rand(min, max) {
    return Math.random() * (max - min) + min;
  }
  draw() {
    const offset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + offset, this.y + offset, this.size, this.size);
  }
  tick() {
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) this.isShimmer = true;
    if (this.isShimmer) {
      if (this.size >= this.maxSize) this.isReverse = true;
      else if (this.size <= this.minSize) this.isReverse = false;
      this.size += this.isReverse ? -this.speed : this.speed;
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }
}

function getEffectiveSpeed(value, reducedMotion) {
  const min = 0;
  const max = 100;
  const throttle = 0.001;
  const parsed = parseInt(value, 10);
  if (parsed <= min || reducedMotion) return min;
  if (parsed >= max) return max * throttle;
  return parsed * throttle;
}

export default function PixelBackground({
  gap = 8,
  speed = 35,
  colors = '#1b5def,#e25327,#191818'
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');

    const init = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const palette = colors.split(',');
      const px = [];
      const g = parseInt(gap, 10);
      for (let x = 0; x < w; x += g) {
        for (let y = 0; y < h; y += g) {
          const color = palette[Math.floor(Math.random() * palette.length)];
          const dx = x - w / 2;
          const dy = y - h / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const delay = reduce ? 0 : distance;
          px.push(
            new Pixel(canvas, ctx, x, y, color, getEffectiveSpeed(speed, reduce), delay)
          );
        }
      }
      pixelsRef.current = px;
    };

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const now = performance.now();
      const passed = now - lastTimeRef.current;
      const interval = 1000 / 60;
      if (passed < interval) return;
      lastTimeRef.current = now - (passed % interval);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const px = pixelsRef.current;
      for (let i = 0; i < px.length; i++) px[i].tick();
    };

    init();
    if (!reduce) loop();
    else {
      // draw a single static frame
      const px = pixelsRef.current;
      for (let i = 0; i < px.length; i++) {
        px[i].size = px[i].maxSize;
        px[i].draw();
      }
    }

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafRef.current);
      init();
      if (!reduce) loop();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [gap, speed, colors]);

  return (
    <div ref={containerRef} className="pixel-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="pixel-bg__canvas" />
    </div>
  );
}
