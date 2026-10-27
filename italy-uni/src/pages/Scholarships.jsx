import { Link } from 'react-router-dom';
import { useTitle } from '../hooks';
import { Breadcrumbs, SectionHead } from '../components/ui/Misc';

const LIST = [
  { name: 'DSU — Diritto allo Studio', amount: '€5 000 – €7 500 / жыл', who: 'Бардык чет элдик студенттер (кирешеге жараша)', perks: ['Окуу акысынан толук бошотуу', 'Акысыз же арзан жатакана', 'Күнүнө 1–2 акысыз тамак', 'Ар жыл сайын жаңыртылат'], deadline: 'Июль — Сентябрь', color: '#0f7a4a' },
  { name: 'MAECI Италия өкмөтүнүн стипендиясы', amount: '€900 / ай', who: 'Магистратура жана PhD', perks: ['Ай сайын €900', 'Окуу акысынан бошотуу', 'Медициналык камсыздандыруу'], deadline: 'Февраль — Май', color: '#b4232a' },
  { name: 'Invest Your Talent in Italy', amount: '€8 000 / жыл', who: 'Инженерия, экономика, дизайн магистратурасы', perks: ['Стипендия', 'Италиялык компанияда стажировка', 'Италия тили курсу'], deadline: 'Январь — Март', color: '#1e40af' },
  { name: 'Bocconi Merit Award', amount: '100% окуу акысы', who: 'Боккониге мыкты бааларга ээ абитуриенттер', perks: ['Окуу акысынан толук бошотуу', '€12 000 чейин жашоо үчүн'], deadline: 'Тапшыруу менен бирге', color: '#7c3aed' },
  { name: 'PoliMi Merit-Based Scholarship', amount: '€5 000 – €10 000', who: 'Милан политехникасынын магистранттары', perks: ['Окуу акысынан бошотуу', 'Акчалай колдоо'], deadline: 'Тапшыруу менен бирге', color: '#0e7490' },
  { name: 'Padova International Excellence', amount: '€8 000 / жыл', who: 'Падуянын англисче программалары', perks: ['Окуу акысынан бошотуу', 'Стипендия 2 жылга'], deadline: 'Январь — Март', color: '#9a3412' },
];

export default function Scholarships() {
  useTitle('Стипендиялар');
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Башкы бет', to: '/' }, { label: 'Стипендиялар' }]} />
      <SectionHead kicker="Акысыз окуу" title="Италиядагы стипендиялар" text="Кыргызстандык студенттер үчүн эң реалдуу каржылоо мүмкүнчүлүктөрү." />
      <div className="scholarships">
        {LIST.map((s) => (
          <article key={s.name} className="scholarship" style={{ '--c': s.color }}>
            <div className="scholarship__top">
              <h3>{s.name}</h3>
              <span className="scholarship__amount">{s.amount}</span>
            </div>
            <p className="muted">👥 {s.who}</p>
            <ul className="checklist">{s.perks.map((p) => <li key={p}>{p}</li>)}</ul>
            <div className="scholarship__foot">
              <small>🗓 {s.deadline}</small>
              <Link to="/booking" className="btn btn--sm">Тапшырууга жардам</Link>
            </div>
          </article>
        ))}
      </div>
      <div className="note card">
        <h4>💡 DSU стипендиясын алуу үчүн эмне керек?</h4>
        <p>Үй-бүлөнүн кирешеси жана мүлкү тууралуу маалымкат (ISEE parificato үчүн), Италиянын элчилигинде легализацияланган котормосу менен. Документтер Кыргызстанда алдын ала даярдалышы керек — биз ушул жол менен 640тан ашык студентке жардам бердик.</p>
      </div>
    </div>
  );
}
