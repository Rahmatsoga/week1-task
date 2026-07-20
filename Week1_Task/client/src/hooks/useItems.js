import { useCallback, useEffect, useState } from "react";
import itemService from "../services/itemService";

/**
 * Encapsulates all inventory data-fetching and mutation logic in one
 * place so components stay declarative. Keeps `items`, `isLoading`
 * and `error` as clearly separated, predictable pieces of state and
 * ensures the UI is always resynced with the backend after a mutation.
 */
export default function useItems() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await itemService.getAll();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(
    async (payload) => {
      setIsSubmitting(true);
      setError(null);
      try {
        await itemService.create(payload);
        await fetchItems(); // re-fetch so the list is guaranteed in sync
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
        setItems((prev) => prev.filter((item) => item._id !== id));
        return { success: true };
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      }
    },
    []
  );

  return { items, isLoading, error, isSubmitting, addItem, removeItem, refetch: fetchItems };
}
