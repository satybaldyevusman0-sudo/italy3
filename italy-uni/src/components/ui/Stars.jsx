import { useState } from 'react';

/** Рейтинг көрсөтүү же тандоо (onChange берилсе — интерактивдүү) */
export default function Stars({ value = 0, onChange, size = 18 }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <span className={`stars ${onChange ? 'stars--input' : ''}`} style={{ fontSize: size }} aria-label={`Рейтинг ${value} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          disabled={!onChange}
          className={n <= Math.round(shown) ? 'on' : ''}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange?.(n)}
          aria-label={`${n} жылдыз`}
        >
          ★
        </button>
      ))}
    </span>
  );
}
