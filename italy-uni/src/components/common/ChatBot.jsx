import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { universitiesApi } from '../../api';

const QUICK = ['Окуу акысы канча?', 'Стипендия барбы?', 'Кандай документтер керек?', 'Медицина', 'Байланыш'];

/** Эрежеге негизделген чат-бот: каталогдон (API) жооп издейт */
async function reply(text) {
  const q = text.toLowerCase();
  if (/салам|привет|hello|hi\b/.test(q)) return { text: 'Салам! 👋 Мен StudyItalia ботумун. Университет, стипендия, документтер же баа тууралуу сураңыз.' };
  if (/акы|баа|канча|cost|цена|стоим/.test(q))
    return { text: 'Италиянын мамлекеттик университеттеринде окуу акысы жылына €0–4000 (үй-бүлөнүн кирешесине жараша). Жеке университеттер (Боккони) — €14 000+. Биздин тапшыруу кызматы 38 000 сомдон башталат.', link: { to: '/calculator', label: '🧮 Чыгымды эсептөө' } };
  if (/стипенд|грант|scholar/.test(q))
    return { text: 'Эң популярдуу — DSU регионалдык стипендиясы: жылына €7000ге чейин + акысыз жатакана + тамак + окуу акысынан бошотуу. Ошондой эле MAECI жана Invest Your Talent бар.', link: { to: '/scholarships', label: '💶 Стипендиялар' } };
  if (/документ|талап|кагаз|require/.test(q))
    return { text: 'Негизги документтер: аттестат/диплом жана котормосу, IELTS 6.0+, мотивациялык кат, 2 сунуш кат, паспорт. Медицинага — IMAT экзамени.', link: { to: '/services', label: '🧰 Кызматтар' } };
  if (/байланыш|телефон|контакт|адрес/.test(q))
    return { text: '📞 +996 700 123 456\n✉️ info@studyitalia.kg\n📍 Бишкек, Чүй пр. 123', link: { to: '/contacts', label: '📞 Байланыш' } };
  if (/виза|visa/.test(q)) return { text: "Окуу визасы (D-type) Италиянын элчилиги аркылуу алынат. Universitaly порталында pre-enrollment бүткөндөн кийин тапшырылат. Биз виза пакетин толук даярдайбыз." };

  // Каталогдон издөө (API аркылуу)
  const fieldMap = { медицин: 'medicine', инженер: 'engineering', экономик: 'economics', архитект: 'architecture', дизайн: 'design', укук: 'law' };
  const field = Object.entries(fieldMap).find(([k]) => q.includes(k))?.[1];
  const res = await universitiesApi.list(field ? { field, sort: 'rating', limit: 3 } : { search: text, limit: 3 });
  if (res.items.length)
    return {
      text: `Мына сизге ылайыктуу университеттер (${res.total}):`,
      unis: res.items,
    };
  return { text: 'Кечиресиз, түшүнгөн жокмун 🤔 Консультантыбыз менен акысыз сүйлөшүңүз.', link: { to: '/booking', label: '📅 Консультация' } };
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ from: 'bot', text: 'Салам! 👋 Италияда окуу тууралуу суроо бериңиз.' }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const body = useRef(null);

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  const send = async (text) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: 'me', text }]);
    setInput('');
    setTyping(true);
    const r = await reply(text);
    setTyping(false);
    setMsgs((m) => [...m, { from: 'bot', ...r }]);
  };

  return (
    <>
      <button className={`chat-fab ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="Чат-бот">
        {open ? '✕' : '💬'}
      </button>
      {open && (
        <div className="chat">
          <header className="chat__head">
            <span className="avatar">🤖</span>
            <div><b>StudyItalia бот</b><small><span className="live-dot" /> онлайн</small></div>
          </header>
          <div className="chat__body" ref={body}>
            {msgs.map((m, i) => (
              <div key={i} className={`msg msg--${m.from}`}>
                <p>{m.text}</p>
                {m.unis && (
                  <div className="msg__unis">
                    {m.unis.map((u) => (
                      <Link key={u.id} to={`/university/${u.slug}`} onClick={() => setOpen(false)}>🎓 {u.name} · ★{u.rating}</Link>
                    ))}
                  </div>
                )}
                {m.link && <Link className="msg__link" to={m.link.to} onClick={() => setOpen(false)}>{m.link.label}</Link>}
              </div>
            ))}
            {typing && <div className="msg msg--bot"><p className="typing"><i /><i /><i /></p></div>}
          </div>
          <div className="chat__quick">
            {QUICK.map((q) => <button key={q} onClick={() => send(q)}>{q}</button>)}
          </div>
          <form className="chat__form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Суроо жазыңыз…" />
            <button className="btn btn--sm">➤</button>
          </form>
        </div>
      )}
    </>
  );
}
