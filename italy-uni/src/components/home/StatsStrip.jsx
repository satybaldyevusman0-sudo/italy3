import { useEffect, useRef, useState } from 'react';

function Counter({ to, suffix = '' }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / 1400);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <b ref={ref}>{n.toLocaleString('ru-RU')}{suffix}</b>;
}

const STATS = [
  { to: 1200, suffix: '+', label: 'Тапшырган студент' },
  { to: 17, label: 'Өнөктөш университет' },
  { to: 98, suffix: '%', label: 'Виза алуу ийгилиги' },
  { to: 640, suffix: '+', label: 'DSU стипендия алгандар' },
];

export default function StatsStrip() {
  return (
    <section className="stats-strip">
      <div className="container stats-strip__in">
        {STATS.map((s) => (
          <div key={s.label} className="stat">
            <Counter to={s.to} suffix={s.suffix} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
