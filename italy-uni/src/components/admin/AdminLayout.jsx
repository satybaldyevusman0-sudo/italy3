import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LINKS = [
  { to: '/admin', label: 'Дашборд', icon: '📊', end: true },
  { to: '/admin/universities', label: 'Университеттер', icon: '🎓' },
  { to: '/admin/orders', label: 'Заказдар', icon: '🛒' },
  { to: '/admin/bookings', label: 'Брондоолор', icon: '📅' },
  { to: '/admin/users', label: 'Колдонуучулар', icon: '👥' },
  { to: '/admin/reviews', label: 'Пикирлер', icon: '⭐' },
];

export default function AdminLayout() {
  const { user } = useAuth();
  return (
    <div className="container admin">
      <aside className="admin__side">
        <div className="admin__me">
          <span className="avatar">{user?.name?.[0]}</span>
          <div><b>{user?.name}</b><small>Администратор</small></div>
        </div>
        <nav>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}><span>{l.icon}</span>{l.label}</NavLink>
          ))}
        </nav>
      </aside>
      <section className="admin__main">
        <Outlet />
      </section>
    </div>
  );
}
