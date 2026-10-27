export default function StatCard({ icon, label, value, hint, color = 'var(--green)' }) {
  return (
    <div className="stat-card" style={{ '--c': color }}>
      <span className="stat-card__icon">{icon}</span>
      <div>
        <small>{label}</small>
        <b>{value}</b>
        {hint && <em>{hint}</em>}
      </div>
    </div>
  );
}
