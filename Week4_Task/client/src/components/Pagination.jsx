export default function Pagination({ page, totalPages, totalCount, onPageChange }) {
  if (totalCount === 0) return null;

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="pagination">
      <span className="pagination-info">
        Page {page} of {totalPages} &middot; {totalCount} item{totalCount !== 1 ? "s" : ""} total
      </span>
      <div className="pagination-controls">
        <button onClick={() => onPageChange(page - 1)} disabled={!canGoPrev} className="secondary">&larr; Previous</button>
        <button onClick={() => onPageChange(page + 1)} disabled={!canGoNext} className="secondary">Next &rarr;</button>
      </div>
    </div>
  );
}
