import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

const useResizeObserver = (callback, elements, dependencies) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handle = () => callback();
      window.addEventListener('resize', handle);
      callback();
      return () => window.removeEventListener('resize', handle);
    }
    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const obs = new ResizeObserver(callback);
      obs.observe(ref.current);
      return obs;
    });
    callback();
    return () => observers.forEach((o) => o?.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...dependencies]);
};

const useAnimationLoop = (trackRef, targetVelocity, seqWidth, isHovered, hoverSpeed) => {
  const rafRef = useRef(null);
  const lastRef = useRef(null);
  const offsetRef = useRef(0);
  const velRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    if (reduce) {
      track.style.transform = 'translate3d(0, 0, 0)';
      return () => { lastRef.current = null; };
    }

    const animate = (t) => {
      if (lastRef.current === null) lastRef.current = t;
      const dt = Math.max(0, t - lastRef.current) / 1000;
      lastRef.current = t;
      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;
      const ease = 1 - Math.exp(-dt / ANIMATION_CONFIG.SMOOTH_TAU);
      velRef.current += (target - velRef.current) * ease;

      if (seqWidth > 0) {
        let next = offsetRef.current + velRef.current * dt;
        next = ((next % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = next;
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastRef.current = null;
    };
  }, [targetVelocity, seqWidth, isHovered, hoverSpeed, trackRef]);
};

export const LogoLoop = memo(function LogoLoop({
  items,
  speed = 60,
  direction = 'left',
  itemHeight = 28,
  gap = 32,
  pauseOnHover = true,
  hoverSpeed,
  fadeOut = true,
  fadeColor,
  className = '',
  ariaLabel = 'Marquee'
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const seqRef = useRef(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed;
    if (pauseOnHover) return 0;
    return undefined;
  }, [hoverSpeed, pauseOnHover]);

  const targetVelocity = useMemo(() => {
    const mag = Math.abs(speed);
    const dir = direction === 'left' ? 1 : -1;
    const sign = speed < 0 ? -1 : 1;
    return mag * dir * sign;
  }, [speed, direction]);

  const updateDimensions = useCallback(() => {
    const cw = containerRef.current?.clientWidth ?? 0;
    const sw = seqRef.current?.getBoundingClientRect?.().width ?? 0;
    if (sw > 0) {
      setSeqWidth(Math.ceil(sw));
      const need = Math.ceil(cw / sw) + ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, need));
    }
  }, []);

  useResizeObserver(updateDimensions, [containerRef, seqRef], [items, gap, itemHeight]);
  useAnimationLoop(trackRef, targetVelocity, seqWidth, isHovered, effectiveHoverSpeed);

  const onEnter = useCallback(() => {
    if (effectiveHoverSpeed !== undefined) setIsHovered(true);
  }, [effectiveHoverSpeed]);
  const onLeave = useCallback(() => {
    if (effectiveHoverSpeed !== undefined) setIsHovered(false);
  }, [effectiveHoverSpeed]);

  const cssVars = {
    '--ll-gap': `${gap}px`,
    '--ll-h': `${itemHeight}px`,
    ...(fadeColor && { '--ll-fade': fadeColor })
  };

  const lists = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, copyIdx) => (
        <ul
          className="logoloop__list"
          key={`copy-${copyIdx}`}
          role="list"
          aria-hidden={copyIdx > 0}
          ref={copyIdx === 0 ? seqRef : undefined}
        >
          {items.map((item, i) => (
            <li className="logoloop__item" key={`${copyIdx}-${i}`} role="listitem">
              <span className="logoloop__node">{item.node ?? item}</span>
            </li>
          ))}
        </ul>
      )),
    [copyCount, items]
  );

  return (
    <div
      ref={containerRef}
      className={`logoloop ${className}`}
      style={cssVars}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {fadeOut && (
        <>
          <div className="logoloop__fade logoloop__fade--l" aria-hidden />
          <div className="logoloop__fade logoloop__fade--r" aria-hidden />
        </>
      )}
      <div className="logoloop__track" ref={trackRef}>
        {lists}
      </div>
    </div>
  );
});

export default LogoLoop;
