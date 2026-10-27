import { getDb, saveDb, delay, authGuard, ApiError, http, isRemote } from './client';
import { createToken } from '../utils/jwt';
import { emit } from '../utils/realtime';

const nextId = (arr) => (arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1);
const publicUser = ({ password, ...u }) => u;

// ------------------------------------------------------------------ Университеттер
export const universitiesApi = {
  /**
   * GET /universities?search=&city=&field=&type=&lang=&maxPrice=&sort=&page=&limit=
   */
  async list(params = {}) {
    await delay();
    let items = isRemote ? await http('GET', '/universities') : (await getDb()).universities;
    const { search = '', city = '', field = '', type = '', maxTuition = '', sort = '', page = 1, limit = 9 } = params;
    const q = search.trim().toLowerCase();
    if (q) items = items.filter((u) => `${u.name} ${u.nameIt} ${u.city}`.toLowerCase().includes(q));
    if (city) items = items.filter((u) => u.city === city);
    if (field) items = items.filter((u) => u.fields.includes(field));
    if (type) items = items.filter((u) => u.type === type);
    if (maxTuition !== '') items = items.filter((u) => u.tuitionMin <= Number(maxTuition));
    const sorters = {
      rating: (a, b) => b.rating - a.rating,
      priceAsc: (a, b) => a.price - b.price,
      priceDesc: (a, b) => b.price - a.price,
      oldest: (a, b) => a.founded - b.founded,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    if (sorters[sort]) items = [...items].sort(sorters[sort]);
    const total = items.length;
    const start = (page - 1) * limit;
    return { items: items.slice(start, start + Number(limit)), total, pages: Math.max(1, Math.ceil(total / limit)), page: Number(page) };
  },

  async all() {
    await delay(200);
    return isRemote ? http('GET', '/universities') : (await getDb()).universities;
  },

  async get(slug) {
    await delay();
    const list = isRemote ? await http('GET', '/universities') : (await getDb()).universities;
    const u = list.find((x) => x.slug === slug || String(x.id) === String(slug));
    if (!u) throw new ApiError('Университет табылган жок', 404);
    return u;
  },

  async create(data) {
    authGuard('admin');
    await delay();
    const db = await getDb();
    const item = {
      ...data,
      id: nextId(db.universities),
      slug: data.slug || `uni-${Date.now()}`,
      rating: Number(data.rating) || 5,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    db.universities.unshift(item);
    await saveDb(db);
    emit('catalog', { type: 'created', name: item.name });
    return item;
  },

  async update(id, data) {
    authGuard('admin');
    await delay();
    const db = await getDb();
    const idx = db.universities.findIndex((u) => u.id === id);
    if (idx < 0) throw new ApiError('Табылган жок', 404);
    db.universities[idx] = { ...db.universities[idx], ...data, id };
    await saveDb(db);
    emit('catalog', { type: 'updated', name: db.universities[idx].name });
    return db.universities[idx];
  },

  async remove(id) {
    authGuard('admin');
    await delay();
    const db = await getDb();
    db.universities = db.universities.filter((u) => u.id !== id);
    db.reviews = db.reviews.filter((r) => r.uniId !== id);
    await saveDb(db);
    emit('catalog', { type: 'deleted' });
    return true;
  },

  async cities() {
    const list = (await getDb()).universities;
    return [...new Set(list.map((u) => u.city))].sort();
  },
};

// ------------------------------------------------------------------ Пикирлер
export const reviewsApi = {
  async list(uniId) {
    await delay(300);
    const db = await getDb();
    return db.reviews.filter((r) => !uniId || r.uniId === uniId).sort((a, b) => b.id - a.id);
  },
  async create({ uniId, rating, text }) {
    const user = authGuard();
    await delay();
    const db = await getDb();
    const review = { id: nextId(db.reviews), uniId, rating, text, user: user.name, userId: user.id, date: new Date().toISOString().slice(0, 10) };
    db.reviews.push(review);
    // университеттин орточо рейтингин кайра эсептөө
    const all = db.reviews.filter((r) => r.uniId === uniId);
    const uni = db.universities.find((u) => u.id === uniId);
    if (uni) uni.rating = Math.round((all.reduce((s, r) => s + r.rating, 0) / all.length) * 10) / 10;
    await saveDb(db);
    emit('review', { uniId, user: user.name });
    return review;
  },
  async remove(id) {
    authGuard('admin');
    const db = await getDb();
    db.reviews = db.reviews.filter((r) => r.id !== id);
    await saveDb(db);
    return true;
  },
};

// ------------------------------------------------------------------ Кызматтар
export const servicesApi = {
  async list() {
    await delay(250);
    return (await getDb()).services;
  },
};

// ------------------------------------------------------------------ Авторизация
export const authApi = {
  async login(email, password) {
    await delay();
    const db = await getDb();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) throw new ApiError('Email же сырсөз туура эмес', 401);
    if (user.blocked) throw new ApiError('Аккаунт бөгөттөлгөн', 403);
    return { token: createToken({ id: user.id, name: user.name, email: user.email, role: user.role }), user: publicUser(user) };
  },

  async register({ name, email, password }) {
    await delay();
    const db = await getDb();
    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) throw new ApiError('Бул email мурунтан катталган', 409);
    const user = { id: nextId(db.users), name, email, password, role: 'user', provider: 'email', createdAt: new Date().toISOString().slice(0, 10) };
    db.users.push(user);
    await saveDb(db);
    emit('user', { name });
    return { token: createToken({ id: user.id, name, email, role: 'user' }), user: publicUser(user) };
  },

  /** OAuth (Google / GitHub) — провайдерден алынган профиль менен кирүү */
  async oauth(provider, profile) {
    await delay();
    const db = await getDb();
    let user = db.users.find((u) => u.email === profile.email);
    if (!user) {
      user = { id: nextId(db.users), name: profile.name, email: profile.email, avatar: profile.avatar, password: null, role: 'user', provider, createdAt: new Date().toISOString().slice(0, 10) };
      db.users.push(user);
      await saveDb(db);
    }
    return { token: createToken({ id: user.id, name: user.name, email: user.email, role: user.role }), user: publicUser(user) };
  },

  async me() {
    const p = authGuard();
    const db = await getDb();
    const user = db.users.find((u) => u.id === p.id);
    if (!user) throw new ApiError('Колдонуучу табылган жок', 404);
    return publicUser(user);
  },
};

// ------------------------------------------------------------------ Заказдар
export const ordersApi = {
  async create(order) {
    const user = authGuard();
    await delay(700);
    const db = await getDb();
    const item = {
      ...order,
      id: nextId(db.orders),
      number: 'SI-' + String(Date.now()).slice(-6),
      userId: user.id,
      userName: user.name,
      status: order.paid ? 'paid' : 'new',
      createdAt: new Date().toISOString(),
    };
    db.orders.unshift(item);
    // запастагы орундарды азайтуу
    item.items.forEach((it) => {
      const u = db.universities.find((x) => x.id === it.id);
      if (u && typeof u.stock === 'number') u.stock = Math.max(0, u.stock - it.qty);
    });
    await saveDb(db);
    emit('order', { number: item.number, total: item.total, user: user.name });
    return item;
  },
  async mine() {
    const user = authGuard();
    await delay();
    return (await getDb()).orders.filter((o) => o.userId === user.id);
  },
  async all() {
    authGuard('admin');
    await delay();
    return (await getDb()).orders;
  },
  async setStatus(id, status) {
    authGuard('admin');
    const db = await getDb();
    const o = db.orders.find((x) => x.id === id);
    if (o) o.status = status;
    await saveDb(db);
    return o;
  },
  async remove(id) {
    authGuard('admin');
    const db = await getDb();
    db.orders = db.orders.filter((o) => o.id !== id);
    await saveDb(db);
  },
};

// ------------------------------------------------------------------ Брондоо (консультация)
export const bookingsApi = {
  async create(data) {
    const user = authGuard();
    await delay();
    const db = await getDb();
    const busy = db.bookings.some((b) => b.date === data.date && b.time === data.time && b.status !== 'cancelled');
    if (busy) throw new ApiError('Бул убакыт бош эмес, башка убакыт тандаңыз', 409);
    const item = { ...data, id: nextId(db.bookings), userId: user.id, userName: user.name, status: 'confirmed', createdAt: new Date().toISOString() };
    db.bookings.unshift(item);
    await saveDb(db);
    emit('booking', { date: data.date, time: data.time, user: user.name });
    return item;
  },
  async busySlots(date) {
    const db = await getDb();
    return db.bookings.filter((b) => b.date === date && b.status !== 'cancelled').map((b) => b.time);
  },
  async mine() {
    const user = authGuard();
    await delay(300);
    return (await getDb()).bookings.filter((b) => b.userId === user.id);
  },
  async all() {
    authGuard('admin');
    await delay(300);
    return (await getDb()).bookings;
  },
  async cancel(id) {
    authGuard();
    const db = await getDb();
    const b = db.bookings.find((x) => x.id === id);
    if (b) b.status = 'cancelled';
    await saveDb(db);
    return b;
  },
};

// ------------------------------------------------------------------ Колдонуучулар (админ)
export const usersApi = {
  async list() {
    authGuard('admin');
    await delay(300);
    return (await getDb()).users.map(publicUser);
  },
  async setRole(id, role) {
    authGuard('admin');
    const db = await getDb();
    const u = db.users.find((x) => x.id === id);
    if (u) u.role = role;
    await saveDb(db);
  },
  async toggleBlock(id) {
    authGuard('admin');
    const db = await getDb();
    const u = db.users.find((x) => x.id === id);
    if (u) u.blocked = !u.blocked;
    await saveDb(db);
  },
};

// ------------------------------------------------------------------ Статистика
export const statsApi = {
  async dashboard() {
    authGuard('admin');
    await delay();
    const db = await getDb();
    const revenue = db.orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
    const byCity = Object.entries(
      db.universities.reduce((acc, u) => ({ ...acc, [u.city]: (acc[u.city] || 0) + 1 }), {})
    ).map(([name, value]) => ({ name, value }));
    const byField = ['engineering', 'medicine', 'economics', 'law', 'humanities', 'science', 'architecture', 'design'].map((f) => ({
      name: f,
      value: db.universities.filter((u) => u.fields.includes(f)).length,
    }));
    // акыркы 7 күндүн заказдары
    const days = [...Array(7)].map((_, i) => {
      const d = new Date(Date.now() - (6 - i) * 864e5).toISOString().slice(0, 10);
      const list = db.orders.filter((o) => o.createdAt.slice(0, 10) === d);
      return { day: d.slice(5), orders: list.length, revenue: list.reduce((s, o) => s + o.total, 0) };
    });
    const topRated = [...db.universities].sort((a, b) => b.rating - a.rating).slice(0, 6).map((u) => ({ name: u.slug, rating: u.rating }));
    return {
      counts: {
        universities: db.universities.length,
        users: db.users.length,
        orders: db.orders.length,
        bookings: db.bookings.length,
        reviews: db.reviews.length,
        revenue,
      },
      byCity,
      byField,
      days,
      topRated,
    };
  },
};
