import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../ui/Misc';

/** Кирген колдонуучулар гана көрө алат (JWT текшерилет) */
export function PrivateRoute({ children }) {
  const { isAuth, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return <div className="page-loader"><Spinner /></div>;
  if (!isAuth) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return children || <Outlet />;
}

/** Ролго жараша кирүү: admin гана */
export function AdminRoute({ children }) {
  const { isAuth, isAdmin, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return <div className="page-loader"><Spinner /></div>;
  if (!isAuth) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if (!isAdmin) return <Navigate to="/forbidden" replace />;
  return children || <Outlet />;
}
