export function Skeleton({ w = '100%', h = 16, r = 8, style }) {
  return <span className="skeleton" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

export function SkeletonCard() {
  return (
    <div className="uni-card uni-card--skeleton">
      <Skeleton h={190} r={0} />
      <div className="uni-card__body">
        <Skeleton w="40%" h={12} />
        <Skeleton w="85%" h={20} />
        <Skeleton w="60%" h={14} />
        <Skeleton w="100%" h={40} r={12} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="uni-grid">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="container detail-skeleton">
      <Skeleton h={360} r={24} />
      <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        <Skeleton w="50%" h={36} />
        <Skeleton w="30%" h={16} />
        <Skeleton h={14} />
        <Skeleton h={14} />
        <Skeleton w="80%" h={14} />
      </div>
    </div>
  );
}

export function SkeletonRows({ rows = 5 }) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} h={44} r={10} />
      ))}
    </div>
  );
}
