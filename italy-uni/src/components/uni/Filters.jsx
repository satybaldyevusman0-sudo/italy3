import { useTranslation } from 'react-i18next';

export const FIELDS = ['engineering', 'medicine', 'economics', 'law', 'humanities', 'science', 'architecture', 'design'];

/** Каталогдогу чыпкалар панели */
export default function Filters({ value, onChange, cities, onReset, open, onClose }) {
  const { t } = useTranslation();
  const set = (k, v) => onChange({ ...value, [k]: v, page: 1 });

  return (
    <aside className={`filters ${open ? 'open' : ''}`}>
      <div className="filters__head">
        <h3>⚙️ {t('filters.title')}</h3>
        <button className="icon-btn show-sm" onClick={onClose}>✕</button>
      </div>

      <label className="field">
        <span>{t('filters.city')}</span>
        <select value={value.city} onChange={(e) => set('city', e.target.value)}>
          <option value="">{t('common.all')}</option>
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>

      <div className="field">
        <span>{t('filters.field')}</span>
        <div className="chips chips--select">
          <button className={!value.field ? 'active' : ''} onClick={() => set('field', '')}>{t('common.all')}</button>
          {FIELDS.map((f) => (
            <button key={f} className={value.field === f ? 'active' : ''} onClick={() => set('field', f)}>{t(`fields.${f}`)}</button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>{t('filters.type')}</span>
        <div className="segmented">
          {[['', t('common.all')], ['state', t('common.state')], ['private', t('common.private')]].map(([v, l]) => (
            <button key={v} className={value.type === v ? 'active' : ''} onClick={() => set('type', v)}>{l}</button>
          ))}
        </div>
      </div>

      <label className="field">
        <span>{t('filters.tuition')}: <b>{value.maxTuition === '' ? '∞' : `€${value.maxTuition}`}</b></span>
        <input type="range" min="0" max="16000" step="500" value={value.maxTuition === '' ? 16000 : value.maxTuition} onChange={(e) => set('maxTuition', e.target.value === '16000' ? '' : e.target.value)} />
      </label>

      <button className="btn btn--ghost btn--block" onClick={onReset}>↺ {t('common.reset')}</button>
    </aside>
  );
}
