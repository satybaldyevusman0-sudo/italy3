import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export default function UserMenu() {
  const { user, isAdmin, logout } = useAuth();
  const { t } = useTranslation();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!user) return <Link to="/login" className="btn btn--sm">{t('nav.login')}</Link>;

  return (
    <div className="user-menu" ref={ref}>
      <button className="avatar" onClick={() => setOpen(!open)} aria-label="Профиль">
        {user.avatar ? <img src={user.avatar} alt="" /> : user.name[0]}
      </button>
      {open && (
        <div className="dropdown" onClick={() => setOpen(false)}>
          <div className="dropdown__head">
            <b>{user.name}</b>
            <small>{user.email}</small>
            <span className={`role role--${user.role}`}>{user.role}</span>
          </div>
          <Link to="/profile">👤 {t('nav.profile')}</Link>
          <Link to="/favorites">❤️ {t('nav.favorites')}</Link>
          {isAdmin && <Link to="/admin">⚙️ {t('nav.admin')}</Link>}
          <button onClick={() => { logout(); nav('/'); }}>🚪 {t('nav.logout')}</button>
        </div>
      )}
    </div>
  );
}
