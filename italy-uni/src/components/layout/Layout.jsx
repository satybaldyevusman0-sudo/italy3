import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatBot from '../common/ChatBot';
import ErrorBoundary from '../ui/ErrorBoundary';
import { Spinner } from '../ui/Misc';

export default function Layout() {
  const { pathname } = useLocation();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => window.scrollTo({ top: 0 }), [pathname]);
  useEffect(() => {
    const f = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', f);
    return () => window.removeEventListener('scroll', f);
  }, []);

  return (
    <>
      <Header />
      <main className="main">
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<div className="page-loader"><Spinner /></div>}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <ChatBot />
      {showTop && (
        <button className="to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Жогору">↑</button>
      )}
    </>
  );
}
