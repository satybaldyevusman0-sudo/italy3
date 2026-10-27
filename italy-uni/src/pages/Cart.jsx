import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/ShopContext';
import { useTitle } from '../hooks';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { Breadcrumbs, EmptyState } from '../components/ui/Misc';

export default function Cart() {
  const { t } = useTranslation();
  useTitle(t('cart.title'));
  const cart = useCart();
  const nav = useNavigate();

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('cart.title') }]} />
      <div className="page-head">
        <div><h1>🛒 {t('cart.title')}</h1><p className="muted">{cart.count} позиция</p></div>
        {cart.items.length > 0 && <button className="btn btn--ghost btn--sm" onClick={cart.clear}>🗑 {t('cart.clear')}</button>}
      </div>
      {cart.items.length === 0 ? (
        <EmptyState icon="🛒" title={t('cart.empty')} text="Университет же кызмат тандап, себетке кошуңуз." action={<Link to="/catalog" className="btn">{t('nav.catalog')}</Link>} />
      ) : (
        <div className="cart">
          <div className="cart__list">
            {cart.items.map((i) => <CartItem key={`${i.kind}-${i.id}`} item={i} />)}
            <Link to="/services" className="cart__more">+ Кошумча кызмат кошуу (котормо, виза, IELTS)</Link>
          </div>
          <CartSummary>
            <button className="btn btn--block btn--lg" onClick={() => nav('/checkout')}>{t('cart.checkout')} →</button>
            <p className="muted small">🔒 Коопсуз төлөм · Stripe / Post.kg / MBank</p>
          </CartSummary>
        </div>
      )}
    </div>
  );
}
