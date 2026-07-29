import apiClient, { unwrapError } from "./apiClient";

export const supplierService = {
  async getAll() {
    try {
      const { data } = await apiClient.get("/suppliers");
      return data.data;
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async create(payload) {
    try {
      const { data } = await apiClient.post("/suppliers", payload);
      return data.data;
    } catch (error) {
      throw unwrapError(error);
    }
  },
};

export default supplierService;
