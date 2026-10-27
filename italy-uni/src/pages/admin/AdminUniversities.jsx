import { useState } from 'react';
import { Link } from 'react-router-dom';
import { universitiesApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { useDebounce, useFetch, useTitle } from '../../hooks';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import UniForm from '../../components/admin/UniForm';
import { SkeletonRows } from '../../components/ui/Skeleton';
import { ImageWithFallback, money } from '../../components/ui/Misc';

/** Админ CRUD: университет кошуу / өзгөртүү / өчүрүү */
export default function AdminUniversities() {
  useTitle('Админ — Университеттер');
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const q = useDebounce(search, 300);
  const { data, loading, reload } = useFetch(() => universitiesApi.list({ search: q, page, limit: 8, sort: 'name' }), [q, page]);
  const [editing, setEditing] = useState(null); // null | 'new' | uni
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const save = async (form) => {
    setBusy(true);
    try {
      if (editing === 'new') {
        await universitiesApi.create(form);
        toast('Университет кошулду');
      } else {
        await universitiesApi.update(editing.id, form);
        toast('Өзгөртүүлөр сакталды');
      }
      setEditing(null);
      reload();
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    await universitiesApi.remove(toDelete.id);
    toast(`${toDelete.name} өчүрүлдү`, 'info');
    setToDelete(null);
    reload();
  };

  return (
    <div>
      <div className="row-between">
        <h1>🎓 Университеттер</h1>
        <button className="btn" onClick={() => setEditing('new')}>+ Кошуу</button>
      </div>
      <div className="searchbox searchbox--inline" style={{ margin: '16px 0' }}>
        <span className="searchbox__icon">🔎</span>
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Аты же шаар боюнча издөө…" />
      </div>
      {loading && !data ? (
        <SkeletonRows rows={8} />
      ) : (
        <>
          <div className="table-wrap">
            <table className="table table--admin">
              <thead>
                <tr><th></th><th>Аталышы</th><th>Шаар</th><th>Түрү</th><th>Баа</th><th>Орун</th><th>★</th><th></th></tr>
              </thead>
              <tbody>
                {data.items.map((u) => (
                  <tr key={u.id}>
                    <td><div className="thumb"><ImageWithFallback src={u.image} alt={u.name} label={u.city} /></div></td>
                    <td><Link to={`/university/${u.slug}`}><b>{u.name}</b></Link><br /><small className="muted">{u.nameIt}</small></td>
                    <td>{u.city}</td>
                    <td><span className={`tag tag--${u.type} tag--static`}>{u.type === 'state' ? 'Мамл.' : 'Жеке'}</span></td>
                    <td>{money(u.price)}</td>
                    <td>{u.stock}</td>
                    <td>{u.rating}</td>
                    <td className="actions">
                      <button className="icon-btn" onClick={() => setEditing(u)} aria-label="Өзгөртүү">✏️</button>
                      <button className="icon-btn" onClick={() => setToDelete(u)} aria-label="Өчүрүү">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing === 'new' ? 'Жаңы университет' : 'Университетти өзгөртүү'} wide>
        {editing && <UniForm initial={editing === 'new' ? {} : editing} onSubmit={save} onCancel={() => setEditing(null)} busy={busy} />}
      </Modal>

      <Modal open={Boolean(toDelete)} onClose={() => setToDelete(null)} title="Өчүрүүнү ырастаңыз">
        <p>«{toDelete?.name}» жана анын бардык пикирлери өчүрүлөт. Улантасызбы?</p>
        <div className="row-gap row-end">
          <button className="btn btn--ghost" onClick={() => setToDelete(null)}>Жок</button>
          <button className="btn btn--danger" onClick={remove}>Ооба, өчүрүү</button>
        </div>
      </Modal>
    </div>
  );
}
