import apiClient, { unwrapError } from "./apiClient";

export const authService = {
  async register({ name, email, password }) {
    try {
      const { data } = await apiClient.post("/auth/register", { name, email, password });
      return data.data;
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async login({ email, password }) {
    try {
      const { data } = await apiClient.post("/auth/login", { email, password });
      return data.data;
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async getMe() {
    try {
      const { data } = await apiClient.get("/auth/me");
      return data.data;
    } catch (error) {
      throw unwrapError(error);
    }
  },
};

export default authService;
