import { useEffect, useRef, useState } from 'react';
import { subscribe } from '../../utils/realtime';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const TEXT = {
  order: (p) => `🛒 Жаңы заказ ${p.number} — ${p.total} сом (${p.user})`,
  booking: (p) => `📅 Консультация брондолду: ${p.date} ${p.time}`,
  review: (p) => `⭐ ${p.user} жаңы пикир калтырды`,
  user: (p) => `👤 Жаңы колдонуучу: ${p.name}`,
  catalog: (p) => `🎓 Каталог жаңырды${p.name ? ': ' + p.name : ''}`,
};

/** Realtime билдирүүлөр (башка вкладкада болгон окуялар дароо келет) */
export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const toast = useToast();
  const { isAdmin } = useAuth();
  const ref = useRef(null);

  useEffect(
    () =>
      subscribe((e, local) => {
        const fn = TEXT[e.type];
        if (!fn) return;
        const text = fn(e.payload);
        setItems((p) => [{ text, at: e.at }, ...p].slice(0, 20));
        setUnread((n) => n + 1);
        if (!local && isAdmin) toast(text, 'info');
      }),
    [toast, isAdmin]
  );

  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="bell" ref={ref}>
      <button className="icon-btn" onClick={() => { setOpen(!open); setUnread(0); }} aria-label="Билдирүүлөр">
        🔔{unread > 0 && <span className="badge">{unread}</span>}
      </button>
      {open && (
        <div className="dropdown bell__list">
          <h4>Realtime билдирүүлөр <span className="live-dot" /></h4>
          {items.length === 0 ? (
            <p className="muted">Азырынча жаңылык жок. Башка вкладкада заказ бериңиз — бул жерде дароо көрүнөт.</p>
          ) : (
            items.map((n, i) => (
              <div key={i} className="bell__item">
                <span>{n.text}</span>
                <small>{new Date(n.at).toLocaleTimeString()}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
