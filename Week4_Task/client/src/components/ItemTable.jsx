import { resolveImageUrl } from "../services/apiClient";

export default function ItemTable({ items, onDelete }) {
  if (items.length === 0) {
    return <p className="empty-state">No items match your current search/filters.</p>;
  }

  return (
    <table className="item-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>SKU</th>
          <th>Category</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Supplier</th>
          <th>Variants</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const imgSrc = resolveImageUrl(item.imageUrl);
          return (
            <tr key={item._id}>
              <td>
                {imgSrc ? (
                  <img src={imgSrc} alt={item.name} className="item-thumb" />
                ) : (
                  <div className="item-thumb item-thumb-empty" aria-label="No image">?</div>
                )}
              </td>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>${Number(item.price).toFixed(2)}</td>
              <td>
                {item.supplier ? (
                  <span title={item.supplier.contactEmail}>{item.supplier.name}</span>
                ) : (
                  <span className="variant-none">&mdash;</span>
                )}
              </td>
              <td>
                {item.variants?.length > 0 ? (
                  <span className="variant-badge">{item.variants.length} variant{item.variants.length !== 1 ? "s" : ""}</span>
                ) : (
                  <span className="variant-none">&mdash;</span>
                )}
              </td>
              <td>
                <button className="danger" onClick={() => onDelete(item._id)}>Delete</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
