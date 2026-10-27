export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const nums = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }
  return (
    <nav className="pagination" aria-label="Барактар">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>‹</button>
      {nums.map((n, i) =>
        n === '…' ? (
          <span key={`d${i}`} className="pagination__dots">…</span>
        ) : (
          <button key={n} className={n === page ? 'active' : ''} onClick={() => onChange(n)} aria-current={n === page ? 'page' : undefined}>
            {n}
          </button>
        )
      )}
      <button disabled={page >= pages} onClick={() => onChange(page + 1)}>›</button>
    </nav>
  );
}
