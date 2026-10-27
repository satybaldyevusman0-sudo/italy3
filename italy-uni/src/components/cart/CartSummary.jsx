import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import { money } from '../ui/Misc';

export default function CartSummary({ children, showPromo = true }) {
  const { t } = useTranslation();
  const cart = useCart();
  const toast = useToast();
  const [code, setCode] = useState('');

  return (
    <aside className="summary card">
      <h3>{t('common.total')}</h3>
      <div className="summary__row"><span>{t('cart.subtotal')} ({cart.count})</span><span>{money(cart.subtotal)}</span></div>
      {cart.discount > 0 && (
        <div className="summary__row summary__row--green"><span>{t('cart.discount')} ({cart.promo})</span><span>−{money(cart.discount)}</span></div>
      )}
      <div className="summary__row summary__total"><span>{t('common.total')}</span><b>{money(cart.total)}</b></div>
      {showPromo && !cart.promo && (
        <form className="promo" onSubmit={(e) => { e.preventDefault(); cart.applyPromo(code) ? toast('Промокод колдонулду!') : toast('Промокод туура эмес', 'error'); }}>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder={`${t('cart.promo')}: ITALIA10`} />
          <button className="btn btn--ghost btn--sm">{t('common.apply')}</button>
        </form>
      )}
      {children}
    </aside>
  );
}
