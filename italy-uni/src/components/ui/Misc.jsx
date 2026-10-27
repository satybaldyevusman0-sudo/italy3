import { useState } from 'react';
import { Link } from 'react-router-dom';

/** Бош абал */
export function EmptyState({ icon = '🔍', title, text, action }) {
  return (
    <div className="empty">
      <div className="empty__icon">{icon}</div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

/** Айлануучу индикатор */
export function Spinner({ small }) {
  return <span className={`spinner ${small ? 'spinner--sm' : ''}`} aria-label="Жүктөлүүдө" />;
}

/** Сүрөт жүктөлбөсө — кооз градиент + аталыш */
export function ImageWithFallback({ src, alt, className, label }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    const hue = [...(label || alt || 'x')].reduce((s, c) => s + c.charCodeAt(0), 0) % 360;
    return (
      <div className={`img-fallback ${className || ''}`} style={{ '--h': hue }} role="img" aria-label={alt}>
        <span>{(label || alt || '').split(' ').slice(0, 2).join(' ')}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}

/** "Нан күкүмдөрү" */
export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      {items.map((it, i) => (
        <span key={i}>
          {it.to ? <Link to={it.to}>{it.label}</Link> : <b>{it.label}</b>}
          {i < items.length - 1 && <em>/</em>}
        </span>
      ))}
    </nav>
  );
}

/** Өтмөктөр */
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={active === t.id} className={active === t.id ? 'active' : ''} onClick={() => onChange(t.id)}>
          {t.label}
          {t.count !== undefined && <small>{t.count}</small>}
        </button>
      ))}
    </div>
  );
}

/** Бөлүмдүн башы */
export function SectionHead({ kicker, title, text, action }) {
  return (
    <div className="section-head">
      <div>
        {kicker && <span className="kicker">{kicker}</span>}
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {action}
    </div>
  );
}

/** Баа форматы */
export const money = (n) => `${Number(n).toLocaleString('ru-RU')} сом`;
