import { useState } from 'react';
import { translateText } from '../api/integrations';
import { useTitle } from '../hooks';
import { Breadcrumbs, Spinner } from '../components/ui/Misc';

const LANGS = [
  { code: 'ky', label: '🇰🇬 Кыргызча' },
  { code: 'ru', label: '🇷🇺 Русский' },
  { code: 'en', label: '🇬🇧 English' },
  { code: 'it', label: '🇮🇹 Italiano' },
];

const PHRASES = [
  'Мен университетке тапшыргым келет',
  'Жатакана канча турат?',
  'Стипендия алууга кандай документтер керек?',
  'Окуу качан башталат?',
];

/** Котормочу kg ↔ ru ↔ en (+ италиянча) — MyMemory API аркылуу */
export default function Translator() {
  useTitle('Котормочу');
  const [from, setFrom] = useState('ky');
  const [to, setTo] = useState('en');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const run = async (value = text) => {
    if (!value.trim()) return;
    setLoading(true);
    setError('');
    try {
      const r = await translateText(value, from, to);
      setResult(r);
      setHistory((h) => [{ from, to, text: value, result: r }, ...h].slice(0, 5));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setText(result);
    setResult(text);
  };

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Башкы бет', to: '/' }, { label: 'Котормочу' }]} />
      <div className="page-head"><div><h1>🌐 Котормочу</h1><p className="muted">Кыргызча · Орусча · Англисче · Италиянча (MyMemory API)</p></div></div>
      <div className="translator">
        <div className="translator__bar">
          <select value={from} onChange={(e) => setFrom(e.target.value)}>{LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}</select>
          <button className="icon-btn" onClick={swap} aria-label="Алмаштыруу">⇄</button>
          <select value={to} onChange={(e) => setTo(e.target.value)}>{LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}</select>
        </div>
        <div className="translator__boxes">
          <div className="card">
            <textarea rows="7" value={text} onChange={(e) => setText(e.target.value)} placeholder="Текст жазыңыз…" maxLength={500} />
            <div className="row-between"><small className="muted">{text.length}/500</small><button className="btn" onClick={() => run()} disabled={loading}>Которуу</button></div>
          </div>
          <div className="card translator__out">
            {loading ? <Spinner /> : error ? <p className="err">{error}</p> : <p>{result || <span className="muted">Котормо бул жерде көрүнөт</span>}</p>}
            {result && <button className="btn btn--ghost btn--sm" onClick={() => navigator.clipboard?.writeText(result)}>📋 Көчүрүү</button>}
          </div>
        </div>
        <div className="chips">
          {PHRASES.map((p) => <button key={p} className="chip" onClick={() => { setFrom('ky'); setText(p); run(p); }}>{p}</button>)}
        </div>
        {history.length > 0 && (
          <div className="card">
            <h4>Акыркы котормолор</h4>
            {history.map((h, i) => (
              <div key={i} className="history-row"><small>{h.from} → {h.to}</small><span>{h.text}</span><b>{h.result}</b></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
