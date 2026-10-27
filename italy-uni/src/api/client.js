// =====================================================================
//  API клиент. Эгер VITE_API_URL берилсе — чыныгы REST серверге кайрылат.
//  Болбосо: башталгыч маалыматтар /api/*.json файлдарынан fetch аркылуу
//  алынат жана localStorage'да сакталган "мок-сервер" аркылуу иштейт.
// =====================================================================
import { verifyToken } from '../utils/jwt';

const REMOTE = import.meta.env.VITE_API_URL;
const DB_KEY = 'si_db_v1';
const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms));

let dbPromise = null;

async function loadDb() {
  const saved = localStorage.getItem(DB_KEY);
  if (saved) return JSON.parse(saved);
  const [universities, reviews, services] = await Promise.all([
    fetch('/api/universities.json').then((r) => r.json()),
    fetch('/api/reviews.json').then((r) => r.json()),
    fetch('/api/services.json').then((r) => r.json()),
  ]);
  const db = {
    universities,
    reviews,
    services,
    orders: [],
    bookings: [],
    notifications: [],
    users: [
      { id: 1, name: 'Админ', email: 'admin@studyitalia.kg', password: 'admin123', role: 'admin', provider: 'email', createdAt: '2026-01-01' },
      { id: 2, name: 'Студент', email: 'user@studyitalia.kg', password: 'user123', role: 'user', provider: 'email', createdAt: '2026-02-01' },
    ],
  };
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
}

export function getDb() {
  if (!dbPromise) dbPromise = loadDb();
  return dbPromise;
}

export async function saveDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function resetDb() {
  localStorage.removeItem(DB_KEY);
  dbPromise = null;
}

export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

/** Токенди текшерүү (сервердеги middleware'дин ролу) */
export function authGuard(role) {
  const token = localStorage.getItem('si_token');
  const payload = token && verifyToken(token);
  if (!payload) throw new ApiError('Авторизация талап кылынат', 401);
  if (role && payload.role !== role) throw new ApiError('Укук жетишсиз', 403);
  return payload;
}

/** Чыныгы REST API'ге суроо (VITE_API_URL болсо) */
export async function http(method, path, body) {
  const token = localStorage.getItem('si_token');
  const res = await fetch(`${REMOTE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new ApiError(`Сервер катасы: ${res.status}`, res.status);
  return res.json();
}

export const isRemote = Boolean(REMOTE);
export { delay };
