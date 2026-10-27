import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingsApi } from '../api';
import { sendTelegram } from '../api/integrations';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTitle } from '../hooks';
import { Breadcrumbs } from '../components/ui/Misc';

const TIMES = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
const TYPES = [
  { id: 'office', label: '🏢 Офисте (Бишкек)' },
  { id: 'zoom', label: '💻 Zoom онлайн' },
  { id: 'whatsapp', label: '💬 WhatsApp чалуу' },
];

function nextDays(n = 14) {
  const out = [];
  const d = new Date();
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) out.push(new Date(d));
  }
  return out;
}

/** Консультацияга брондоо */
export default function Booking() {
  useTitle('Консультация');
  const { user, isAuth } = useAuth();
  const toast = useToast();
  const days = nextDays();
  const [date, setDate] = useState(days[0].toISOString().slice(0, 10));
  const [time, setTime] = useState('');
  const [type, setType] = useState('zoom');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState([]);
  const [done, setDone] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    bookingsApi.busySlots(date).then(setBusy);
    setTime('');
  }, [date]);

  const submit = async (e) => {
    e.preventDefault();
    if (!time) return toast('Убакыт тандаңыз', 'error');
    if (!/^\+?\d[\d\s-]{8,}$/.test(phone)) return toast('Телефон номерин туура жазыңыз', 'error');
    setLoading(true);
    try {
      const b = await bookingsApi.create({ date, time, type, phone, note });
      await sendTelegram(`📅 <b>Жаңы консультация</b>\n👤 ${user.name}\n📞 ${phone}\n🗓 ${date} ${time}\n📍 ${type}\n📝 ${note || '—'}`);
      setDone(b);
      toast('Консультация брондолду!');
    } catch (err) {
      toast(err.message, 'error');
      bookingsApi.busySlots(date).then(setBusy);
    } finally {
      setLoading(false);
    }
  };

  if (done)
    return (
      <div className="container page">
        <div className="success card">
          <div className="success__icon">✅</div>
          <h2>Консультация брондолду!</h2>
          <p>{done.date}, саат {done.time} · {TYPES.find((x) => x.id === done.type)?.label}</p>
          <p className="muted">Консультант сизге 1 сааттын ичинде {done.phone} номерине чалат.</p>
          <div className="row-gap"><Link to="/profile" className="btn">Менин брондоолорум</Link><button className="btn btn--ghost" onClick={() => setDone(null)}>Дагы брондоо</button></div>
        </div>
      </div>
    );

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Башкы бет', to: '/' }, { label: 'Консультация' }]} />
      <div className="page-head"><div><h1>📅 Акысыз консультацияга жазылуу</h1><p className="muted">30 мүнөт · Италиядагы окуу боюнча бардык суроолоруңузга жооп</p></div></div>
      {!isAuth ? (
        <div className="card"><p>🔒 Брондоо үчүн <Link to="/login" state={{ from: '/booking' }}>кириңиз</Link> же <Link to="/register">катталыңыз</Link>.</p></div>
      ) : (
        <form className="booking" onSubmit={submit}>
          <div className="card">
            <h3>1. Күндү тандаңыз</h3>
            <div className="days">
              {days.map((d) => {
                const iso = d.toISOString().slice(0, 10);
                return (
                  <button type="button" key={iso} className={`day ${date === iso ? 'active' : ''}`} onClick={() => setDate(iso)}>
                    <small>{d.toLocaleDateString('ru-RU', { weekday: 'short' })}</small>
                    <b>{d.getDate()}</b>
                    <small>{d.toLocaleDateString('ru-RU', { month: 'short' })}</small>
                  </button>
                );
              })}
            </div>
            <h3>2. Убакытты тандаңыз</h3>
            <div className="times">
              {TIMES.map((t) => (
                <button type="button" key={t} disabled={busy.includes(t)} className={`time ${time === t ? 'active' : ''}`} onClick={() => setTime(t)}>
                  {t}{busy.includes(t) && <small>бош эмес</small>}
                </button>
              ))}
            </div>
          </div>
          <div className="card">
            <h3>3. Маалымат</h3>
            <div className="pay-methods">
              {TYPES.map((x) => (
                <label key={x.id} className={`pay-method ${type === x.id ? 'active' : ''}`}>
                  <input type="radio" checked={type === x.id} onChange={() => setType(x.id)} /> {x.label}
                </label>
              ))}
            </div>
            <label className="field"><span>Аты-жөнү</span><input value={user.name} disabled /></label>
            <label className="field"><span>Телефон *</span><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+996 700 123 456" /></label>
            <label className="field"><span>Суроолоруңуз</span><textarea rows="3" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Мисалы: медицинага тапшыргым келет, IELTS 6.5" /></label>
            <div className="booking__summary">
              <span>🗓 {date} {time && `· ${time}`}</span>
              <button className="btn" disabled={loading}>{loading ? 'Жөнөтүлүүдө…' : 'Брондоо'}</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
