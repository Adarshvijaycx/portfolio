import { useEffect, useState } from 'react';

export default function BootSequence() {
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setDone(true), 900);
    const t2 = setTimeout(() => setRemoved(true), 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (removed) return null;

  return (
    <div className={'boot' + (done ? ' is-done' : '')}>
      <div className="boot__logo">
        <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
          <rect
            className="boot__rect"
            x="6"
            y="6"
            width="52"
            height="52"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="boot__stroke"
            d="M20 44 L32 18 L44 44 M25 36 L39 36"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
      </div>
    </div>
  );
}
