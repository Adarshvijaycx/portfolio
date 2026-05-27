import { useEffect, useRef } from 'react';

export default function Cursor() {
  const cursorRef = useRef(null);
  const targetRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFine || isReduced) return;

    const cursor = cursorRef.current;
    const target = targetRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!cursor || !target || !dot || !ring) return;

    document.body.classList.add('has-custom-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx, cy = my, rx = mx, ry = my;
    let raf;
    let hoveredEl = null;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.classList.add('is-active');
    };
    const onEnter = () => cursor.classList.add('is-active');
    const onLeave = () => cursor.classList.remove('is-active');

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);

    const tick = () => {
      cx += (mx - cx) * 0.6;
      cy += (my - cy) * 0.6;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${cx}px,${cy}px)`;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      if (hoveredEl) {
        const r = hoveredEl.getBoundingClientRect();
        target.style.transform = `translate(${r.left}px,${r.top}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const hoverSelector = 'a, button, .work-card, .hero__card, .stat';

    const handleEnter = (e) => {
      const el = e.currentTarget;
      hoveredEl = el;
      cursor.classList.add('is-hover');
      const r = el.getBoundingClientRect();
      target.style.width = r.width + 'px';
      target.style.height = r.height + 'px';
      target.style.transform = `translate(${r.left}px,${r.top}px)`;
      target.classList.add('is-active');
    };
    const handleLeave = () => {
      hoveredEl = null;
      cursor.classList.remove('is-hover');
      target.classList.remove('is-active');
    };

    // attach + observe DOM (re-bind on route changes)
    const bind = () => {
      document.querySelectorAll(hoverSelector).forEach((el) => {
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
    };
    const unbind = () => {
      document.querySelectorAll(hoverSelector).forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };

    bind();
    const mo = new MutationObserver(() => {
      unbind();
      bind();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      unbind();
      mo.disconnect();
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} aria-hidden="true">
        <div className="cursor__dot" ref={dotRef} />
        <div className="cursor__ring" ref={ringRef} />
      </div>
      <div className="cursor-target" ref={targetRef} aria-hidden="true">
        <span className="cursor-target__c cursor-target__c--tl" />
        <span className="cursor-target__c cursor-target__c--tr" />
        <span className="cursor-target__c cursor-target__c--bl" />
        <span className="cursor-target__c cursor-target__c--br" />
      </div>
    </>
  );
}
