import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ImageUpload from '../common/ImageUpload';
import { FIELDS } from '../uni/Filters';

const EMPTY = {
  name: '', nameIt: '', slug: '', city: '', region: '', type: 'state', founded: 2000, students: 10000, intlStudents: 1000,
  qsRank: '', tuitionMin: 0, tuitionMax: 3000, price: 40000, livingCost: 750, rating: 5, stock: 20,
  fields: [], languages: ['EN', 'IT'], image: '', highlights: [], description: '', programs: [],
  deadline: 'Март — Май (non-EU квота)', intake: 'Сентябрь',
  requirements: ['Аттестат же диплом (котормосу менен)', 'IELTS 6.0+ же TOEFL 80+', 'Мотивациялык кат', 'Паспорт'],
};

/** Админ: университет кошуу / өзгөртүү формасы (толук CRUD) */
export default function UniForm({ initial, onSubmit, onCancel, busy }) {
  const { t } = useTranslation();
  const [f, setF] = useState({ ...EMPTY, ...initial, highlightsText: (initial?.highlights || []).join('\n') });
  const [errors, setErrors] = useState({});
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (f.name.trim().length < 3) err.name = 'Аталышы кеминде 3 белги';
    if (!f.city.trim()) err.city = 'Шаарды жазыңыз';
    if (!f.fields.length) err.fields = 'Кеминде бир багыт тандаңыз';
    if (Number(f.price) < 0) err.price = 'Баа терс боло албайт';
    setErrors(err);
    if (Object.keys(err).length) return;
    const { highlightsText, ...rest } = f;
    onSubmit({
      ...rest,
      slug: f.slug || f.name.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36),
      founded: Number(f.founded), students: Number(f.students), intlStudents: Number(f.intlStudents),
      qsRank: f.qsRank ? Number(f.qsRank) : null, tuitionMin: Number(f.tuitionMin), tuitionMax: Number(f.tuitionMax),
      price: Number(f.price), livingCost: Number(f.livingCost), rating: Number(f.rating), stock: Number(f.stock),
      highlights: highlightsText.split('\n').map((s) => s.trim()).filter(Boolean),
      typeKg: f.type === 'state' ? 'Мамлекеттик' : 'Жеке',
    });
  };

  const input = (k, label, type = 'text', extra = {}) => (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={f[k] ?? ''} onChange={(e) => set(k, e.target.value)} {...extra} />
      {errors[k] && <em className="err">{errors[k]}</em>}
    </label>
  );

  return (
    <form className="uni-form" onSubmit={submit}>
      <ImageUpload value={f.image} onChange={(url) => set('image', url)} />
      <div className="grid-2">
        {input('name', 'Аталышы (кыргызча) *')}
        {input('nameIt', 'Аталышы (италиянча)')}
        {input('city', 'Шаар *')}
        {input('region', 'Регион')}
        <label className="field">
          <span>Түрү</span>
          <select value={f.type} onChange={(e) => set('type', e.target.value)}>
            <option value="state">Мамлекеттик</option>
            <option value="private">Жеке</option>
          </select>
        </label>
        {input('founded', 'Негизделген жылы', 'number')}
        {input('students', 'Студенттер саны', 'number')}
        {input('qsRank', 'QS рейтинги', 'number')}
        {input('tuitionMin', 'Окуу акысы мин (€)', 'number')}
        {input('tuitionMax', 'Окуу акысы макс (€)', 'number')}
        {input('price', 'Кызмат баасы (сом) *', 'number')}
        {input('stock', 'Бош орун', 'number')}
        {input('livingCost', 'Жашоо чыгымы (€/ай)', 'number')}
        {input('rating', 'Рейтинг (1–5)', 'number', { min: 1, max: 5, step: 0.1 })}
      </div>
      <div className="field">
        <span>Багыттар *</span>
        <div className="chips chips--select">
          {FIELDS.map((x) => (
            <button type="button" key={x} className={f.fields.includes(x) ? 'active' : ''} onClick={() => set('fields', f.fields.includes(x) ? f.fields.filter((y) => y !== x) : [...f.fields, x])}>
              {t(`fields.${x}`)}
            </button>
          ))}
        </div>
        {errors.fields && <em className="err">{errors.fields}</em>}
      </div>
      <label className="field"><span>Сүрөттөмө</span>
        <textarea rows="5" value={f.description} onChange={(e) => set('description', e.target.value)} />
      </label>
      <label className="field"><span>Артыкчылыктар (ар бири жаңы саптан)</span>
        <textarea rows="3" value={f.highlightsText} onChange={(e) => set('highlightsText', e.target.value)} />
      </label>
      <div className="row-gap row-end">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>{t('common.cancel')}</button>
        <button className="btn" disabled={busy}>{busy ? '…' : t('common.save')}</button>
      </div>
    </form>
  );
}
