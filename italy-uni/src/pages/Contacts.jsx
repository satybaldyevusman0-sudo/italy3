import { useState } from 'react';
import { sendEmail, sendTelegram } from '../api/integrations';
import { useToast } from '../context/ToastContext';
import { useTitle } from '../hooks';
import { Breadcrumbs } from '../components/ui/Misc';

export default function Contacts() {
  useTitle('Байланыш');
  const toast = useToast();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return toast('Бардык талааларды толтуруңуз', 'error');
    setBusy(true);
    await Promise.allSettled([
      sendTelegram(`✉️ <b>Сайттан кат</b>\n👤 ${form.name}\n📞 ${form.phone}\n💬 ${form.message}`),
      sendEmail({ to_name: 'StudyItalia', from_name: form.name, message: `${form.phone}: ${form.message}` }),
    ]);
    setBusy(false);
    setForm({ name: '', phone: '', message: '' });
    toast('Билдирүү жөнөтүлдү! Жакында байланышабыз');
  };

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Башкы бет', to: '/' }, { label: 'Байланыш' }]} />
      <div className="contacts">
        <div>
          <h1>Байланыш</h1>
          <div className="contact-list">
            <a href="tel:+996700123456" className="card"><span>📞</span><div><small>Телефон</small><b>+996 700 123 456</b></div></a>
            <a href="https://wa.me/996700123456" target="_blank" rel="noreferrer" className="card"><span>💬</span><div><small>WhatsApp</small><b>+996 700 123 456</b></div></a>
            <a href="mailto:info@studyitalia.kg" className="card"><span>✉️</span><div><small>Email</small><b>info@studyitalia.kg</b></div></a>
            <div className="card"><span>📍</span><div><small>Дарек</small><b>Бишкек, Чүй пр. 123, 4-кабат</b></div></div>
            <div className="card"><span>🕘</span><div><small>Иш убактысы</small><b>Дш–Иш, 10:00–18:00</b></div></div>
          </div>
        </div>
        <form className="card" onSubmit={submit}>
          <h3>Бизге жазыңыз</h3>
          <label className="field"><span>Аты-жөнү</span><input value={form.name} onChange={set('name')} /></label>
          <label className="field"><span>Телефон</span><input value={form.phone} onChange={set('phone')} placeholder="+996" /></label>
          <label className="field"><span>Билдирүү</span><textarea rows="5" value={form.message} onChange={set('message')} /></label>
          <button className="btn btn--block" disabled={busy}>{busy ? 'Жөнөтүлүүдө…' : 'Жөнөтүү'}</button>
        </form>
      </div>
      <div className="map card">
        <iframe title="Карта" src="https://www.openstreetmap.org/export/embed.html?bbox=74.58%2C42.86%2C74.63%2C42.885&layer=mapnik&marker=42.8746%2C74.6045" loading="lazy" />
      </div>
    </div>
  );
}
