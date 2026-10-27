/**
 * Төлөм ыкмалары: Stripe (демо карта), Post.kg / Элсом / MBank (демо), накталай.
 * Stripe тест картасы: 4242 4242 4242 4242, каалаган келечек дата, каалаган CVC.
 */
export const METHODS = [
  { id: 'stripe', label: 'Банк картасы (Stripe)', icon: '💳' },
  { id: 'postkg', label: 'Post.kg / Элсом', icon: '📮' },
  { id: 'mbank', label: 'MBank QR', icon: '📱' },
  { id: 'cash', label: 'Офисте накталай', icon: '💵' },
];

const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const fmtExp = (v) => v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');

/** Luhn алгоритми — карта номерин текшерүү */
export function luhn(num) {
  const d = num.replace(/\D/g, '');
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return d.length === 16 && sum % 10 === 0;
}

export function validateCard(card) {
  const errs = {};
  if (!luhn(card.number)) errs.number = 'Карта номери туура эмес (тест: 4242 4242 4242 4242)';
  const [m, y] = card.exp.split('/').map(Number);
  const now = new Date();
  if (!m || m > 12 || !y || 2000 + y < now.getFullYear() || (2000 + y === now.getFullYear() && m < now.getMonth() + 1)) errs.exp = 'Мөөнөтү туура эмес';
  if (!/^\d{3}$/.test(card.cvc)) errs.cvc = 'CVC 3 сандан турат';
  if (card.holder.trim().length < 3) errs.holder = 'Ээсинин атын жазыңыз';
  return errs;
}

export default function PaymentForm({ method, setMethod, card, setCard, errors = {} }) {
  const set = (k, v) => setCard({ ...card, [k]: v });
  return (
    <div className="payment">
      <div className="pay-methods">
        {METHODS.map((m) => (
          <label key={m.id} className={`pay-method ${method === m.id ? 'active' : ''}`}>
            <input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} />
            <span>{m.icon}</span> {m.label}
          </label>
        ))}
      </div>

      {method === 'stripe' && (
        <div className="card-form">
          <div className="credit-card">
            <div className="credit-card__chip" />
            <div className="credit-card__num">{card.number || '•••• •••• •••• ••••'}</div>
            <div className="credit-card__row"><span>{card.holder || 'CARD HOLDER'}</span><span>{card.exp || 'MM/YY'}</span></div>
            <span className="credit-card__brand">stripe <small>test</small></span>
          </div>
          <label className="field"><span>Карта номери</span>
            <input inputMode="numeric" value={card.number} onChange={(e) => set('number', fmtCard(e.target.value))} placeholder="4242 4242 4242 4242" />
            {errors.number && <em className="err">{errors.number}</em>}
          </label>
          <div className="grid-2">
            <label className="field"><span>Мөөнөтү</span>
              <input value={card.exp} onChange={(e) => set('exp', fmtExp(e.target.value))} placeholder="12/28" />
              {errors.exp && <em className="err">{errors.exp}</em>}
            </label>
            <label className="field"><span>CVC</span>
              <input value={card.cvc} onChange={(e) => set('cvc', e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="123" />
              {errors.cvc && <em className="err">{errors.cvc}</em>}
            </label>
          </div>
          <label className="field"><span>Карта ээси</span>
            <input value={card.holder} onChange={(e) => set('holder', e.target.value.toUpperCase())} placeholder="USMAN SATYBALDYEV" />
            {errors.holder && <em className="err">{errors.holder}</em>}
          </label>
          <p className="muted small">🔒 Демо режим: акча чыныгы эмес чечилбейт. Stripe тест картасы: 4242 4242 4242 4242</p>
        </div>
      )}

      {method === 'postkg' && (
        <div className="pay-info">
          <p>📮 Post.kg / Элсом аркылуу төлөө (демо): заказ ырасталгандан кийин төлөм коду SMS аркылуу келет. Аны каалаган Post.kg бөлүмүндө же Элсом тиркемесинде төлөйсүз.</p>
        </div>
      )}
      {method === 'mbank' && (
        <div className="pay-info pay-info--qr">
          <div className="qr" aria-label="QR код">
            {Array.from({ length: 81 }, (_, i) => <i key={i} className={(i * 7 + (i % 5)) % 3 === 0 ? 'on' : ''} />)}
          </div>
          <p>MBank тиркемесинде QR кодду сканерлеңиз (демо).</p>
        </div>
      )}
      {method === 'cash' && (
        <div className="pay-info"><p>💵 Бишкектеги офисибизде (Чүй пр. 123) 3 жумушчу күндүн ичинде төлөй аласыз.</p></div>
      )}
    </div>
  );
}
