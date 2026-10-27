# 🇮🇹 StudyItalia.kg — Италиядагы университеттер

React (Vite) менен жасалган чоң сайт: Италиянын 17 университети, кызматтар, стипендиялар, консультацияга брондоо, себет, төлөм, админ панель. Бардык тексттер кыргызча, интерфейс 3 тилде (KG / RU / EN).

## 🚀 Ишке киргизүү (VS Code)

```bash
npm install
npm run dev        # http://localhost:5173
```

**Демо аккаунттар:**
| Роль | Email | Сырсөз |
|---|---|---|
| 👑 Админ | admin@studyitalia.kg | admin123 |
| 👤 Колдонуучу | user@studyitalia.kg | user123 |

Промокоддор: `ITALIA10` (−10%), `STUDENT15` (−15%). Stripe тест картасы: `4242 4242 4242 4242`.

## ☁️ Vercel'ге жүктөө

1. Долбоорду GitHub'ка жүктөңүз.
2. vercel.com → **Add New → Project** → репозиторийди тандаңыз.
3. Framework: **Vite** (өзү аныктайт). Build: `npm run build`, Output: `dist`.
4. (Милдеттүү эмес) **Settings → Environment Variables** бөлүмүнө `.env.example` ичиндеги ачкычтарды кошуңуз.
5. **Deploy** басыңыз. `vercel.json` React Router барактарын туура ачат.

## ✅ Талаптар жана алар кайда

| Талап | Кайда |
|---|---|
| 30–40+ компонент | `src/components/**` (45+ компонент) + 25 барак |
| API аркылуу маалымат | `src/api/` — `fetch('/api/universities.json')` + REST стилиндеги мок-сервер; `VITE_API_URL` берсеңиз чыныгы серверге (mockapi.io) кайрылат |
| Корзина | `context/ShopContext.jsx`, `pages/Cart.jsx` |
| Бронь | `pages/Booking.jsx` (бош эмес убакыттар текшерилет) |
| Регистрация / логин | `pages/Auth.jsx` |
| Заказ / купить / оформить | `pages/Checkout.jsx` (2 кадам + төлөм) |
| Админ панель | `/admin` — дашборд, университеттер, заказдар, брондоо, колдонуучулар, пикирлер |
| Толук сүрөттөмө | `pages/UniDetail.jsx` (өтмөктөр, программалар, талаптар) |
| Аты боюнча издөө | Шапкадагы `SearchBox` (сунуштар менен) + каталог |
| Фильтрация | `components/uni/Filters.jsx` — шаар, багыт, түрү, баа + сорттоо |
| Кошуу / өчүрүү | Админ CRUD + себеттен кошуу/өчүрүү |
| Котормочу kg-ru-en | `pages/Translator.jsx` (MyMemory API) |
| Адаптивдүү дизайн | `index.css` — 1100 / 900 / 640 px |
| Бургер меню | `components/layout/MobileMenu.jsx` |
| Күн / түн темасы | `context/ThemeContext.jsx` |
| Избранное | `pages/Favorites.jsx`, `FavoriteButton` |
| Пикир / рейтинг | `components/uni/Reviews.jsx` (жылдыздар, бөлүштүрүү) |
| JWT + Private Routes | `utils/jwt.js`, `components/common/PrivateRoute.jsx` |
| Пагинация | `components/ui/Pagination.jsx` |
| Google / GitHub OAuth | `components/common/OAuthButtons.jsx` (ачкыч жок болсо демо) |
| Admin CRUD | `pages/admin/AdminUniversities.jsx` + `UniForm` |
| Skeleton UI | `components/ui/Skeleton.jsx` |
| Error boundary | `components/ui/ErrorBoundary.jsx` |
| Recharts статистика | `pages/admin/Dashboard.jsx`, `pages/Calculator.jsx` |
| Ролдор admin/user | `AdminRoute`, `api` ичиндеги `authGuard('admin')` |
| Stripe / Post.kg төлөм | `components/cart/PaymentForm.jsx` (Luhn текшерүү) |
| i18n | `src/i18n/index.js` (i18next) |
| Cloudinary жүктөө | `components/common/ImageUpload.jsx` |
| ⭐ Telegram бот | `api/integrations.js → sendTelegram` (заказ, брондоо, байланыш) |
| ⭐ Почтага заказ | `sendEmail` (EmailJS) |
| ⭐ API интеграция | MyMemory котормо, евро курсу (open.er-api.com), OpenStreetMap |
| ⭐ ChatBot | `components/common/ChatBot.jsx` (каталогдон издейт) |
| ⭐ Realtime | `utils/realtime.js` — заказ/пикир башка вкладкада дароо көрүнөт (🔔) |

### Realtime'ды текшерүү
Сайтты эки вкладкада ачыңыз: бирөөндө админ катары `/admin/orders`, экинчисинде заказ бериңиз — заказ дароо биринчи вкладкада пайда болот.

## 🔑 Ачкычтар (`.env`)
`.env.example` файлын `.env` деп көчүрүңүз. Ачкычтар жок болсо бардык функциялар демо режимде иштейт.

- **Telegram:** @BotFather → `/newbot` → токен; ботко жазып, `https://api.telegram.org/bot<TOKEN>/getUpdates` аркылуу `chat_id` алыңыз.
- **Cloudinary:** Settings → Upload → *Add upload preset* (Unsigned).
- **EmailJS:** service, template, public key.
- **Google OAuth:** console.cloud.google.com → Credentials → OAuth Client ID (Authorized origins: сайтыңыздын дареги).

## 📁 Структура
```
src/
  api/          client.js, index.js (REST), integrations.js
  context/      Auth, Theme, Toast, Shop (cart + favorites)
  components/   layout, ui, uni, home, cart, admin, common
  pages/        25 барак + admin/
  i18n/         kg / ru / en
public/api/     universities.json, reviews.json, services.json
```
