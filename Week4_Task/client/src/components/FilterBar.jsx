import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest first" },
  { value: "createdAt-asc", label: "Oldest first" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (low to high)" },
  { value: "price-desc", label: "Price (high to low)" },
];

export default function FilterBar({
  search, onSearchChange, category, onCategoryChange, categories, sortBy, order, onSortChange,
}) {
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    onSearchChange(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

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
      <select value={category} onChange={(e) => onCategoryChange(e.target.value)} aria-label="Filter by category">
        <option value="all">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <select value={`${sortBy}-${order}`} onChange={(e) => onSortChange(e.target.value)} aria-label="Sort items">
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
