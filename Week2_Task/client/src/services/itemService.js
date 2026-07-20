import apiClient, { unwrapError } from "./apiClient";

export const itemService = {
  async getAll() {
    try {
      const { data } = await apiClient.get("/items");
      return data.data; // array of items
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
