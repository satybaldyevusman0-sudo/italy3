import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'kg', label: 'KG' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
];

export default function LangSwitcher() {
  const { i18n } = useTranslation();
  return (
    <div className="lang-switch" role="group" aria-label="Тил">
      {LANGS.map((l) => (
        <button key={l.code} className={i18n.language === l.code ? 'active' : ''} onClick={() => i18n.changeLanguage(l.code)}>
          {l.label}
        </button>
      ))}
    </div>
  );
}
