import { useState } from 'react';
import { uploadImage } from '../../api/integrations';
import { useToast } from '../../context/ToastContext';

/** Cloudinary'ге сүрөт жүктөө (drag & drop + progress) */
export default function ImageUpload({ value, onChange }) {
  const toast = useToast();
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  const handle = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast('Сүрөт файлын гана тандаңыз', 'error');
    if (file.size > 5 * 1024 * 1024) return toast('Файл 5 МБдан ашпашы керек', 'error');
    setBusy(true);
    setProgress(0);
    try {
      const res = await uploadImage(file, setProgress);
      onChange(res.url);
      toast(res.demo ? 'Сүрөт жүктөлдү (демо — Cloudinary ачкычы жок)' : 'Сүрөт Cloudinary\'ге жүктөлдү');
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`upload ${drag ? 'upload--drag' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
    >
      {value ? <img src={value} alt="preview" /> : <div className="upload__ph">🖼️</div>}
      <div className="upload__info">
        <label className="btn btn--ghost btn--sm">
          📤 Сүрөт тандоо
          <input type="file" accept="image/*" hidden onChange={(e) => handle(e.target.files[0])} />
        </label>
        <small className="muted">же файлды бул жерге сүйрөп таштаңыз</small>
        {busy && (
          <div className="progress"><span style={{ width: `${progress}%` }} /></div>
        )}
      </div>
    </div>
  );
}
