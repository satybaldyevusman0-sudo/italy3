import { SectionHead } from '../ui/Misc';

const STEPS = [
  { n: '01', t: 'Консультация', d: 'Максатыңызды, бюджетиңизди жана баалоолоруңузду талдап, 3–5 университет тандайбыз.', m: 'Октябрь–Декабрь' },
  { n: '02', t: 'Документтер', d: 'Котормо, нотариус, мотивациялык кат, IELTS — бардыгын бирге даярдайбыз.', m: 'Январь–Февраль' },
  { n: '03', t: 'Тапшыруу', d: 'Университеттин порталында жана Universitaly системасында катталабыз.', m: 'Март–Май' },
  { n: '04', t: 'Виза', d: 'Кабыл алуу каты келгенден кийин D-type окуу визасын алабыз.', m: 'Июнь–Август' },
  { n: '05', t: 'Италияга учуу', d: 'Турак жай, codice fiscale, permesso di soggiorno — жергиликтүү жардам.', m: 'Сентябрь' },
];

export default function StepsSection() {
  return (
    <section className="section section--tint">
      <div className="container">
        <SectionHead kicker="Кантип иштейбиз" title="Тапшыруунун 5 кадамы" text="Биринчи консультациядан Италиядагы биринчи сабакка чейин." />
        <ol className="steps">
          {STEPS.map((s) => (
            <li key={s.n} className="step">
              <span className="step__n">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <small>🗓 {s.m}</small>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
