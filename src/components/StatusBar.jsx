import { useEffect, useState } from 'react';

export default function StatusBar({ pathLabel }) {
  const [now, setNow] = useState('--:--:--');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        [d.getHours(), d.getMinutes(), d.getSeconds()]
          .map((n) => String(n).padStart(2, '0'))
          .join(':')
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="status-bar">
      <div className="status-bar__inner">
        <div className="status-bar__seg status-bar__mode">
          <span className="status-bar__bracket">[</span>
          <span className="status-bar__label">MODE:</span>
          <span className="status-bar__value">EXPLORING</span>
          <span className="status-bar__bracket">]</span>
        </div>
        <div className="status-bar__seg status-bar__path">
          <span className="status-bar__path-prefix">//</span>
          <span className="status-bar__path-value">{pathLabel}</span>
        </div>
        <div className="status-bar__spacer" />
        <div className="status-bar__seg status-bar__np">
          <span>&#9835; LES &mdash; Childish Gambino</span>
        </div>
        <div className="status-bar__seg">
          <span className="status-bar__np-icon">&#9654;</span>
          <span>Ready or Not</span>
        </div>
        <div className="status-bar__seg">
          <span className="status-bar__dot" />
          <span>{now}</span>
        </div>
      </div>
    </div>
  );
}
