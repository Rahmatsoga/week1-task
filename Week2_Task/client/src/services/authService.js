import apiClient, { unwrapError } from "./apiClient";

export const authService = {
  async register({ name, email, password }) {
    try {
      const { data } = await apiClient.post("/auth/register", { name, email, password });
      return data.data; // { id, name, email }
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async login({ email, password }) {
    try {
      const { data } = await apiClient.post("/auth/login", { email, password });
      return data.data; // { id, name, email }
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

  /**
   * Asks the server "who am I, based on my auth cookie?" — used on
   * app load to restore a session after a page refresh, without ever
   * needing to store the user's identity in localStorage ourselves.
   */
  async getMe() {
    try {
      const { data } = await apiClient.get("/auth/me");
      return data.data; // full user object (minus password)
    } catch (error) {
      throw unwrapError(error);
    }
  },
};

export default authService;
