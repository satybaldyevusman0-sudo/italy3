import { useEffect } from 'react';
import { bookingsApi, reviewsApi, universitiesApi, usersApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useFetch, useTitle } from '../../hooks';
import { subscribe } from '../../utils/realtime';
import { SkeletonRows } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/Misc';
import Stars from '../../components/ui/Stars';
import { StatusBadge } from '../Profile';

/** Колдонуучулар: ролду өзгөртүү (admin/user), бөгөттөө */
export function AdminUsers() {
  useTitle('Админ — Колдонуучулар');
  const { user: me } = useAuth();
  const toast = useToast();
  const { data, loading, reload } = useFetch(() => usersApi.list(), []);
  if (loading && !data) return <SkeletonRows />;

  return (
    <div>
      <h1>👥 Колдонуучулар</h1>
      <div className="table-wrap">
        <table className="table table--admin">
          <thead><tr><th>Аты</th><th>Email</th><th>Кирүү</th><th>Роль</th><th>Катталган</th><th></th></tr></thead>
          <tbody>
            {data.map((u) => (
              <tr key={u.id} className={u.blocked ? 'row--blocked' : ''}>
                <td><b>{u.name}</b></td>
                <td>{u.email}</td>
                <td>{u.provider}</td>
                <td>
                  <select value={u.role} disabled={u.id === me.id} onChange={async (e) => { await usersApi.setRole(u.id, e.target.value); toast('Роль өзгөрдү'); reload(); }}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td><small>{u.createdAt}</small></td>
                <td>
                  {u.id !== me.id && (
                    <button className={`btn btn--sm ${u.blocked ? '' : 'btn--ghost'}`} onClick={async () => { await usersApi.toggleBlock(u.id); reload(); }}>
                      {u.blocked ? 'Бөгөттөн чыгаруу' : 'Бөгөттөө'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Пикирлерди модерациялоо */
export function AdminReviews() {
  useTitle('Админ — Пикирлер');
  const toast = useToast();
  const { data, loading, reload } = useFetch(async () => {
    const [reviews, unis] = await Promise.all([reviewsApi.list(), universitiesApi.all()]);
    return reviews.map((r) => ({ ...r, uni: unis.find((u) => u.id === r.uniId)?.name || '—' }));
  }, []);
  useEffect(() => subscribe((e) => e.type === 'review' && reload()), [reload]);
  if (loading && !data) return <SkeletonRows />;

  return (
    <div>
      <h1>⭐ Пикирлер ({data.length})</h1>
      <div className="orders">
        {data.map((r) => (
          <div key={r.id} className="review card">
            <span className="avatar">{r.user[0]}</span>
            <div style={{ flex: 1 }}>
              <div className="review__top"><b>{r.user}</b><Stars value={r.rating} size={13} /><small>{r.date}</small><small className="chip">{r.uni}</small></div>
              <p>{r.text}</p>
            </div>
            <button className="icon-btn" onClick={async () => { await reviewsApi.remove(r.id); toast('Пикир өчүрүлдү', 'info'); reload(); }} aria-label="Өчүрүү">🗑</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Консультацияга брондоолор */
export function AdminBookings() {
  useTitle('Админ — Брондоолор');
  const { data, loading, reload } = useFetch(() => bookingsApi.all(), []);
  useEffect(() => subscribe((e) => e.type === 'booking' && reload()), [reload]);
  if (loading && !data) return <SkeletonRows />;
  if (!data.length) return (<div><h1>📅 Брондоолор</h1><EmptyState icon="📅" title="Брондоо жок" /></div>);

  return (
    <div>
      <h1>📅 Брондоолор <span className="live-dot" /></h1>
      <div className="table-wrap">
        <table className="table table--admin">
          <thead><tr><th>Күн</th><th>Убакыт</th><th>Кардар</th><th>Телефон</th><th>Түрү</th><th>Эскертүү</th><th>Статус</th><th></th></tr></thead>
          <tbody>
            {data.map((b) => (
              <tr key={b.id}>
                <td><b>{b.date}</b></td>
                <td>{b.time}</td>
                <td>{b.userName}</td>
                <td>{b.phone}</td>
                <td>{b.type}</td>
                <td><small>{b.note || '—'}</small></td>
                <td><StatusBadge s={b.status} /></td>
                <td>{b.status !== 'cancelled' && <button className="btn btn--ghost btn--sm" onClick={async () => { await bookingsApi.cancel(b.id); reload(); }}>Жокко чыгаруу</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
