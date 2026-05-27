import { useEffect, useState } from 'react';

const STORAGE_KEY = 'av-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'light';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle__bracket">[</span>
      <span className="theme-toggle__icon" aria-hidden="true">
        {isDark ? (
          <svg viewBox="0 0 16 16" width="11" height="11">
            <path
              d="M12 9.5A5.5 5.5 0 0 1 6.5 4c0-.7.13-1.36.37-1.97A6 6 0 1 0 13.97 9.13c-.61.24-1.27.37-1.97.37Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" width="11" height="11">
            <circle cx="8" cy="8" r="3" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <line x1="8" y1="1.5" x2="8" y2="3" />
              <line x1="8" y1="13" x2="8" y2="14.5" />
              <line x1="1.5" y1="8" x2="3" y2="8" />
              <line x1="13" y1="8" x2="14.5" y2="8" />
              <line x1="3.3" y1="3.3" x2="4.3" y2="4.3" />
              <line x1="11.7" y1="11.7" x2="12.7" y2="12.7" />
              <line x1="3.3" y1="12.7" x2="4.3" y2="11.7" />
              <line x1="11.7" y1="4.3" x2="12.7" y2="3.3" />
            </g>
          </svg>
        )}
      </span>
      <span className="theme-toggle__label">{isDark ? 'DARK' : 'LIGHT'}</span>
      <span className="theme-toggle__bracket">]</span>
    </button>
  );
}
