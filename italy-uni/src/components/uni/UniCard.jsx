import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import FavoriteButton from './FavoriteButton';
import Stars from '../ui/Stars';
import { ImageWithFallback, money } from '../ui/Misc';

export default function UniCard({ uni }) {
  const { t } = useTranslation();
  const cart = useCart();
  const toast = useToast();
  const inCart = cart.has(uni.id);

  return (
    <article className="uni-card">
      <Link to={`/university/${uni.slug}`} className="uni-card__media">
        <ImageWithFallback src={uni.image} alt={uni.name} label={uni.city} />
        <span className={`tag tag--${uni.type}`}>{t(`common.${uni.type}`)}</span>
        {uni.qsRank && <span className="tag tag--qs">QS #{uni.qsRank}</span>}
        <FavoriteButton id={uni.id} className="uni-card__fav" />
      </Link>
      <div className="uni-card__body">
        <div className="uni-card__meta">
          <span>📍 {uni.city}</span>
          <span>🏛 {uni.founded}</span>
        </div>
        <Link to={`/university/${uni.slug}`}><h3>{uni.name}</h3></Link>
        <p className="uni-card__it">{uni.nameIt}</p>
        <div className="uni-card__rating">
          <Stars value={uni.rating} size={15} /> <b>{uni.rating}</b>
        </div>
        <div className="chips">
          {uni.fields.slice(0, 3).map((f) => <span key={f} className="chip">{t(`fields.${f}`)}</span>)}
        </div>
        <div className="uni-card__tuition">
          <span>{t('detail.tuition')}</span>
          <b>€{uni.tuitionMin.toLocaleString()}–{uni.tuitionMax.toLocaleString()}{t('common.perYear')}</b>
        </div>
        <div className="uni-card__foot">
          <div>
            <small>{t('detail.service')}</small>
            <strong>{money(uni.price)}</strong>
          </div>
          <button
            className={`btn btn--sm ${inCart ? 'btn--ghost' : ''}`}
            onClick={() => {
              cart.add(uni);
              toast(`${uni.name} себетке кошулду`);
            }}
          >
            {inCart ? `✓ ${t('common.inCart')}` : `🛒 ${t('common.addCart')}`}
          </button>
        </div>
      </div>
    </article>
  );
}
