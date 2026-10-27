import { Link } from 'react-router-dom';
import { useCart } from '../../context/ShopContext';
import { ImageWithFallback, money } from '../ui/Misc';

export default function CartItem({ item }) {
  const cart = useCart();
  return (
    <div className="cart-item">
      <div className="cart-item__img">
        {item.kind === 'service' ? <span className="cart-item__icon">{item.icon}</span> : <ImageWithFallback src={item.image} alt={item.name} label={item.city} />}
      </div>
      <div className="cart-item__info">
        <small>{item.kind === 'service' ? 'Кызмат' : `Тапшыруу пакети · ${item.city}`}</small>
        {item.kind === 'uni' ? <Link to={`/university/${item.id}`}><b>{item.name}</b></Link> : <b>{item.name}</b>}
        <span className="muted">{money(item.price)} / даана</span>
      </div>
      <div className="qty">
        <button onClick={() => cart.setQty(item.id, item.kind, item.qty - 1)} aria-label="Азайтуу">−</button>
        <span>{item.qty}</span>
        <button onClick={() => cart.setQty(item.id, item.kind, item.qty + 1)} aria-label="Көбөйтүү">+</button>
      </div>
      <b className="cart-item__sum">{money(item.price * item.qty)}</b>
      <button className="icon-btn" onClick={() => cart.remove(item.id, item.kind)} aria-label="Өчүрүү">🗑</button>
    </div>
  );
}
