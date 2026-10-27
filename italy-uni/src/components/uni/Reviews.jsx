import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { reviewsApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useFetch } from '../../hooks';
import Stars from '../ui/Stars';
import { SkeletonRows } from '../ui/Skeleton';

/** Рейтингдин бөлүштүрүлүшү */
function RatingSummary({ list }) {
  const avg = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;
  return (
    <div className="rating-summary">
      <div className="rating-summary__big">
        <b>{avg.toFixed(1)}</b>
        <Stars value={avg} />
        <small>{list.length} пикир</small>
      </div>
      <div className="rating-summary__bars">
        {[5, 4, 3, 2, 1].map((n) => {
          const c = list.filter((r) => r.rating === n).length;
          return (
            <div key={n} className="bar-row">
              <span>{n}★</span>
              <div className="bar"><i style={{ width: `${list.length ? (c / list.length) * 100 : 0}%` }} /></div>
              <small>{c}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewForm({ uniId, onDone }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (text.trim().length < 10) return toast('Пикир кеминде 10 белгиден турушу керек', 'error');
    setBusy(true);
    try {
      await reviewsApi.create({ uniId, rating, text });
      setText('');
      toast('Пикириңиз үчүн рахмат!');
      onDone();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="review-form card" onSubmit={submit}>
      <h4>{t('detail.writeReview')}</h4>
      <Stars value={rating} onChange={setRating} size={26} />
      <textarea rows="3" value={text} onChange={(e) => setText(e.target.value)} placeholder="Тажрыйбаңыз менен бөлүшүңүз…" />
      <button className="btn" disabled={busy}>{busy ? '…' : t('common.send')}</button>
    </form>
  );
}

export default function Reviews({ uniId, onChange }) {
  const { t } = useTranslation();
  const { isAuth } = useAuth();
  const { data, loading, reload } = useFetch(() => reviewsApi.list(uniId), [uniId]);
  const [sort, setSort] = useState('new');

  if (loading) return <SkeletonRows rows={3} />;
  const list = [...(data || [])].sort((a, b) => (sort === 'new' ? b.id - a.id : sort === 'high' ? b.rating - a.rating : a.rating - b.rating));

  return (
    <div className="reviews">
      <RatingSummary list={list} />
      {isAuth ? (
        <ReviewForm uniId={uniId} onDone={() => { reload(); onChange?.(); }} />
      ) : (
        <p className="card muted">🔒 <Link to="/login">{t('detail.loginToReview')}</Link></p>
      )}
      <div className="reviews__head">
        <h4>{list.length} пикир</h4>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Жаңылары</option>
          <option value="high">Жогорку баа</option>
          <option value="low">Төмөнкү баа</option>
        </select>
      </div>
      {list.map((r) => (
        <div key={r.id} className="review">
          <span className="avatar">{r.user[0]}</span>
          <div>
            <div className="review__top"><b>{r.user}</b><Stars value={r.rating} size={13} /><small>{r.date}</small></div>
            <p>{r.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
