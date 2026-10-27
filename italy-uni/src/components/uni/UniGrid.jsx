import UniCard from './UniCard';
import { SkeletonGrid } from '../ui/Skeleton';
import { EmptyState } from '../ui/Misc';

export default function UniGrid({ items, loading, skeletons = 6, emptyText }) {
  if (loading) return <SkeletonGrid count={skeletons} />;
  if (!items?.length) return <EmptyState icon="🎓" title="Университет табылган жок" text={emptyText || 'Чыпкаларды өзгөртүп көрүңүз'} />;
  return (
    <div className="uni-grid">
      {items.map((u) => <UniCard key={u.id} uni={u} />)}
    </div>
  );
}
