import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { universitiesApi } from '../../api';
import { useFetch } from '../../hooks';
import UniGrid from '../uni/UniGrid';
import { SectionHead } from '../ui/Misc';

export default function FeaturedUnis() {
  const { t } = useTranslation();
  const { data, loading } = useFetch(() => universitiesApi.list({ sort: 'rating', limit: 6 }), []);
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          kicker="Топ рейтинг"
          title="Эң популярдуу университеттер"
          text="Кыргызстандык студенттер эң көп тандаган окуу жайлар."
          action={<Link to="/catalog" className="btn btn--ghost">{t('common.seeAll')} →</Link>}
        />
        <UniGrid items={data?.items} loading={loading} />
      </div>
    </section>
  );
}
