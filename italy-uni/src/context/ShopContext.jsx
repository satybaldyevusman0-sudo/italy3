import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks';

/* =========================  Себет  ========================= */
const CartContext = createContext(null);

const PROMOS = { ITALIA10: 0.1, STUDENT15: 0.15 };

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('si_cart', []);
  const [promo, setPromo] = useLocalStorage('si_promo', '');

  const api = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const rate = PROMOS[promo] || 0;
    const discount = Math.round(subtotal * rate);
    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal,
      discount,
      total: subtotal - discount,
      promo,
      has: (id, kind = 'uni') => items.some((i) => i.id === id && i.kind === kind),
      add: (product, kind = 'uni') =>
        setItems((prev) => {
          const ex = prev.find((i) => i.id === product.id && i.kind === kind);
          if (ex) return prev.map((i) => (i === ex ? { ...i, qty: i.qty + 1 } : i));
          return [...prev, { id: product.id, kind, name: product.name || product.title, price: product.price, image: product.image, icon: product.icon, city: product.city, qty: 1 }];
        }),
      setQty: (id, kind, qty) =>
        setItems((prev) => (qty <= 0 ? prev.filter((i) => !(i.id === id && i.kind === kind)) : prev.map((i) => (i.id === id && i.kind === kind ? { ...i, qty } : i)))),
      remove: (id, kind) => setItems((prev) => prev.filter((i) => !(i.id === id && i.kind === kind))),
      clear: () => {
        setItems([]);
        setPromo('');
      },
      applyPromo: (code) => {
        const c = code.trim().toUpperCase();
        if (PROMOS[c]) {
          setPromo(c);
          return true;
        }
        return false;
      },
    };
  }, [items, promo, setItems, setPromo]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);

/* =========================  Тандалгандар  ========================= */
const FavContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [ids, setIds] = useLocalStorage('si_favs', []);
  const value = useMemo(
    () => ({
      ids,
      has: (id) => ids.includes(id),
      toggle: (id) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])),
    }),
    [ids, setIds]
  );
  return <FavContext.Provider value={value}>{children}</FavContext.Provider>;
}

export const useFavorites = () => useContext(FavContext);
