import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest first" },
  { value: "createdAt-asc", label: "Oldest first" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (low to high)" },
  { value: "price-desc", label: "Price (high to low)" },
  { value: "quantity-asc", label: "Quantity (low to high)" },
  { value: "quantity-desc", label: "Quantity (high to low)" },
];

/**
 * Controlled filter bar: search input (debounced before it reaches the
 * parent), category dropdown, and a combined sort dropdown. This
 * component holds only the *immediate* search text locally — every
 * other piece of state (the debounced search, category, sort) is owned
 * by the parent via the URL, keeping this a "dumb" input component.
 */
export default function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  sortBy,
  order,
  onSortChange,
}) {
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Once the debounced value settles, push it up to the parent (which
  // writes it into the URL). This is the only place the "wait for a
  // pause in typing" behavior lives.
  useEffect(() => {
    onSearchChange(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep the local input in sync if the URL's search value changes
  // from elsewhere (e.g. browser back/forward navigation).
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  return (
    <div className="filter-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search by name..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        aria-label="Search inventory by name"
      />

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="Filter by category"
      >
        <option value="all">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        value={`${sortBy}-${order}`}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort items"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
