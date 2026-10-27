import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ProgramTable({ programs }) {
  const { t } = useTranslation();
  const [lang, setLang] = useState('');
  const list = programs.filter((p) => !lang || p.lang === lang);
  return (
    <div>
      <div className="segmented" style={{ marginBottom: 16 }}>
        {[['', t('common.all')], ['EN', '🇬🇧 English'], ['IT', '🇮🇹 Italiano']].map(([v, l]) => (
          <button key={v} className={lang === v ? 'active' : ''} onClick={() => setLang(v)}>{l}</button>
        ))}
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Программа</th><th>Деңгээл</th><th>Тил</th><th>Мөөнөтү</th><th>Багыт</th></tr>
          </thead>
          <tbody>
            {list.map((p, i) => (
              <tr key={i}>
                <td><b>{p.title}</b></td>
                <td>{p.level}</td>
                <td><span className="chip">{p.lang}</span></td>
                <td>{p.years} жыл</td>
                <td>{t(`fields.${p.field}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
