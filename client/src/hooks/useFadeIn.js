import { useEffect, useRef } from 'react';

export function useFadeIn() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      el.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export function useFadeInList(count) {
  const refs = useRef([]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      refs.current.forEach(el => el && el.classList.add('visible'));
      return;
    }

    const observers = refs.current.map((el, index) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add('visible'), index * 80);
            obs.unobserve(el);
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach(obs => obs && obs.disconnect());
  }, [count]);

  return refs;
}
