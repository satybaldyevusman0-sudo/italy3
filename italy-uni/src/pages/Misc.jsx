import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { EmptyState, Spinner } from '../components/ui/Misc';

export function NotFound() {
  return (
    <div className="container page">
      <EmptyState icon="🧭" title="404 — Барак табылган жок" text="Мындай барак жок же өчүрүлгөн." action={<Link className="btn" to="/">Башкы бетке</Link>} />
    </div>
  );
}

export function Forbidden() {
  return (
    <div className="container page">
      <EmptyState icon="⛔" title="403 — Кирүүгө уруксат жок" text="Бул бөлүм администраторлор үчүн гана." action={<Link className="btn" to="/">Башкы бетке</Link>} />
    </div>
  );
}

/**
 * GitHub OAuth кайтуу барагы. GitHub ?code=... менен кайтарат.
 * Код → токен алмашуусу коопсуздук үчүн серверде (мисалы Vercel serverless) болушу керек.
 * Бул жерде демо: code алынса, колдонуучу GitHub профили менен катталат.
 */
export function GithubCallback() {
  const [params] = useSearchParams();
  const { oauth } = useAuth();
  const toast = useToast();
  const nav = useNavigate();

  useEffect(() => {
    const code = params.get('code');
    if (!code) {
      nav('/login');
      return;
    }
    oauth('github', { name: 'GitHub user', email: `gh_${code.slice(0, 8)}@users.noreply.github.com` }).then(() => {
      toast('GitHub аркылуу кирдиңиз');
      nav('/profile');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="page-loader"><Spinner /></div>;
}
