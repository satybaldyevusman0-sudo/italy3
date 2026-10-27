import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { universitiesApi } from '../api';
import { useFetch, useTitle } from '../hooks';
import { useCart } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { SkeletonDetail } from '../components/ui/Skeleton';
import { Breadcrumbs, EmptyState, ImageWithFallback, Tabs, money } from '../components/ui/Misc';
import Stars from '../components/ui/Stars';
import FavoriteButton from '../components/uni/FavoriteButton';
import ProgramTable from '../components/uni/ProgramTable';
import Reviews from '../components/uni/Reviews';
import UniCard from '../components/uni/UniCard';

export default function UniDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const nav = useNavigate();
  const cart = useCart();
  const toast = useToast();
  const [tab, setTab] = useState('overview');
  const { data: uni, loading, error, reload } = useFetch(() => universitiesApi.get(slug), [slug]);
  const { data: similar } = useFetch(
    async () => (uni ? (await universitiesApi.list({ field: uni.fields[0], limit: 4 })).items.filter((x) => x.id !== uni.id).slice(0, 3) : []),
    [uni?.id]
  );
  useTitle(uni?.name);

  if (loading && !uni) return <SkeletonDetail />;
  if (error)
    return (
      <div className="container page">
        <EmptyState icon="🏚️" title="Университет табылган жок" text={error.message} action={<Link className="btn" to="/catalog">Каталогго кайтуу</Link>} />
      </div>
    );

  const buy = () => {
    cart.add(uni);
    nav('/checkout');
  };

  return (
    <div className="page detail">
      <div className="container">
        <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.catalog'), to: '/catalog' }, { label: uni.name }]} />
      </div>

      <section className="container detail__hero">
        <div className="detail__media">
          <ImageWithFallback src={uni.image} alt={uni.name} label={uni.city} />
          <FavoriteButton id={uni.id} className="detail__fav" />
          <span className={`tag tag--${uni.type}`}>{t(`common.${uni.type}`)}</span>
        </div>
        <div className="detail__info">
          <span className="kicker">📍 {uni.city}, {uni.region}</span>
          <h1>{uni.name}</h1>
          <p className="detail__it">{uni.nameIt}</p>
          <div className="detail__rating"><Stars value={uni.rating} /> <b>{uni.rating}</b> <button className="link" onClick={() => setTab('reviews')}>· пикирлерди окуу</button></div>
          <div className="facts">
            <div><small>{t('common.founded')}</small><b>{uni.founded}</b></div>
            <div><small>{t('common.students')}</small><b>{uni.students.toLocaleString('ru-RU')}</b></div>
            <div><small>Чет элдик</small><b>{uni.intlStudents.toLocaleString('ru-RU')}</b></div>
            <div><small>QS 2026</small><b>{uni.qsRank ? `#${uni.qsRank}` : '—'}</b></div>
          </div>
          <div className="price-box">
            <div>
              <small>{t('detail.service')}</small>
              <strong>{money(uni.price)}</strong>
              <span className={`stock ${uni.stock < 10 ? 'stock--low' : ''}`}>{t('detail.seats')}: {uni.stock}</span>
            </div>
            <div className="price-box__btns">
              <button className="btn btn--ghost" onClick={() => { cart.add(uni); toast('Себетке кошулду'); }}>🛒 {t('common.addCart')}</button>
              <button className="btn" onClick={buy} disabled={uni.stock === 0}>⚡ {t('common.buy')}</button>
            </div>
          </div>
          <div className="mini-grid">
            <div>💶 <small>{t('detail.tuition')}</small><b>€{uni.tuitionMin}–{uni.tuitionMax}{t('common.perYear')}</b></div>
            <div>🏠 <small>{t('detail.living')}</small><b>~€{uni.livingCost}/ай</b></div>
            <div>🗓 <small>{t('detail.deadline')}</small><b>{uni.deadline}</b></div>
            <div>🎒 <small>{t('detail.intake')}</small><b>{uni.intake}</b></div>
          </div>
        </div>
      </section>

      <section className="container detail__body">
        <Tabs
          active={tab}
          onChange={setTab}
          tabs={[
            { id: 'overview', label: t('detail.overview') },
            { id: 'programs', label: t('detail.programs'), count: uni.programs.length },
            { id: 'requirements', label: t('detail.requirements') },
            { id: 'reviews', label: t('detail.reviews') },
          ]}
        />
        <div className="tab-panel">
          {tab === 'overview' && (
            <div className="overview">
              <div className="prose">
                {uni.description.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <aside className="card">
                <h4>✨ Артыкчылыктары</h4>
                <ul className="checklist">{uni.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
                <h4>📚 Багыттар</h4>
                <div className="chips">{uni.fields.map((f) => <Link key={f} to={`/catalog?field=${f}`} className="chip">{t(`fields.${f}`)}</Link>)}</div>
              </aside>
            </div>
          )}
          {tab === 'programs' && <ProgramTable programs={uni.programs} />}
          {tab === 'requirements' && (
            <div className="overview">
              <ul className="checklist checklist--big">{uni.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
              <aside className="card">
                <h4>Документтерди биз даярдайбыз</h4>
                <p className="muted">Котормо, нотариус, мотивациялык кат жана виза пакети — баары бир кызматта.</p>
                <Link to="/services" className="btn btn--block">Кызматтарды көрүү</Link>
              </aside>
            </div>
          )}
          {tab === 'reviews' && <Reviews uniId={uni.id} onChange={reload} />}
        </div>
      </section>

      {similar?.length > 0 && (
        <section className="container section">
          <h2>Окшош университеттер</h2>
          <div className="uni-grid">{similar.map((u) => <UniCard key={u.id} uni={u} />)}</div>
        </section>
      )}
    </div>
  );
}
