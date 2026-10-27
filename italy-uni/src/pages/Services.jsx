import { servicesApi } from '../api';
import { useFetch, useTitle } from '../hooks';
import { useCart } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs, SectionHead, money } from '../components/ui/Misc';
import { SkeletonRows } from '../components/ui/Skeleton';

const PACKAGES = [
  { name: 'Старт', price: 38000, items: ['3 университетке тапшыруу', 'Мотивациялык кат', 'Universitaly каттоо'], hot: false },
  { name: 'Стандарт', price: 65000, items: ['5 университетке тапшыруу', 'Документтерди которуу', 'DSU стипендияга тапшыруу', 'Виза пакети'], hot: true },
  { name: 'Премиум', price: 110000, items: ['8 университет', 'Бардык котормолор', 'Стипендия + виза', 'Италияда турак жай', 'Аэропорттон тосуп алуу'], hot: false },
];

export default function Services() {
  useTitle('Кызматтар');
  const cart = useCart();
  const toast = useToast();
  const { data, loading } = useFetch(() => servicesApi.list(), []);

  const add = (s) => {
    cart.add({ id: s.id, name: s.title, price: s.price, icon: s.icon }, 'service');
    toast(`${s.title} себетке кошулду`);
  };

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Башкы бет', to: '/' }, { label: 'Кызматтар' }]} />
      <SectionHead kicker="Пакеттер" title="Тапшыруу пакеттери" text="Бир жолку төлөм — жашыруун акысыз. Акча кабыл алуу каты келбесе 50% кайтарылат." />
      <div className="packages">
        {PACKAGES.map((p, i) => (
          <div key={p.name} className={`package ${p.hot ? 'package--hot' : ''}`}>
            {p.hot && <span className="package__badge">🔥 Эң популярдуу</span>}
            <h3>{p.name}</h3>
            <div className="package__price">{money(p.price)}</div>
            <ul className="checklist">{p.items.map((x) => <li key={x}>{x}</li>)}</ul>
            <button className={`btn btn--block ${p.hot ? '' : 'btn--ghost'}`} onClick={() => add({ id: 100 + i, title: `«${p.name}» пакети`, price: p.price, icon: '📦' })}>
              Тандоо
            </button>
          </div>
        ))}
      </div>

      <SectionHead kicker="Өзүнчө" title="Кошумча кызматтар" />
      {loading ? (
        <SkeletonRows rows={4} />
      ) : (
        <div className="services">
          {data.map((s) => (
            <div key={s.id} className="service card">
              <span className="service__icon">{s.icon}</span>
              <div>
                <h4>{s.title}</h4>
                <b>{s.price ? money(s.price) : 'Акысыз'}</b>
              </div>
              <button className="btn btn--sm" onClick={() => add(s)}>+ Себет</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
