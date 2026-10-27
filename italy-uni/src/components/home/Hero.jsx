import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchBox from '../layout/SearchBox';

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__arch" />
        <span className="hero__sun" />
      </div>
      <div className="container hero__in">
        <div className="hero__text">
          <span className="kicker">🇮🇹 Benvenuti in Italia · 2027/28</span>
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.subtitle')}</p>
          <SearchBox big />
          <div className="hero__cta">
            <Link to="/catalog" className="btn btn--lg">{t('hero.cta')} →</Link>
            <Link to="/booking" className="btn btn--lg btn--ghost">{t('hero.cta2')}</Link>
          </div>
          <div className="hero__trust">
            <div className="avatars"><span>А</span><span>Н</span><span>Ж</span><span>+</span></div>
            <p><b>1 200+</b> кыргызстандык студент биз аркылуу Италияга тапшырды</p>
          </div>
        </div>
        <div className="hero__card">
          <div className="postcard">
            <div className="postcard__top">
              <span>BOLOGNA</span><span className="stamp">1088</span>
            </div>
            <h3>Болонья университети</h3>
            <p>Дүйнөдөгү эң байыркы университет</p>
            <div className="postcard__stats">
              <div><b>€0</b><small>DSU менен окуу акысы</small></div>
              <div><b>€7k</b><small>стипендия / жыл</small></div>
            </div>
            <Link to="/university/bologna" className="btn btn--block">Көрүү</Link>
          </div>
          <div className="floating-badge floating-badge--1">✅ Виза 98% ийгилик</div>
          <div className="floating-badge floating-badge--2">🎓 17 университет</div>
        </div>
      </div>
    </section>
  );
}
