import useItems from "../hooks/useItems";
import ItemForm from "../components/ItemForm";
import ItemTable from "../components/ItemTable";
import Spinner from "../components/Spinner";

export default function InventoryPage() {
  const { items, isLoading, error, isSubmitting, addItem, removeItem, refetch } = useItems();

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;
    await removeItem(id);
  };

  return (
    <main className="inventory-page">
      <header>
        <h1>Inventory Management</h1>
        <p>Create a record from the form below and watch it persist after a refresh.</p>
      </header>

      <ItemForm onCreate={addItem} isSubmitting={isSubmitting} />

      <section className="list-section">
        <div className="list-header">
          <h2>Current Inventory</h2>
          <button onClick={refetch} disabled={isLoading}>
            Refresh
          </button>
        </div>

        {error && <p className="banner-error">{error}</p>}
        {isLoading ? <Spinner /> : <ItemTable items={items} onDelete={handleDelete} />}
      </section>
    </main>
  );
}
