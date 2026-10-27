import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { universitiesApi } from '../../api';
import { useDebounce } from '../../hooks';

/** Аты боюнча издөө + ылдам сунуштар */
export default function SearchBox({ big, onDone }) {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(q, 250);
  const box = useRef(null);

  useEffect(() => {
    if (debounced.trim().length < 2) return setList([]);
    universitiesApi.list({ search: debounced, limit: 5 }).then((r) => setList(r.items));
  }, [debounced]);

  useEffect(() => {
    const close = (e) => !box.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    nav(`/catalog?search=${encodeURIComponent(q)}`);
    setOpen(false);
    onDone?.();
  };

  return (
    <form className={`searchbox ${big ? 'searchbox--big' : ''}`} onSubmit={submit} ref={box} role="search">
      <span className="searchbox__icon">🔎</span>
      <input value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder={t('hero.search')} aria-label={t('common.search')} />
      {big && <button className="btn">{t('common.search')}</button>}
      {open && list.length > 0 && (
        <ul className="searchbox__list">
          {list.map((u) => (
            <li key={u.id}>
              <button type="button" onClick={() => { nav(`/university/${u.slug}`); setOpen(false); setQ(''); onDone?.(); }}>
                <b>{u.name}</b>
                <small>📍 {u.city} · ★ {u.rating}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
