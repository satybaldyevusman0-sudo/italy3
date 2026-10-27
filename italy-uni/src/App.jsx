import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AdminRoute, PrivateRoute } from './components/common/PrivateRoute';
import Home from './pages/Home';

// Code splitting: барактар керек болгондо гана жүктөлөт
const named = (loader, name) => lazy(() => loader().then((m) => ({ default: m[name] })));

const Catalog = lazy(() => import('./pages/Catalog'));
const UniDetail = lazy(() => import('./pages/UniDetail'));
const Services = lazy(() => import('./pages/Services'));
const Scholarships = lazy(() => import('./pages/Scholarships'));
const Booking = lazy(() => import('./pages/Booking'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Translator = lazy(() => import('./pages/Translator'));
const About = lazy(() => import('./pages/About'));
const Contacts = lazy(() => import('./pages/Contacts'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = named(() => import('./pages/Auth'), 'Login');
const Register = named(() => import('./pages/Auth'), 'Register');
const NotFound = named(() => import('./pages/Misc'), 'NotFound');
const Forbidden = named(() => import('./pages/Misc'), 'Forbidden');
const GithubCallback = named(() => import('./pages/Misc'), 'GithubCallback');

const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUniversities = lazy(() => import('./pages/admin/AdminUniversities'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = named(() => import('./pages/admin/AdminOther'), 'AdminUsers');
const AdminReviews = named(() => import('./pages/admin/AdminOther'), 'AdminReviews');
const AdminBookings = named(() => import('./pages/admin/AdminOther'), 'AdminBookings');

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="university/:slug" element={<UniDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="scholarships" element={<Scholarships />} />
        <Route path="booking" element={<Booking />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="translator" element={<Translator />} />
        <Route path="about" element={<About />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="oauth/github" element={<GithubCallback />} />
        <Route path="forbidden" element={<Forbidden />} />

        {/* Жеке барактар: JWT токен талап кылынат */}
        <Route element={<PrivateRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="order/:number" element={<OrderSuccess />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Админ панель: role === 'admin' */}
        <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="universities" element={<AdminUniversities />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
