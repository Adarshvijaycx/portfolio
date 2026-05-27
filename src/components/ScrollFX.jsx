import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollFX() {
  const barRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let raf = null;

    const update = () => {
      raf = null;
      const vh = window.innerHeight;
      const doc = document.documentElement;
      const scrolled = window.scrollY;
      const max = doc.scrollHeight - vh;
      const progress = max > 0 ? Math.min(1, Math.max(0, scrolled / max)) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;

      // Re-query each tick so DOM changes from route swaps are picked up.
      const watermarks = document.querySelectorAll('.section-watermark');
      for (const el of watermarks) {
        const parent = el.parentElement;
        if (!parent) continue;
        const rect = parent.getBoundingClientRect();
        const centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
        const drift = centerOffset * 60;
        el.style.transform = `translateY(${drift}px)`;
      }
    };

    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };

    // Run twice on mount/route change: once now, once after layout settles.
    update();
    const t = setTimeout(update, 50);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [location.pathname]);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <div className="scroll-progress__bar" ref={barRef} />
      </div>
    </>
  );
}

