import { Link, useLocation, useParams } from 'react-router-dom';
import { useTitle } from '../hooks';
import { money } from '../components/ui/Misc';

export default function OrderSuccess() {
  const { number } = useParams();
  const { state } = useLocation();
  const order = state?.order;
  useTitle('Заказ кабыл алынды');

  return (
    <div className="container page">
      <div className="success card">
        <div className="success__icon">🎉</div>
        <h2>Рахмат! Заказ кабыл алынды</h2>
        <p>Заказ номери: <b>{number}</b></p>
        {order && (
          <div className="receipt">
            {order.items.map((i) => (
              <div key={`${i.kind}-${i.id}`} className="summary__row"><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></div>
            ))}
            <div className="summary__row summary__total"><span>Жалпы</span><b>{money(order.total)}</b></div>
            <p className="muted small">💳 {order.paymentMethod}{order.cardLast4 ? ` •••• ${order.cardLast4}` : ''} · {order.status === 'paid' ? '✅ Төлөндү' : '⏳ Төлөм күтүлүүдө'}</p>
          </div>
        )}
        <p className="muted">📧 Ырастоо кат {order?.customer?.email || 'почтаңызга'} жөнөтүлдү. Менеджер 24 сааттын ичинде байланышат.</p>
        <div className="row-gap">
          <Link to="/profile" className="btn">Менин заказдарым</Link>
          <Link to="/catalog" className="btn btn--ghost">Каталогго кайтуу</Link>
        </div>
      </div>
    </div>
  );
}
