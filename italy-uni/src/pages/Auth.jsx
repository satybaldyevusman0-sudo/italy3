import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTitle } from '../hooks';
import OAuthButtons from '../components/common/OAuthButtons';

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth">
      <div className="auth__art">
        <span className="kicker">StudyItalia.kg</span>
        <h2>Италиядагы окууңуз ушул жерден башталат</h2>
        <ul className="checklist">
          <li>Тандалгандарды бардык түзмөктө сактаңыз</li>
          <li>Заказдардын абалын көзөмөлдөңүз</li>
          <li>Консультацияга бир чыкылдатуу менен жазылыңыз</li>
        </ul>
      </div>
      <div className="auth__form card">
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="pw">
      <input type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} autoComplete="current-password" />
      <button type="button" className="icon-btn" onClick={() => setShow(!show)} aria-label="Көрсөтүү">{show ? '🙈' : '👁'}</button>
    </div>
  );
}

export function Login() {
  const { t } = useTranslation();
  useTitle(t('nav.login'));
  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const from = useLocation().state?.from || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const u = await login(email, password);
      toast(`Кош келиңиз, ${u.name}!`);
      nav(u.role === 'admin' && from === '/' ? '/admin' : from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title={t('nav.login')} subtitle="Аккаунтуңузга кириңиз">
      <form onSubmit={submit}>
        <label className="field"><span>{t('auth.email')}</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
        <label className="field"><span>{t('auth.password')}</span><PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p className="err">{error}</p>}
        <button className="btn btn--block btn--lg" disabled={busy}>{busy ? '…' : t('nav.login')}</button>
      </form>
      <div className="demo-creds">
        <b>Демо аккаунттар:</b>
        <button onClick={() => { setEmail('admin@studyitalia.kg'); setPassword('admin123'); }}>👑 admin@studyitalia.kg / admin123</button>
        <button onClick={() => { setEmail('user@studyitalia.kg'); setPassword('user123'); }}>👤 user@studyitalia.kg / user123</button>
      </div>
      <div className="divider"><span>{t('auth.orWith')}</span></div>
      <OAuthButtons redirect={from} />
      <p className="center">{t('auth.noAccount')} <Link to="/register">{t('nav.register')}</Link></p>
    </AuthShell>
  );
}

export function Register() {
  const { t } = useTranslation();
  useTitle(t('nav.register'));
  const { register } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '', agree: false });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const strength = [/.{8,}/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(f.password)).length;

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (f.name.trim().length < 2) err.name = 'Атыңызды жазыңыз';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) err.email = 'Email туура эмес';
    if (f.password.length < 6) err.password = 'Сырсөз кеминде 6 белги';
    if (f.password !== f.confirm) err.confirm = 'Сырсөздөр дал келбейт';
    if (!f.agree) err.agree = 'Шарттарга макул болуңуз';
    setErrors(err);
    if (Object.keys(err).length) return;
    setBusy(true);
    try {
      await register({ name: f.name, email: f.email, password: f.password });
      toast('Каттоо ийгиликтүү өттү!');
      nav('/profile');
    } catch (er) {
      setErrors({ email: er.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title={t('nav.register')} subtitle="Жаңы аккаунт түзүңүз — 30 секунд">
      <form onSubmit={submit}>
        <label className="field"><span>{t('auth.name')}</span><input value={f.name} onChange={set('name')} />{errors.name && <em className="err">{errors.name}</em>}</label>
        <label className="field"><span>{t('auth.email')}</span><input type="email" value={f.email} onChange={set('email')} />{errors.email && <em className="err">{errors.email}</em>}</label>
        <label className="field"><span>{t('auth.password')}</span><PasswordInput value={f.password} onChange={set('password')} />
          <div className={`strength strength--${strength}`}><i /><i /><i /><i /></div>
          {errors.password && <em className="err">{errors.password}</em>}
        </label>
        <label className="field"><span>{t('auth.confirm')}</span><PasswordInput value={f.confirm} onChange={set('confirm')} />{errors.confirm && <em className="err">{errors.confirm}</em>}</label>
        <label className="check"><input type="checkbox" checked={f.agree} onChange={set('agree')} /> Колдонуу шарттарына макулмун</label>
        {errors.agree && <em className="err">{errors.agree}</em>}
        <button className="btn btn--block btn--lg" disabled={busy}>{busy ? '…' : t('nav.register')}</button>
      </form>
      <div className="divider"><span>{t('auth.orWith')}</span></div>
      <OAuthButtons redirect="/profile" />
      <p className="center">{t('auth.hasAccount')} <Link to="/login">{t('nav.login')}</Link></p>
    </AuthShell>
  );
}
