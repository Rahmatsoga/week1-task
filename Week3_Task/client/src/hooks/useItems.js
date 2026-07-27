import { useCallback, useEffect, useState } from "react";
import itemService from "../services/itemService";

/**
 * Fetches a page of items for the given query params (search, category,
 * sortBy, order, page, limit) and re-fetches automatically whenever
 * those params change. This hook doesn't own the params themselves —
 * the caller (InventoryPage) owns them via the URL, so this hook stays
 * a pure "given these params, here's the data" concern.
 */
export default function useItems(params) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stringify so the effect only re-runs when the actual param values
  // change, not on every render (params is a new object each render).
  const paramsKey = JSON.stringify(params);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { items: data, pagination: pageInfo } = await itemService.getAll(params);
      setItems(data);
      setPagination(pageInfo);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(
    async (payload) => {
      setIsSubmitting(true);
      setError(null);
      try {
        await itemService.create(payload);
        await fetchItems(); // re-fetch current page so the list stays in sync
        return { success: true };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchItems]
  );

  const removeItem = useCallback(
    async (id) => {
      setError(null);
      try {
        await itemService.remove(id);
        await fetchItems(); // re-fetch rather than local filter, since removing
        // an item can shift which items belong on the current page
        return { success: true };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      }
    },
    [fetchItems]
  );

  return {
    items,
    pagination,
    isLoading,
    error,
    isSubmitting,
    addItem,
    removeItem,
    refetch: fetchItems,
  };
}
