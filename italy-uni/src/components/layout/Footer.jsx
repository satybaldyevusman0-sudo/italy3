import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';
import { sendTelegram } from '../../api/integrations';

export default function Footer() {
  const { t } = useTranslation();
  const toast = useToast();
  const [email, setEmail] = useState('');

  const subscribe = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast('Email туура эмес', 'error');
    await sendTelegram(`📬 Жаңылыктарга жазылуу: ${email}`);
    toast('Жазылдыңыз! Жаңылыктарды почтаңызга жөнөтөбүз');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Link to="/" className="logo logo--light"><span className="logo__flag"><i /><i /><i /></span>Study<b>Italia</b><small>.kg</small></Link>
          <p>{t('footer.about')}</p>
          <div className="socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">📸</a>
            <a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram">✈️</a>
            <a href="https://wa.me/996700123456" target="_blank" rel="noreferrer" aria-label="WhatsApp">💬</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">▶️</a>
          </div>
        </div>
        <div>
          <h4>Университеттер</h4>
          <Link to="/catalog?city=Милан">Милан</Link>
          <Link to="/catalog?city=Рим">Рим</Link>
          <Link to="/catalog?city=Болонья">Болонья</Link>
          <Link to="/catalog?field=medicine">Медицина</Link>
          <Link to="/catalog?field=engineering">Инженерия</Link>
        </div>
        <div>
          <h4>Кызматтар</h4>
          <Link to="/services">Документ даярдоо</Link>
          <Link to="/scholarships">Стипендиялар</Link>
          <Link to="/booking">Консультация</Link>
          <Link to="/calculator">Чыгым калькулятору</Link>
          <Link to="/translator">Котормочу</Link>
        </div>
        <div>
          <h4>Жаңылыктарга жазылуу</h4>
          <p className="muted-light">Дедлайндар жана стипендиялар тууралуу биринчилерден болуп билиңиз.</p>
          <form className="subscribe" onSubmit={subscribe}>
            <input type="email" placeholder="email@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn">→</button>
          </form>
          <p className="muted-light">📍 Бишкек, Чүй пр. 123, 4-кабат</p>
        </div>
      </div>
      <div className="footer__bottom container">
        © {new Date().getFullYear()} StudyItalia.kg — {t('footer.rights')}
      </div>
    </footer>
  );
}
