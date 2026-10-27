import { useFavorites } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';

export default function FavoriteButton({ id, className = '' }) {
  const { has, toggle } = useFavorites();
  const toast = useToast();
  const active = has(id);
  return (
    <button
      className={`fav-btn ${active ? 'active' : ''} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
        toast(active ? 'Тандалгандардан алынды' : 'Тандалгандарга кошулду ❤️', active ? 'info' : 'success');
      }}
      aria-label="Тандалгандар"
      aria-pressed={active}
    >
      {active ? '❤️' : '🤍'}
    </button>
  );
}
