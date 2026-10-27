import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { universitiesApi } from '../api';
import { useFavorites } from '../context/ShopContext';
import { useFetch, useTitle } from '../hooks';
import UniGrid from '../components/uni/UniGrid';
import { Breadcrumbs, EmptyState } from '../components/ui/Misc';

export default function Favorites() {
  const { t } = useTranslation();
  useTitle(t('nav.favorites'));
  const { ids } = useFavorites();
  const { data, loading } = useFetch(() => universitiesApi.all(), []);
  const list = (data || []).filter((u) => ids.includes(u.id));

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.favorites') }]} />
      <div className="page-head"><div><h1>❤️ {t('nav.favorites')}</h1><p className="muted">{ids.length} университет</p></div></div>
      {!loading && list.length === 0 ? (
        <EmptyState icon="🤍" title="Тандалгандар бош" text="Университеттин карточкасындагы жүрөкчөнү басыңыз." action={<Link className="btn" to="/catalog">Каталогго өтүү</Link>} />
      ) : (
        <UniGrid items={list} loading={loading} skeletons={3} />
      )}
    </div>
  );
}
