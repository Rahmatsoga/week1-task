import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Shared Axios instance for the whole app. `withCredentials: true` is
 * essential here — it tells the browser to include the httpOnly auth
 * cookie on every request to the API, and to accept/store any cookie
 * the server sets in response (e.g. on login). Without this, the
 * browser would silently drop the auth cookie and every protected
 * request would come back 401 Unauthorized.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/** Centralize error unwrapping so components only deal with plain strings. */
export const unwrapError = (error) => {
  const message =
    error.response?.data?.error ||
    error.message ||
    "Something went wrong while contacting the server.";
  return new Error(message);
};

export default apiClient;
