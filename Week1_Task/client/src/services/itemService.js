import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Centralize error unwrapping so components only deal with plain strings.
const unwrapError = (error) => {
  const message =
    error.response?.data?.error ||
    error.message ||
    "Something went wrong while contacting the server.";
  return new Error(message);
};

export const itemService = {
  async getAll() {
    try {
      const { data } = await api.get("/items");
      return data.data; // array of items
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async getById(id) {
    try {
      const { data } = await api.get(`/items/${id}`);
      return data.data;
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async create(payload) {
    try {
      const { data } = await api.post("/items", payload);
      return data.data;
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async update(id, payload) {
    try {
      const { data } = await api.put(`/items/${id}`, payload);
      return data.data;
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async remove(id) {
    try {
      const { data } = await api.delete(`/items/${id}`);
      return data.data;
    } catch (error) {
      throw unwrapError(error);
    }
  },
};

export default itemService;
