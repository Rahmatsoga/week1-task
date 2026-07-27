import apiClient, { unwrapError } from "./apiClient";

export const itemService = {
  /**
   * Fetches a page of items. `params` maps directly onto the backend's
   * query parameters: { search, category, sortBy, order, page, limit }.
   * Returns { items, pagination } rather than just the array, so the
   * caller has access to totalPages/totalCount for rendering controls.
   */
  async getAll(params = {}) {
    try {
      const { data } = await apiClient.get("/items", { params });
      return { items: data.data, pagination: data.pagination };
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async getCategories() {
    try {
      const { data } = await apiClient.get("/items/categories");
      return data.data; // array of distinct category strings
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async getById(id) {
    try {
      const { data } = await apiClient.get(`/items/${id}`);
      return data.data;
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async create(payload) {
    try {
      const { data } = await apiClient.post("/items", payload);
      return data.data;
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async update(id, payload) {
    try {
      const { data } = await apiClient.put(`/items/${id}`, payload);
      return data.data;
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async remove(id) {
    try {
      const { data } = await apiClient.delete(`/items/${id}`);
      return data.data;
    } catch (error) {
      throw unwrapError(error);
    }
  },
};

export default itemService;
