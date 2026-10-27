import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../ui/Modal';

const GOOGLE_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GITHUB_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

function parseJwt(t) {
  return JSON.parse(decodeURIComponent(escape(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))));
}

/**
 * Google / GitHub OAuth.
 *  - VITE_GOOGLE_CLIENT_ID берилсе: чыныгы Google Identity Services колдонулат.
 *  - VITE_GITHUB_CLIENT_ID берилсе: GitHub авторизация барагына багыттайт.
 *  - Ачкычтар жок болсо: демо терезе (аккаунт тандоо) ачылат.
 */
export default function OAuthButtons({ redirect = '/' }) {
  const { oauth } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [demo, setDemo] = useState(null);
  const googleDiv = useRef(null);

  const finish = async (provider, profile) => {
    await oauth(provider, profile);
    toast(`${provider === 'google' ? 'Google' : 'GitHub'} аркылуу кирдиңиз`);
    nav(redirect);
  };

  // Чыныгы Google кнопкасы
  useEffect(() => {
    if (!GOOGLE_ID) return;
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_ID,
        callback: ({ credential }) => {
          const p = parseJwt(credential);
          finish('google', { name: p.name, email: p.email, avatar: p.picture });
        },
      });
      window.google.accounts.id.renderButton(googleDiv.current, { theme: 'outline', size: 'large', width: 300 });
    };
    document.body.appendChild(s);
    return () => s.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const github = () => {
    if (GITHUB_ID) {
      const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_ID}&scope=read:user%20user:email&redirect_uri=${encodeURIComponent(window.location.origin + '/oauth/github')}`;
      window.location.href = url;
    } else setDemo('github');
  };

  const DEMO_ACCOUNTS = {
    google: [
      { name: 'Айпери Асанова', email: 'aiperi.asanova@gmail.com' },
      { name: 'Нурсултан Токтогулов', email: 'nursultan.t@gmail.com' },
    ],
    github: [
      { name: 'usman-dev', email: 'usman-dev@users.noreply.github.com' },
      { name: 'kg-coder', email: 'kg-coder@users.noreply.github.com' },
    ],
  };

  return (
    <div className="oauth">
      {GOOGLE_ID ? (
        <div ref={googleDiv} />
      ) : (
        <button type="button" className="oauth__btn" onClick={() => setDemo('google')}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg>
          Google
        </button>
      )}
      <button type="button" className="oauth__btn oauth__btn--dark" onClick={github}>
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
        GitHub
      </button>

      <Modal open={Boolean(demo)} onClose={() => setDemo(null)} title={`${demo === 'google' ? 'Google' : 'GitHub'} аккаунтун тандаңыз (демо)`}>
        <p className="muted">Демо режим: .env файлына OAuth Client ID жазылса, чыныгы {demo === 'google' ? 'Google' : 'GitHub'} терезеси ачылат.</p>
        <div className="account-list">
          {demo &&
            DEMO_ACCOUNTS[demo].map((a) => (
              <button key={a.email} onClick={() => { setDemo(null); finish(demo, a); }}>
                <span className="avatar">{a.name[0]}</span>
                <span><b>{a.name}</b><small>{a.email}</small></span>
              </button>
            ))}
        </div>
      </Modal>
    </div>
  );
}
