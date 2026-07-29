import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Base URL for the server itself (not the /api prefix) — used to
// resolve relative image paths like "/uploads/167213-mouse.jpg" into
// full, loadable URLs such as "http://localhost:5000/uploads/167213-mouse.jpg".
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL || "http://localhost:5000";

/**
 * withCredentials: true tells the browser to include the httpOnly auth
 * cookie on every request, and to accept/store any cookie the server
 * sets in response. Without this, protected requests would silently
 * come back 401 Unauthorized even after a successful login.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const unwrapError = (error) => {
  const message =
    error.response?.data?.error ||
    error.message ||
    "Something went wrong while contacting the server.";
  return new Error(message);
};

/** Resolves a stored relative image path into a fully loadable URL. */
export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  return `${UPLOADS_BASE_URL}${imageUrl}`;
};

export default apiClient;
