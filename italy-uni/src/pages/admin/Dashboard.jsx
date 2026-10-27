import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { statsApi } from '../../api';
import { resetDb } from '../../api/client';
import { useFetch, useTitle } from '../../hooks';
import { subscribe } from '../../utils/realtime';
import StatCard from '../../components/admin/StatCard';
import { SkeletonRows } from '../../components/ui/Skeleton';
import { money } from '../../components/ui/Misc';

const COLORS = ['#0f7a4a', '#c8102e', '#d4a017', '#2563eb', '#7c3aed', '#0e7490', '#9a3412', '#be185d'];

export default function Dashboard() {
  useTitle('Админ — Дашборд');
  const { t } = useTranslation();
  const { data, loading, reload } = useFetch(() => statsApi.dashboard(), []);

  // Realtime: жаңы заказ/брондоо келсе статистика жаңырат
  useEffect(() => subscribe(() => reload()), [reload]);

  if (loading && !data) return <SkeletonRows rows={8} />;
  const c = data.counts;

  return (
    <div>
      <div className="row-between">
        <h1>📊 Дашборд</h1>
        <button className="btn btn--ghost btn--sm" onClick={() => { if (confirm('Бардык маалыматты баштапкы абалга кайтарасызбы?')) { resetDb(); location.reload(); } }}>↺ Маалыматты баштапкы абалга</button>
      </div>
      <div className="stat-cards">
        <StatCard icon="🎓" label="Университеттер" value={c.universities} />
        <StatCard icon="🛒" label="Заказдар" value={c.orders} color="var(--red)" />
        <StatCard icon="💰" label="Киреше" value={money(c.revenue)} color="var(--gold)" />
        <StatCard icon="👥" label="Колдонуучулар" value={c.users} color="#2563eb" />
        <StatCard icon="📅" label="Брондоолор" value={c.bookings} color="#7c3aed" />
        <StatCard icon="⭐" label="Пикирлер" value={c.reviews} color="#0e7490" />
      </div>

      <div className="charts">
        <div className="card chart-card chart-card--wide">
          <h3>Акыркы 7 күндөгү киреше</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.days}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f7a4a" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0f7a4a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="day" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <Tooltip formatter={(v, n) => (n === 'revenue' ? money(v) : v)} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#0f7a4a" fill="url(#g1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <h3>Шаарлар боюнча</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.byCity} dataKey="value" nameKey="name" outerRadius={90} innerRadius={45}>
                {data.byCity.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <h3>Багыттар боюнча</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.byField.map((x) => ({ ...x, name: t(`fields.${x.name}`) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} />
              <YAxis stroke="var(--muted)" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="Университет" fill="#c8102e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <h3>Заказдардын саны</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.days}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="day" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" name="Заказ" fill="#d4a017" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <h3>Топ рейтинг</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.topRated} layout="vertical">
              <XAxis type="number" domain={[0, 5]} stroke="var(--muted)" />
              <YAxis type="category" dataKey="name" width={80} stroke="var(--muted)" fontSize={12} />
              <Tooltip />
              <Bar dataKey="rating" fill="#0f7a4a" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
