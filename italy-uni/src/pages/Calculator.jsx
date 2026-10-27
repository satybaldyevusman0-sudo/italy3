import { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { universitiesApi } from '../api';
import { fetchEuroRate } from '../api/integrations';
import { useFetch, useTitle } from '../hooks';
import { Breadcrumbs } from '../components/ui/Misc';

const COLORS = ['#0f7a4a', '#c8102e', '#d4a017', '#2563eb', '#7c3aed'];

/** Чыгым калькулятору: евро курсу ачык API'ден алынат */
export default function Calculator() {
  useTitle('Калькулятор');
  const { data: unis } = useFetch(() => universitiesApi.all(), []);
  const [uniId, setUniId] = useState('');
  const [rent, setRent] = useState(450);
  const [food, setFood] = useState(250);
  const [transport, setTransport] = useState(30);
  const [other, setOther] = useState(100);
  const [dsu, setDsu] = useState(false);
  const [rate, setRate] = useState(null);

  useEffect(() => { fetchEuroRate().then(setRate); }, []);
  useEffect(() => { if (unis?.length && !uniId) setUniId(String(unis[0].id)); }, [unis, uniId]);

  const uni = unis?.find((u) => String(u.id) === uniId);
  const calc = useMemo(() => {
    const tuition = dsu ? 0 : uni ? Math.round((uni.tuitionMin + uni.tuitionMax) / 2) : 0;
    const monthly = (dsu ? 0 : rent) + food + transport + other;
    const yearLiving = monthly * 12;
    const scholarship = dsu ? 6500 : 0;
    const total = tuition + yearLiving - scholarship;
    return { tuition, monthly, yearLiving, scholarship, total };
  }, [uni, rent, food, transport, other, dsu]);

  const pie = [
    { name: 'Окуу акысы', value: calc.tuition },
    { name: 'Турак жай', value: dsu ? 0 : rent * 12 },
    { name: 'Тамак', value: food * 12 },
    { name: 'Транспорт', value: transport * 12 },
    { name: 'Башка', value: other * 12 },
  ].filter((x) => x.value > 0);

  const range = (label, value, set, max) => (
    <label className="field" key={label}>
      <span>{label}: <b>€{value}</b></span>
      <input type="range" min="0" max={max} step="10" value={value} onChange={(e) => set(Number(e.target.value))} />
    </label>
  );

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: 'Башкы бет', to: '/' }, { label: 'Калькулятор' }]} />
      <div className="page-head"><div><h1>🧮 Италияда окуунун чыгымы</h1><p className="muted">Евро курсу: {rate ? `1 € = ${rate.toFixed(2)} сом (open.er-api.com)` : 'жүктөлүүдө…'}</p></div></div>
      <div className="calc">
        <div className="card">
          <label className="field"><span>Университет</span>
            <select value={uniId} onChange={(e) => setUniId(e.target.value)}>
              {unis?.map((u) => <option key={u.id} value={u.id}>{u.name} — {u.city}</option>)}
            </select>
          </label>
          {range("Турак жай / ай", rent, setRent, 1000)}
          {range("Тамак / ай", food, setFood, 600)}
          {range("Транспорт / ай", transport, setTransport, 150)}
          {range("Башка чыгымдар / ай", other, setOther, 400)}
          <label className="switch"><input type="checkbox" checked={dsu} onChange={(e) => setDsu(e.target.checked)} /><span /> DSU стипендиясы менен (окуу акысы + жатакана акысыз, €6500 стипендия)</label>
        </div>
        <div className="card calc__result">
          <h3>Жылдык чыгым</h3>
          <div className="calc__big">€{calc.total.toLocaleString('ru-RU')}</div>
          {rate && <div className="calc__som">≈ {Math.round(calc.total * rate).toLocaleString('ru-RU')} сом</div>}
          <div className="summary__row"><span>Окуу акысы</span><span>€{calc.tuition}</span></div>
          <div className="summary__row"><span>Жашоо (12 ай)</span><span>€{calc.yearLiving}</span></div>
          {dsu && <div className="summary__row summary__row--green"><span>DSU стипендиясы</span><span>−€{calc.scholarship}</span></div>}
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {pie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `€${v}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
