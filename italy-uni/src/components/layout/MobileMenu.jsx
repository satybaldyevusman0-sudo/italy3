import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import SearchBox from './SearchBox';
import LangSwitcher from './LangSwitcher';
import ThemeToggle from './ThemeToggle';
import { NAV_LINKS } from './navLinks';

/** Бургер меню (мобилдик) */
export default function MobileMenu({ open, onClose }) {
  const { t } = useTranslation();
  const { isAuth, isAdmin, logout } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div className={`drawer-backdrop ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="drawer__top">
          <span className="logo">Study<b>Italia</b></span>
          <button className="icon-btn" onClick={onClose} aria-label="Жабуу">✕</button>
        </div>
        <SearchBox onDone={onClose} />
        <nav className="drawer__nav">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={onClose}>
              <span>{l.icon}</span> {t(l.key)}
            </NavLink>
          ))}
          <NavLink to="/favorites" onClick={onClose}><span>❤️</span> {t('nav.favorites')}</NavLink>
          <NavLink to="/cart" onClick={onClose}><span>🛒</span> {t('nav.cart')}</NavLink>
          {isAdmin && <NavLink to="/admin" onClick={onClose}><span>⚙️</span> {t('nav.admin')}</NavLink>}
          {isAuth ? (
            <>
              <NavLink to="/profile" onClick={onClose}><span>👤</span> {t('nav.profile')}</NavLink>
              <button onClick={() => { logout(); onClose(); }}><span>🚪</span> {t('nav.logout')}</button>
            </>
          ) : (
            <NavLink to="/login" onClick={onClose}><span>🔑</span> {t('nav.login')}</NavLink>
          )}
        </nav>
        <div className="drawer__bottom">
          <LangSwitcher />
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
