import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();
  const dark = theme === 'dark';
  return (
    <button className="theme-toggle" onClick={toggle} title={dark ? t('theme.light') : t('theme.dark')} aria-label="Тема">
      <span className={`theme-toggle__knob ${dark ? 'is-dark' : ''}`}>{dark ? '🌙' : '☀️'}</span>
    </button>
  );
}
