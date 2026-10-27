import { useEffect, useState } from 'react';
import { ordersApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useFetch, useTitle } from '../../hooks';
import { subscribe } from '../../utils/realtime';
import { SkeletonRows } from '../../components/ui/Skeleton';
import { EmptyState, money } from '../../components/ui/Misc';
import Modal from '../../components/ui/Modal';
import { STATUS, StatusBadge } from '../Profile';

export default function AdminOrders() {
  useTitle('Админ — Заказдар');
  const toast = useToast();
  const { data, loading, reload } = useFetch(() => ordersApi.all(), []);
  const [filter, setFilter] = useState('');
  const [view, setView] = useState(null);

  useEffect(() => subscribe((e) => e.type === 'order' && reload()), [reload]);

  const setStatus = async (id, s) => {
    await ordersApi.setStatus(id, s);
    toast('Статус жаңырды');
    reload();
  };

  if (loading && !data) return <SkeletonRows rows={6} />;
  const list = data.filter((o) => !filter || o.status === filter);

  const exportCsv = () => {
    const rows = [['Номер', 'Кардар', 'Телефон', 'Сумма', 'Статус', 'Дата'], ...data.map((o) => [o.number, o.customer.name, o.customer.phone, o.total, o.status, o.createdAt])];
    const blob = new Blob(['﻿' + rows.map((r) => r.join(';')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'orders.csv';
    a.click();
  };

  return (
    <div>
      <div className="row-between">
        <h1>🛒 Заказдар <span className="live-dot" /></h1>
        <div className="row-gap">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Бардык статустар</option>
            {['new', 'paid', 'processing', 'done', 'cancelled'].map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
          </select>
          <button className="btn btn--ghost btn--sm" onClick={exportCsv}>⬇ CSV</button>
        </div>
      </div>
      {list.length === 0 ? (
        <EmptyState icon="📦" title="Заказ жок" text="Башка вкладкадан заказ бериңиз — бул жерде realtime көрүнөт." />
      ) : (
        <div className="table-wrap">
          <table className="table table--admin">
            <thead><tr><th>№</th><th>Кардар</th><th>Сумма</th><th>Төлөм</th><th>Статус</th><th>Дата</th><th></th></tr></thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id}>
                  <td><b>{o.number}</b></td>
                  <td>{o.customer.name}<br /><small className="muted">{o.customer.phone}</small></td>
                  <td>{money(o.total)}</td>
                  <td><small>{o.paymentMethod}</small></td>
                  <td>
                    <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className="status-select">
                      {['new', 'paid', 'processing', 'done', 'cancelled'].map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
                    </select>
                  </td>
                  <td><small>{new Date(o.createdAt).toLocaleString('ru-RU')}</small></td>
                  <td className="actions">
                    <button className="icon-btn" onClick={() => setView(o)} aria-label="Көрүү">👁</button>
                    <button className="icon-btn" onClick={async () => { await ordersApi.remove(o.id); reload(); }} aria-label="Өчүрүү">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={Boolean(view)} onClose={() => setView(null)} title={`Заказ ${view?.number}`}>
        {view && (
          <div>
            <p><b>{view.customer.name}</b> · {view.customer.email} · {view.customer.phone} · {view.customer.city}</p>
            {view.customer.comment && <p className="muted">💬 {view.customer.comment}</p>}
            {view.items.map((i) => <div key={`${i.kind}-${i.id}`} className="summary__row"><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></div>)}
            {view.discount > 0 && <div className="summary__row summary__row--green"><span>Арзандатуу</span><span>−{money(view.discount)}</span></div>}
            <div className="summary__row summary__total"><span>Жалпы</span><b>{money(view.total)}</b></div>
            <StatusBadge s={view.status} />
          </div>
        )}
      </Modal>
    </div>
  );
}
