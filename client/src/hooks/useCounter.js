import { useEffect, useRef, useState } from 'react';

export function useCounter(target, suffix = '') {
  const [display, setDisplay] = useState('0' + suffix);
  const elementRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || animated.current) return;

    if (!('IntersectionObserver' in window)) {
      setDisplay(target.toLocaleString() + suffix);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;

          const update = () => {
            current = Math.min(current + step, target);
            setDisplay(Math.floor(current).toLocaleString() + suffix);
            if (current < target) requestAnimationFrame(update);
          };

          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix]);

  return [display, elementRef];
}
