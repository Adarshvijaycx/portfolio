import { useEffect, useRef } from 'react';

export default function Reveal({ as: Tag = 'div', stagger = false, className = '', children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-in');
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-in');
            obs.unobserve(el);
          }
        });
      },
      { rootMargin: '-10% 0px -10% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const dataAttr = stagger ? { 'data-reveal-stagger': '' } : { 'data-reveal': '' };

  return (
    <Tag ref={ref} className={className} {...dataAttr} {...rest}>
      {children}
    </Tag>
  );
}
