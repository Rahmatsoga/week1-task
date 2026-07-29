import { useEffect, useRef, useState } from "react";
import supplierService from "../services/supplierService";

const initialFormState = {
  name: "",
  sku: "",
  category: "",
  quantity: "",
  price: "",
  supplier: "",
};

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_MB = 5;

/**
 * Controlled form for creating a new inventory item, including an
 * optional product image. The image is validated (type + size) and
 * previewed entirely client-side, before anything is ever sent to the
 * server — the actual upload only happens on submit.
 */
export default function ItemForm({ onCreate, isSubmitting }) {
  const [form, setForm] = useState(initialFormState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [suppliers, setSuppliers] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageError, setImageError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    supplierService.getAll().then(setSuppliers).catch(() => setSuppliers([]));
  }, []);

  // Clean up the temporary in-browser preview URL whenever it changes
  // or the component unmounts, so we don't leak memory holding onto
  // an object URL nobody is displaying anymore.
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (!file) {
      setImageFile(null);
      setImagePreviewUrl(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Only JPEG, PNG, WEBP, or GIF images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setImageError(`Image must be under ${MAX_FILE_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    // URL.createObjectURL creates a temporary, local-only link to the
    // file still sitting on the user's own device — nothing has been
    // uploaded anywhere yet. This is purely a client-side preview.
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImageFile(null);
    setImagePreviewUrl(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }
    if (!form.sku.trim() || form.sku.trim().length < 3) {
      errors.sku = "SKU must be at least 3 characters.";
    }
    if (!form.category.trim()) {
      errors.category = "Category is required.";
    }
    if (form.quantity === "" || Number(form.quantity) < 0) {
      errors.quantity = "Quantity must be 0 or greater.";
    }
    if (form.price === "" || Number(form.price) < 0) {
      errors.price = "Price must be 0 or greater.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (imageError) return;

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category.trim(),
      quantity: Number(form.quantity),
      price: Number(form.price),
      supplier: form.supplier || "",
      variants: [],
    };

    const result = await onCreate(payload, imageFile);

    if (result.success) {
      setForm(initialFormState);
      setFieldErrors({});
      clearImage();
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <form className="item-form" onSubmit={handleSubmit} noValidate>
      <h2>Add Inventory Item</h2>

      <div className="form-row">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Wireless Mouse" />
        {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="sku">SKU</label>
        <input id="sku" name="sku" value={form.sku} onChange={handleChange} placeholder="WM-001" />
        {fieldErrors.sku && <span className="field-error">{fieldErrors.sku}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="category">Category</label>
        <input id="category" name="category" value={form.category} onChange={handleChange} placeholder="Electronics" />
        {fieldErrors.category && <span className="field-error">{fieldErrors.category}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="quantity">Quantity</label>
        <input id="quantity" name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} />
        {fieldErrors.quantity && <span className="field-error">{fieldErrors.quantity}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="price">Price ($)</label>
        <input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} />
        {fieldErrors.price && <span className="field-error">{fieldErrors.price}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="supplier">Supplier (optional)</label>
        <select id="supplier" name="supplier" value={form.supplier} onChange={handleChange}>
          <option value="">No supplier</option>
          {suppliers.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="image">Product image (optional)</label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageSelect}
          ref={fileInputRef}
        />
        <span className="field-hint">JPEG, PNG, WEBP, or GIF — up to {MAX_FILE_SIZE_MB}MB.</span>
        {imageError && <span className="field-error">{imageError}</span>}

        {imagePreviewUrl && (
          <div className="image-preview">
            <img src={imagePreviewUrl} alt="Selected preview" />
            <button type="button" className="secondary" onClick={clearImage}>Remove image</button>
          </div>
        )}
      </div>

      {submitError && <p className="form-error">{submitError}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Add Item"}
      </button>
    </form>
  );
}
