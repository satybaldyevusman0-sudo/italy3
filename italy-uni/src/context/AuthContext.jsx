import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api';
import { verifyToken } from '../utils/jwt';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('si_token');
    return verifyToken(t) ? t : null;
  });
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('si_token');
      setUser(null);
      setReady(true);
      return;
    }
    localStorage.setItem('si_token', token);
    authApi
      .me()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, [token]);

  // Токендин мөөнөтүн мезгил-мезгили менен текшерүү
  useEffect(() => {
    const id = setInterval(() => {
      if (token && !verifyToken(token)) setToken(null);
    }, 60000);
    return () => clearInterval(id);
  }, [token]);

  const handle = ({ token: t, user: u }) => {
    localStorage.setItem('si_token', t);
    setUser(u);
    setToken(t);
    return u;
  };

  const value = {
    user,
    token,
    ready,
    isAuth: Boolean(user),
    isAdmin: user?.role === 'admin',
    login: async (email, password) => handle(await authApi.login(email, password)),
    register: async (data) => handle(await authApi.register(data)),
    oauth: async (provider, profile) => handle(await authApi.oauth(provider, profile)),
    logout: () => setToken(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
