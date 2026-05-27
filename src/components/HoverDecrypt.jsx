import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';

const SCRAMBLE_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';

function scrambleChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

function fullScramble(target) {
  return target
    .split('')
    .map((c) => (c === ' ' ? ' ' : scrambleChar()))
    .join('');
}

export default function HoverDecrypt({
  defaultText,
  hoverText,
  speed = 45,
  className = '',
  scrambledClassName = ''
}) {
  const [display, setDisplay] = useState(() => fullScramble(defaultText));
  const [revealedCount, setRevealedCount] = useState(0);

  const intervalRef = useRef(null);
  const targetRef = useRef(defaultText);
  const revealedRef = useRef(0);
  const mountedRef = useRef(false);

  const stopAnim = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAnim = useCallback(() => {
    stopAnim();
    intervalRef.current = setInterval(() => {
      const target = targetRef.current;
      const len = target.length;
      if (revealedRef.current > len) revealedRef.current = len;
      if (revealedRef.current >= len) {
        setDisplay(target);
        setRevealedCount(len);
        stopAnim();
        return;
      }
      revealedRef.current += 1;
      const revealed = revealedRef.current;
      const next = target
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < revealed) return char;
          return scrambleChar();
        })
        .join('');
      setDisplay(next);
      setRevealedCount(revealed);
    }, speed);
  }, [speed, stopAnim]);

  const transitionTo = useCallback(
    (text) => {
      targetRef.current = text;
      revealedRef.current = 0;
      setRevealedCount(0);
      setDisplay(fullScramble(text));
      startAnim();
    },
    [startAnim]
  );

  useLayoutEffect(() => {
    mountedRef.current = true;
    targetRef.current = defaultText;
    revealedRef.current = 0;
    setDisplay(fullScramble(defaultText));
    setRevealedCount(0);
    return () => {
      mountedRef.current = false;
      stopAnim();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultText]);

  useEffect(() => {
    startAnim();
    return () => stopAnim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEnter = useCallback(() => transitionTo(hoverText), [hoverText, transitionTo]);
  const onLeave = useCallback(() => transitionTo(defaultText), [defaultText, transitionTo]);

  const target = targetRef.current;
  const targetLen = target.length;

  return (
    <span
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ display: 'inline-block', whiteSpace: 'pre-wrap', cursor: 'default' }}
      aria-label={defaultText}
    >
      {display.split('').map((char, i) => {
        const isRevealed = i < revealedCount && char !== ' ';
        const cls = isRevealed ? className : scrambledClassName || className;
        return (
          <span key={i} className={cls} aria-hidden="true">
            {char}
          </span>
        );
      })}
    </span>
  );
}

