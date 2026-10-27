import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const kg = {
  nav: { home: 'Башкы бет', catalog: 'Университеттер', services: 'Кызматтар', scholarships: 'Стипендиялар', booking: 'Консультация', translator: 'Котормочу', about: 'Биз жөнүндө', contacts: 'Байланыш', favorites: 'Тандалгандар', cart: 'Себет', login: 'Кирүү', register: 'Катталуу', logout: 'Чыгуу', profile: 'Кабинет', admin: 'Админ панель', calculator: 'Калькулятор' },
  hero: { title: 'Италияда окуу — кыялдан чындыкка', subtitle: '17 мамлекеттик жана жеке университет, стипендиялар, виза жана турак жай — баары бир жерде, кыргыз тилинде.', cta: 'Университет тандоо', cta2: 'Акысыз консультация', search: 'Университет же шаар издөө…' },
  common: { more: 'Толугураак', addCart: 'Себетке', inCart: 'Себетте', buy: 'Сатып алуу', save: 'Сактоо', cancel: 'Жокко чыгаруу', delete: 'Өчүрүү', edit: 'Өзгөртүү', add: 'Кошуу', loading: 'Жүктөлүүдө…', empty: 'Эч нерсе табылган жок', back: 'Артка', send: 'Жөнөтүү', all: 'Баары', search: 'Издөө', reset: 'Тазалоо', total: 'Жалпы', price: 'Баасы', perYear: '/жыл', som: 'сом', reviews: 'пикир', founded: 'Негизделген', students: 'Студенттер', city: 'Шаар', type: 'Түрү', state: 'Мамлекеттик', private: 'Жеке', apply: 'Колдонуу', seeAll: 'Баарын көрүү', close: 'Жабуу' },
  filters: { title: 'Чыпкалар', city: 'Шаар', field: 'Багыт', type: 'Түрү', tuition: 'Окуу акысы (макс. €/жыл)', sort: 'Сорттоо', rating: 'Рейтинг боюнча', priceAsc: 'Арзанынан', priceDesc: 'Кымбатынан', oldest: 'Эң байыркы', name: 'Аты боюнча' },
  fields: { engineering: 'Инженерия', medicine: 'Медицина', economics: 'Экономика', law: 'Укук', humanities: 'Гуманитардык', science: 'Табигый илимдер', architecture: 'Архитектура', design: 'Дизайн' },
  detail: { overview: 'Сереп', programs: 'Программалар', requirements: 'Талаптар', reviews: 'Пикирлер', tuition: 'Окуу акысы', living: 'Жашоо чыгымы', deadline: 'Документ кабыл алуу', intake: 'Окуу башталат', service: 'Тапшыруу кызматы', seats: 'Бош орун', writeReview: 'Пикир калтыруу', loginToReview: 'Пикир калтыруу үчүн кириңиз' },
  cart: { title: 'Себет', empty: 'Себет бош', checkout: 'Заказ берүү', clear: 'Тазалоо', subtotal: 'Сумма', discount: 'Арзандатуу', promo: 'Промокод' },
  checkout: { title: 'Заказды тариздөө', contact: 'Байланыш маалымат', payment: 'Төлөм ыкмасы', confirm: 'Төлөө жана ырастоо', success: 'Заказ кабыл алынды!' },
  auth: { email: 'Email', password: 'Сырсөз', name: 'Аты-жөнү', confirm: 'Сырсөздү кайталаңыз', noAccount: 'Аккаунт жокпу?', hasAccount: 'Аккаунт барбы?', orWith: 'же төмөнкү аркылуу' },
  theme: { light: 'Күндүзгү', dark: 'Түнкү' },
  footer: { about: 'Кыргызстандык студенттерге Италиянын университеттерине тапшырууга жардам берген агенттик.', rights: 'Бардык укуктар корголгон' },
};

const ru = {
  nav: { home: 'Главная', catalog: 'Университеты', services: 'Услуги', scholarships: 'Стипендии', booking: 'Консультация', translator: 'Переводчик', about: 'О нас', contacts: 'Контакты', favorites: 'Избранное', cart: 'Корзина', login: 'Войти', register: 'Регистрация', logout: 'Выйти', profile: 'Кабинет', admin: 'Админ панель', calculator: 'Калькулятор' },
  hero: { title: 'Учёба в Италии — мечта, ставшая реальностью', subtitle: '17 государственных и частных университетов, стипендии, виза и жильё — всё в одном месте.', cta: 'Выбрать университет', cta2: 'Бесплатная консультация', search: 'Поиск университета или города…' },
  common: { more: 'Подробнее', addCart: 'В корзину', inCart: 'В корзине', buy: 'Купить', save: 'Сохранить', cancel: 'Отмена', delete: 'Удалить', edit: 'Изменить', add: 'Добавить', loading: 'Загрузка…', empty: 'Ничего не найдено', back: 'Назад', send: 'Отправить', all: 'Все', search: 'Поиск', reset: 'Сбросить', total: 'Итого', price: 'Цена', perYear: '/год', som: 'сом', reviews: 'отзывов', founded: 'Основан', students: 'Студенты', city: 'Город', type: 'Тип', state: 'Государственный', private: 'Частный', apply: 'Применить', seeAll: 'Смотреть все', close: 'Закрыть' },
  filters: { title: 'Фильтры', city: 'Город', field: 'Направление', type: 'Тип', tuition: 'Стоимость обучения (макс. €/год)', sort: 'Сортировка', rating: 'По рейтингу', priceAsc: 'Сначала дешёвые', priceDesc: 'Сначала дорогие', oldest: 'Самые старые', name: 'По названию' },
  fields: { engineering: 'Инженерия', medicine: 'Медицина', economics: 'Экономика', law: 'Право', humanities: 'Гуманитарные', science: 'Естественные науки', architecture: 'Архитектура', design: 'Дизайн' },
  detail: { overview: 'Обзор', programs: 'Программы', requirements: 'Требования', reviews: 'Отзывы', tuition: 'Стоимость обучения', living: 'Расходы на жизнь', deadline: 'Приём документов', intake: 'Начало учёбы', service: 'Услуга поступления', seats: 'Свободных мест', writeReview: 'Оставить отзыв', loginToReview: 'Войдите, чтобы оставить отзыв' },
  cart: { title: 'Корзина', empty: 'Корзина пуста', checkout: 'Оформить заказ', clear: 'Очистить', subtotal: 'Сумма', discount: 'Скидка', promo: 'Промокод' },
  checkout: { title: 'Оформление заказа', contact: 'Контактные данные', payment: 'Способ оплаты', confirm: 'Оплатить и подтвердить', success: 'Заказ принят!' },
  auth: { email: 'Email', password: 'Пароль', name: 'Имя', confirm: 'Повторите пароль', noAccount: 'Нет аккаунта?', hasAccount: 'Есть аккаунт?', orWith: 'или через' },
  theme: { light: 'Светлая', dark: 'Тёмная' },
  footer: { about: 'Агентство, помогающее студентам из Кыргызстана поступить в университеты Италии.', rights: 'Все права защищены' },
};

const en = {
  nav: { home: 'Home', catalog: 'Universities', services: 'Services', scholarships: 'Scholarships', booking: 'Consultation', translator: 'Translator', about: 'About', contacts: 'Contacts', favorites: 'Favorites', cart: 'Cart', login: 'Log in', register: 'Sign up', logout: 'Log out', profile: 'Account', admin: 'Admin panel', calculator: 'Calculator' },
  hero: { title: 'Study in Italy — from dream to reality', subtitle: '17 public and private universities, scholarships, visa and housing — all in one place.', cta: 'Choose a university', cta2: 'Free consultation', search: 'Search a university or city…' },
  common: { more: 'Details', addCart: 'Add to cart', inCart: 'In cart', buy: 'Buy', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', add: 'Add', loading: 'Loading…', empty: 'Nothing found', back: 'Back', send: 'Send', all: 'All', search: 'Search', reset: 'Reset', total: 'Total', price: 'Price', perYear: '/yr', som: 'KGS', reviews: 'reviews', founded: 'Founded', students: 'Students', city: 'City', type: 'Type', state: 'Public', private: 'Private', apply: 'Apply', seeAll: 'See all', close: 'Close' },
  filters: { title: 'Filters', city: 'City', field: 'Field', type: 'Type', tuition: 'Tuition (max €/yr)', sort: 'Sort', rating: 'By rating', priceAsc: 'Cheapest first', priceDesc: 'Most expensive', oldest: 'Oldest', name: 'By name' },
  fields: { engineering: 'Engineering', medicine: 'Medicine', economics: 'Economics', law: 'Law', humanities: 'Humanities', science: 'Sciences', architecture: 'Architecture', design: 'Design' },
  detail: { overview: 'Overview', programs: 'Programs', requirements: 'Requirements', reviews: 'Reviews', tuition: 'Tuition', living: 'Living costs', deadline: 'Application window', intake: 'Intake', service: 'Application service', seats: 'Seats left', writeReview: 'Write a review', loginToReview: 'Log in to write a review' },
  cart: { title: 'Cart', empty: 'Your cart is empty', checkout: 'Checkout', clear: 'Clear', subtotal: 'Subtotal', discount: 'Discount', promo: 'Promo code' },
  checkout: { title: 'Checkout', contact: 'Contact details', payment: 'Payment method', confirm: 'Pay and confirm', success: 'Order placed!' },
  auth: { email: 'Email', password: 'Password', name: 'Full name', confirm: 'Repeat password', noAccount: 'No account?', hasAccount: 'Have an account?', orWith: 'or continue with' },
  theme: { light: 'Light', dark: 'Dark' },
  footer: { about: 'An agency helping students from Kyrgyzstan get into Italian universities.', rights: 'All rights reserved' },
};

i18n.use(initReactI18next).init({
  resources: { kg: { translation: kg }, ru: { translation: ru }, en: { translation: en } },
  lng: localStorage.getItem('si_lang') || 'kg',
  fallbackLng: 'kg',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('si_lang', lng);
  document.documentElement.lang = lng === 'kg' ? 'ky' : lng;
});

export default i18n;
