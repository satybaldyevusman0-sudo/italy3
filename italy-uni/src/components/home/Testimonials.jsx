import { useEffect, useState } from 'react';
import { SectionHead } from '../ui/Misc';
import Stars from '../ui/Stars';

const ITEMS = [
  { name: 'Айпери К.', uni: 'Болонья университети, Экономика', text: 'DSU стипендиясын алып, окуу акысын такыр төлөбөйм. Жатакана да акысыз! StudyItalia командасы ар бир кадамда жанымда болду.' },
  { name: 'Нурсултан Т.', uni: 'Милан политехникасы, Computer Engineering', text: 'IELTS даярдоодон баштап визага чейин баарын бир жерден алдым. Азыр Миланда 2-курста окуп, жарым күн иштейм.' },
  { name: 'Жибек А.', uni: 'Павия университети, Medicine (Harvey)', text: 'IMAT экзаменине даярдык курсу абдан пайдалуу болду. Медицинага тапшыруу кыялым орундалды.' },
  { name: 'Эрлан М.', uni: 'Турин политехникасы, Automotive Eng.', text: 'Туринде жашоо Миланга караганда арзан, университет күчтүү. Консультанттарга чоң рахмат!' },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % ITEMS.length), 5000);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="section section--dark">
      <div className="container">
        <SectionHead kicker="Студенттердин үнү" title="Алар азыр Италияда окушат" />
        <div className="slider">
          {ITEMS.map((it, k) => (
            <blockquote key={k} className={`slide ${k === i ? 'active' : ''}`} aria-hidden={k !== i}>
              <Stars value={5} />
              <p>“{it.text}”</p>
              <footer><span className="avatar">{it.name[0]}</span><div><b>{it.name}</b><small>{it.uni}</small></div></footer>
            </blockquote>
          ))}
        </div>
        <div className="dots">
          {ITEMS.map((_, k) => <button key={k} className={k === i ? 'active' : ''} onClick={() => setI(k)} aria-label={`Слайд ${k + 1}`} />)}
        </div>
      </div>
    </section>
  );
}
