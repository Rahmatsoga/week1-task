/**
 * Presentational table for inventory items. Purely driven by props
 * so it stays easy to test and reuse.
 */
export default function ItemTable({ items, onDelete }) {
  if (items.length === 0) {
    return <p className="empty-state">No items match your current search/filters.</p>;
  }

  return (
    <table className="item-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>SKU</th>
          <th>Category</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Variants</th>
          <th>Created</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id}>
            <td>{item.name}</td>
            <td>{item.sku}</td>
            <td>{item.category}</td>
            <td>{item.quantity}</td>
            <td>${Number(item.price).toFixed(2)}</td>
            <td>
              {item.variants?.length > 0 ? (
                <span className="variant-badge">{item.variants.length} variant{item.variants.length !== 1 ? "s" : ""}</span>
              ) : (
                <span className="variant-none">&mdash;</span>
              )}
            </td>
            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
            <td>
              <button className="danger" onClick={() => onDelete(item._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
