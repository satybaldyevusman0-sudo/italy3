import { Link } from 'react-router-dom';
import { useTitle } from '../hooks';
import { Breadcrumbs, SectionHead } from '../components/ui/Misc';
import StatsStrip from '../components/home/StatsStrip';

const TEAM = [
  { name: 'Асел Жумабаева', role: 'Негиздөөчү, Болонья бүтүрүүчүсү', e: '👩‍🎓' },
  { name: 'Бакыт Осмонов', role: 'Виза боюнча адис', e: '🛂' },
  { name: 'Мээрим Токтосунова', role: 'Стипендия координатору', e: '💶' },
  { name: 'Марко Росси', role: 'Италиядагы өкүл (Милан)', e: '🇮🇹' },
];

export default function About() {
  useTitle('Биз жөнүндө');
  return (
    <div className="page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Башкы бет', to: '/' }, { label: 'Биз жөнүндө' }]} />
        <div className="about">
          <div>
            <span className="kicker">2018-жылдан бери</span>
            <h1>Биз Италияда окуган кыргызстандыктарбыз</h1>
            <p className="lead">StudyItalia.kg — Италиянын университеттеринде өзүбүз окуп, бүтүргөн жаштар түзгөн агенттик. Биз жол менен өзүбүз өткөнбүз, ошондуктан ар бир кадамдын кыйынчылыгын жакшы билебиз.</p>
            <p>Миссиябыз — кыргызстандык жаштарга Европанын сапаттуу жана арзан билимин жеткиликтүү кылуу. Биз жашыруун акы албайбыз, келишимди ачык түзөбүз жана натыйжага жооп беребиз.</p>
            <Link to="/booking" className="btn">Консультацияга жазылуу</Link>
          </div>
          <div className="about__card">
            <div className="postcard">
              <h3>Биздин баалуулуктар</h3>
              <ul className="checklist"><li>Ачыктык — бардык баалар сайтта</li><li>Жоопкерчилик — кабыл алынбасаңыз 50% кайтарабыз</li><li>Тажрыйба — 1200+ ийгиликтүү студент</li><li>Колдоо — Италияга барганыңыздан кийин да</li></ul>
            </div>
          </div>
        </div>
      </div>
      <StatsStrip />
      <section className="section container">
        <SectionHead kicker="Команда" title="Сизге ким жардам берет" />
        <div className="team">
          {TEAM.map((m) => (
            <div key={m.name} className="member card"><span className="member__ava">{m.e}</span><b>{m.name}</b><small>{m.role}</small></div>
          ))}
        </div>
      </section>
    </div>
  );
}
