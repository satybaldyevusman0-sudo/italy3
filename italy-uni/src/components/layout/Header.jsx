import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart, useFavorites } from '../../context/ShopContext';
import ThemeToggle from './ThemeToggle';
import LangSwitcher from './LangSwitcher';
import SearchBox from './SearchBox';
import UserMenu from './UserMenu';
import NotificationBell from './NotificationBell';
import MobileMenu from './MobileMenu';
import { NAV_LINKS } from './navLinks';

export default function Header() {
  const { t } = useTranslation();
  const { count } = useCart();
  const favs = useFavorites();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="topbar">
        <div className="container topbar__in">
          <span>📞 +996 700 123 456 · ✉️ info@studyitalia.kg</span>
          <span className="topbar__right">
            🇮🇹 2027/28 окуу жылына кабыл алуу ачык! <Link to="/booking">Консультацияга жазылуу →</Link>
          </span>
        </div>
      </div>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="container header__in">
          <button className="burger" onClick={() => setOpen(true)} aria-label="Меню">
            <span /><span /><span />
          </button>
          <Link to="/" className="logo" aria-label="StudyItalia башкы бет">
            <span className="logo__flag"><i /><i /><i /></span>
            Study<b>Italia</b><small>.kg</small>
          </Link>
          <div className="header__search"><SearchBox /></div>
          <div className="header__actions">
            <div className="hide-sm"><LangSwitcher /></div>
            <div className="hide-sm"><ThemeToggle /></div>
            <NotificationBell />
            <Link to="/favorites" className="icon-btn" aria-label={t('nav.favorites')}>
              ❤️{favs.ids.length > 0 && <span className="badge">{favs.ids.length}</span>}
            </Link>
            <Link to="/cart" className="icon-btn" aria-label={t('nav.cart')}>
              🛒{count > 0 && <span className="badge">{count}</span>}
            </Link>
            <UserMenu />
          </div>
        </div>
        <nav className="mainnav">
          <div className="container mainnav__in">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}>{t(l.key)}</NavLink>
            ))}
          </div>
        </nav>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
