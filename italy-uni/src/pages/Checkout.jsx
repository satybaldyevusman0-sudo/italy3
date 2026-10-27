import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ordersApi } from '../api';
import { notifyOrder } from '../api/integrations';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { useTitle } from '../hooks';
import CartSummary from '../components/cart/CartSummary';
import PaymentForm, { METHODS, validateCard } from '../components/cart/PaymentForm';
import { Breadcrumbs, money } from '../components/ui/Misc';

/** Заказды тариздөө (кирген колдонуучулар гана — PrivateRoute) */
export default function Checkout() {
  const { t } = useTranslation();
  useTitle(t('checkout.title'));
  const { user } = useAuth();
  const cart = useCart();
  const toast = useToast();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', city: 'Бишкек', comment: '' });
  const [method, setMethod] = useState('stripe');
  const [card, setCard] = useState({ number: '', exp: '', cvc: '', holder: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  if (cart.items.length === 0) return <Navigate to="/cart" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const nextStep = (e) => {
    e.preventDefault();
    const err = {};
    if (form.name.trim().length < 2) err.name = 'Атыңызды жазыңыз';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Email туура эмес';
    if (!/^\+?\d[\d\s-]{8,}$/.test(form.phone)) err.phone = 'Телефон туура эмес';
    setErrors(err);
    if (!Object.keys(err).length) setStep(2);
  };

  const pay = async () => {
    if (method === 'stripe') {
      const err = validateCard(card);
      setErrors(err);
      if (Object.keys(err).length) return;
    }
    setBusy(true);
    try {
      // Төлөм процессин имитациялоо (Stripe test mode)
      await new Promise((r) => setTimeout(r, 1200));
      const order = await ordersApi.create({
        items: cart.items,
        subtotal: cart.subtotal,
        discount: cart.discount,
        total: cart.total,
        customer: form,
        paymentMethod: METHODS.find((m) => m.id === method).label,
        paid: method === 'stripe',
        cardLast4: method === 'stripe' ? card.number.slice(-4) : null,
      });
      await notifyOrder(order); // Telegram бот + Email
      nav(`/order/${order.number}`, { state: { order } });
      cart.clear();
      toast(t('checkout.success'));
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('cart.title'), to: '/cart' }, { label: t('checkout.title') }]} />
      <h1>{t('checkout.title')}</h1>
      <div className="stepper">
        <span className={step >= 1 ? 'active' : ''}>1. {t('checkout.contact')}</span>
        <i />
        <span className={step >= 2 ? 'active' : ''}>2. {t('checkout.payment')}</span>
        <i />
        <span>3. ✓</span>
      </div>
      <div className="cart">
        <div className="card">
          {step === 1 ? (
            <form onSubmit={nextStep}>
              <h3>{t('checkout.contact')}</h3>
              <div className="grid-2">
                <label className="field"><span>Аты-жөнү *</span><input value={form.name} onChange={set('name')} />{errors.name && <em className="err">{errors.name}</em>}</label>
                <label className="field"><span>Email *</span><input value={form.email} onChange={set('email')} />{errors.email && <em className="err">{errors.email}</em>}</label>
                <label className="field"><span>Телефон *</span><input value={form.phone} onChange={set('phone')} placeholder="+996 700 123 456" />{errors.phone && <em className="err">{errors.phone}</em>}</label>
                <label className="field"><span>Шаар</span>
                  <select value={form.city} onChange={set('city')}>{['Бишкек', 'Ош', 'Жалал-Абад', 'Каракол', 'Нарын', 'Талас', 'Баткен'].map((c) => <option key={c}>{c}</option>)}</select>
                </label>
              </div>
              <label className="field"><span>Комментарий</span><textarea rows="3" value={form.comment} onChange={set('comment')} placeholder="Мисалы: IELTS 6.5, 2027-жылы тапшырам" /></label>
              <button className="btn btn--lg">Улантуу →</button>
            </form>
          ) : (
            <div>
              <div className="row-between"><h3>{t('checkout.payment')}</h3><button className="link" onClick={() => setStep(1)}>← {t('common.back')}</button></div>
              <PaymentForm method={method} setMethod={setMethod} card={card} setCard={setCard} errors={errors} />
              <button className="btn btn--lg btn--block" onClick={pay} disabled={busy}>
                {busy ? '⏳ Төлөм иштетилүүдө…' : `${t('checkout.confirm')} · ${money(cart.total)}`}
              </button>
            </div>
          )}
        </div>
        <CartSummary showPromo={step === 1}>
          <div className="summary__items">
            {cart.items.map((i) => (
              <div key={`${i.kind}-${i.id}`} className="summary__row"><span>{i.name} × {i.qty}</span><span>{money(i.price * i.qty)}</span></div>
            ))}
          </div>
          <Link to="/cart" className="link">✎ Себетти өзгөртүү</Link>
        </CartSummary>
      </div>
    </div>
  );
}
