import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useItems from "../hooks/useItems";
import ItemForm from "../components/ItemForm";
import ItemTable from "../components/ItemTable";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import itemService from "../services/itemService";

export default function InventoryPage() {
  const { user, logout } = useAuth();

  // The URL is the single source of truth for search/filter/sort/page —
  // this is what makes a refresh, a shared link, or the browser's
  // back/forward buttons all correctly restore the exact same view.
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = searchParams.get("order") || "desc";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Memoized so useItems only re-fetches when one of these actually
  // changes value, not on every InventoryPage re-render.
  const queryParams = useMemo(
    () => ({ search, category, sortBy, order, page, limit: 10 }),
    [search, category, sortBy, order, page]
  );

  const { items, pagination, isLoading, error, isSubmitting, addItem, removeItem } =
    useItems(queryParams);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    itemService.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // Any change that alters *what* is being shown resets back to page 1 —
  // otherwise you could land on "page 5" of a search that only has 1
  // page of results.
  const updateParams = (updates, resetPage = true) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    if (resetPage) next.delete("page");
    setSearchParams(next);
  };

  const handleSearchChange = (value) => updateParams({ search: value });
  const handleCategoryChange = (value) => updateParams({ category: value });
  const handleSortChange = (combined) => {
    const [nextSortBy, nextOrder] = combined.split("-");
    updateParams({ sortBy: nextSortBy, order: nextOrder });
  };
  const handlePageChange = (nextPage) => updateParams({ page: nextPage }, false);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;
    await removeItem(id);
  };

  return (
    <main className="inventory-page">
      <header className="inventory-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Search, filter, sort, and paginate — all reflected in the URL.</p>
        </div>
        <div className="user-bar">
          <span>Signed in as <b>{user?.name}</b></span>
          <button onClick={logout} className="secondary">Log Out</button>
        </div>
      </header>

      <ItemForm onCreate={addItem} isSubmitting={isSubmitting} />

      <section className="list-section">
        <div className="list-header">
          <h2>Current Inventory</h2>
        </div>

        <FilterBar
          search={search}
          onSearchChange={handleSearchChange}
          category={category}
          onCategoryChange={handleCategoryChange}
          categories={categories}
          sortBy={sortBy}
          order={order}
          onSortChange={handleSortChange}
        />

        {error && <p className="banner-error">{error}</p>}

        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <ItemTable items={items} onDelete={handleDelete} />
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalCount={pagination.totalCount}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </main>
  );
}
