import apiClient, { unwrapError } from "./apiClient";

/**
 * Builds a FormData object (a "multipart package") from a plain item
 * object and an optional File. Regular fields are appended as text;
 * the `variants` array is stringified since FormData can only hold
 * strings and files, not nested objects/arrays directly; the image
 * file itself is appended last under the field name "image", which
 * must match what the backend's multer middleware expects
 * (upload.single("image")).
 */
function buildItemFormData(payload, imageFile) {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("sku", payload.sku);
  formData.append("category", payload.category);
  formData.append("subCategory", payload.subCategory || "");
  formData.append("quantity", payload.quantity);
  formData.append("price", payload.price);
  formData.append("supplier", payload.supplier || "");
  formData.append("variants", JSON.stringify(payload.variants || []));

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return formData;
}

export const itemService = {
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
      return data.data;
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

  /** payload is plain item fields; imageFile is an optional File object from an <input type="file">. */
  async create(payload, imageFile) {
    try {
      const formData = buildItemFormData(payload, imageFile);
      const { data } = await apiClient.post("/items", formData);
      return data.data;
    } catch (error) {
      throw unwrapError(error);
    }
  },

  async update(id, payload, imageFile) {
    try {
      const formData = buildItemFormData(payload, imageFile);
      const { data } = await apiClient.put(`/items/${id}`, formData);
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
