import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { universitiesApi } from '../api';
import { useDebounce, useFetch, useTitle } from '../hooks';
import { subscribe } from '../utils/realtime';
import Filters from '../components/uni/Filters';
import UniGrid from '../components/uni/UniGrid';
import Pagination from '../components/ui/Pagination';
import { Breadcrumbs } from '../components/ui/Misc';

const DEFAULTS = { search: '', city: '', field: '', type: '', maxTuition: '', sort: 'rating', page: 1 };

export default function Catalog() {
  const { t } = useTranslation();
  useTitle(t('nav.catalog'));
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('grid');

  // URL параметрлеринен чыпкалар (шилтеме менен бөлүшсө болот)
  const filters = useMemo(() => {
    const f = { ...DEFAULTS };
    Object.keys(DEFAULTS).forEach((k) => params.get(k) !== null && (f[k] = params.get(k)));
    f.page = Number(f.page) || 1;
    return f;
  }, [params]);

  const [search, setSearch] = useState(filters.search);
  const debounced = useDebounce(search, 350);

  const update = (next) => {
    const clean = Object.fromEntries(Object.entries(next).filter(([k, v]) => v !== '' && v !== DEFAULTS[k]));
    setParams(clean);
  };

  useEffect(() => setSearch(filters.search), [filters.search]);

  useEffect(() => {
    if (debounced !== filters.search) update({ ...filters, search: debounced, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const { data: cities = [] } = useFetch(() => universitiesApi.cities(), []);
  const { data, loading, error, reload } = useFetch(() => universitiesApi.list({ ...filters, limit: 9 }), [params.toString()]);

  // Realtime: админ каталогду өзгөртсө — дароо жаңыртуу
  useEffect(() => subscribe((e) => e.type === 'catalog' && reload()), [reload]);

  if (error) throw error;

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.catalog') }]} />
      <div className="page-head">
        <div>
          <h1>Италиянын университеттери</h1>
          <p className="muted">{data ? `${data.total} университет табылды` : t('common.loading')}</p>
        </div>
      </div>

      <div className="catalog">
        <Filters value={filters} onChange={update} cities={cities || []} onReset={() => { setSearch(''); setParams({}); }} open={open} onClose={() => setOpen(false)} />
        {open && <div className="drawer-backdrop show show-sm" onClick={() => setOpen(false)} />}
        <div className="catalog__main">
          <div className="toolbar">
            <div className="searchbox searchbox--inline">
              <span className="searchbox__icon">🔎</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('hero.search')} />
              {search && <button className="icon-btn" onClick={() => setSearch('')}>✕</button>}
            </div>
            <button className="btn btn--ghost show-sm" onClick={() => setOpen(true)}>⚙️ {t('filters.title')}</button>
            <select value={filters.sort} onChange={(e) => update({ ...filters, sort: e.target.value, page: 1 })} aria-label={t('filters.sort')}>
              {['rating', 'priceAsc', 'priceDesc', 'oldest', 'name'].map((s) => <option key={s} value={s}>{t(`filters.${s}`)}</option>)}
            </select>
            <div className="segmented hide-sm">
              <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-label="Тор">▦</button>
              <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-label="Тизме">☰</button>
            </div>
          </div>

          {(filters.city || filters.field || filters.type || filters.search) && (
            <div className="active-filters">
              {filters.search && <button onClick={() => { setSearch(''); update({ ...filters, search: '' }); }}>“{filters.search}” ✕</button>}
              {filters.city && <button onClick={() => update({ ...filters, city: '' })}>📍 {filters.city} ✕</button>}
              {filters.field && <button onClick={() => update({ ...filters, field: '' })}>{t(`fields.${filters.field}`)} ✕</button>}
              {filters.type && <button onClick={() => update({ ...filters, type: '' })}>{t(`common.${filters.type}`)} ✕</button>}
            </div>
          )}

          <div className={view === 'list' ? 'list-view' : ''}>
            <UniGrid items={data?.items} loading={loading} skeletons={9} />
          </div>
          {data && <Pagination page={data.page} pages={data.pages} onChange={(p) => { update({ ...filters, page: p }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
        </div>
      </div>
    </div>
  );
}
