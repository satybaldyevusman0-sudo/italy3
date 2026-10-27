import { useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingsApi, ordersApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { useFetch, useTitle } from '../hooks';
import { EmptyState, Tabs, money } from '../components/ui/Misc';
import { SkeletonRows } from '../components/ui/Skeleton';

export const STATUS = {
  new: { label: 'Жаңы', c: 'blue' },
  paid: { label: 'Төлөндү', c: 'green' },
  processing: { label: 'Иштетилүүдө', c: 'amber' },
  done: { label: 'Аткарылды', c: 'green' },
  cancelled: { label: 'Жокко чыгарылды', c: 'red' },
  confirmed: { label: 'Ырасталды', c: 'green' },
};

export const StatusBadge = ({ s }) => <span className={`status status--${STATUS[s]?.c || 'blue'}`}>{STATUS[s]?.label || s}</span>;

export default function Profile() {
  useTitle('Кабинет');
  const { user, logout } = useAuth();
  const favs = useFavorites();
  const toast = useToast();
  const [tab, setTab] = useState('orders');
  const orders = useFetch(() => ordersApi.mine(), []);
  const bookings = useFetch(() => bookingsApi.mine(), []);

  const cancel = async (id) => {
    await bookingsApi.cancel(id);
    toast('Брондоо жокко чыгарылды', 'info');
    bookings.reload();
  };

  return (
    <div className="container page">
      <div className="profile-head card">
        <span className="avatar avatar--xl">{user.avatar ? <img src={user.avatar} alt="" /> : user.name[0]}</span>
        <div>
          <h1>{user.name}</h1>
          <p className="muted">{user.email} · {user.provider === 'email' ? 'Email' : user.provider} аркылуу · <span className={`role role--${user.role}`}>{user.role}</span></p>
        </div>
        <div className="profile-head__stats">
          <div><b>{orders.data?.length ?? '…'}</b><small>заказ</small></div>
          <div><b>{bookings.data?.length ?? '…'}</b><small>брондоо</small></div>
          <div><b>{favs.ids.length}</b><small>тандалган</small></div>
        </div>
        <button className="btn btn--ghost btn--sm" onClick={logout}>🚪 Чыгуу</button>
      </div>

      <Tabs active={tab} onChange={setTab} tabs={[{ id: 'orders', label: '🛒 Заказдар' }, { id: 'bookings', label: '📅 Брондоолор' }]} />

      <div className="tab-panel">
        {tab === 'orders' &&
          (orders.loading ? <SkeletonRows /> : orders.data.length === 0 ? (
            <EmptyState icon="📦" title="Заказ жок" action={<Link to="/catalog" className="btn">Университет тандоо</Link>} />
          ) : (
            <div className="orders">
              {orders.data.map((o) => (
                <div key={o.id} className="order card">
                  <div className="order__head">
                    <b>{o.number}</b>
                    <small>{new Date(o.createdAt).toLocaleString('ru-RU')}</small>
                    <StatusBadge s={o.status} />
                  </div>
                  {o.items.map((i) => <div key={`${i.kind}-${i.id}`} className="summary__row"><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></div>)}
                  <div className="summary__row summary__total"><span>{o.paymentMethod}</span><b>{money(o.total)}</b></div>
                </div>
              ))}
            </div>
          ))}
        {tab === 'bookings' &&
          (bookings.loading ? <SkeletonRows /> : bookings.data.length === 0 ? (
            <EmptyState icon="📅" title="Брондоо жок" action={<Link to="/booking" className="btn">Консультацияга жазылуу</Link>} />
          ) : (
            <div className="orders">
              {bookings.data.map((b) => (
                <div key={b.id} className="order card order--row">
                  <span>🗓 <b>{b.date}</b> · {b.time}</span>
                  <span>{b.type}</span>
                  <StatusBadge s={b.status} />
                  {b.status !== 'cancelled' && <button className="btn btn--ghost btn--sm" onClick={() => cancel(b.id)}>Жокко чыгаруу</button>}
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
