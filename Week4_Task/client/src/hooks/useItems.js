import { useCallback, useEffect, useState } from "react";
import itemService from "../services/itemService";

export default function useItems(params) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0, limit: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    async (payload, imageFile) => {
      setIsSubmitting(true);
      setError(null);
      try {
        await itemService.create(payload, imageFile);
        await fetchItems();
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
        await fetchItems();
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
