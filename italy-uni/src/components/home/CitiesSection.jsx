import { Link } from 'react-router-dom';
import { SectionHead } from '../ui/Misc';

const CITIES = [
  { name: 'Милан', emoji: '🏙️', text: 'Мода, бизнес жана инженериянын борбору', color: '#0f5132' },
  { name: 'Рим', emoji: '🏛️', text: 'Түбөлүк шаар — тарых жана медицина', color: '#9a3412' },
  { name: 'Болонья', emoji: '🎓', text: 'Студенттердин шаары, байыркы университет', color: '#7c2d12' },
  { name: 'Флоренция', emoji: '🎨', text: 'Искусство жана архитектура', color: '#854d0e' },
  { name: 'Турин', emoji: '🚗', text: 'Автомобиль инженериясы, Альптарга жакын', color: '#1e3a8a' },
  { name: 'Падуя', emoji: '🔭', text: 'Галилейдин шаары, арзан жашоо', color: '#4c1d95' },
];

export default function CitiesSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead kicker="Шаарлар" title="Кайсы шаарда окугуңуз келет?" text="Ар бир шаардын өз мүнөзү жана жашоо баасы бар." />
        <div className="cities">
          {CITIES.map((c) => (
            <Link key={c.name} to={`/catalog?city=${encodeURIComponent(c.name)}`} className="city" style={{ '--c': c.color }}>
              <span className="city__emoji">{c.emoji}</span>
              <h3>{c.name}</h3>
              <p>{c.text}</p>
              <span className="city__go">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
