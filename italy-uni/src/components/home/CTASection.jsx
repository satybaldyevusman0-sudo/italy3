import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-band">
          <div>
            <h2>Италияда окууну бүгүн баштаңыз</h2>
            <p>30 мүнөттүк акысыз консультацияга жазылыңыз — сизге ылайыктуу университеттерди жана стипендияларды табабыз.</p>
          </div>
          <div className="cta-band__btns">
            <Link to="/booking" className="btn btn--lg btn--light">📅 Консультацияга жазылуу</Link>
            <a href="https://wa.me/996700123456" target="_blank" rel="noreferrer" className="btn btn--lg btn--outline-light">💬 WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}
