import { useState } from "react";

const initialFormState = {
  name: "",
  sku: "",
  category: "",
  quantity: "",
  price: "",
};

/**
 * Controlled form for creating a new inventory item. Performs
 * client-side validation before ever calling the API, and surfaces
 * per-field error messages.
 */
export default function ItemForm({ onCreate, isSubmitting }) {
  const [form, setForm] = useState(initialFormState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    //s
    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category.trim(),
      quantity: Number(form.quantity),
      price: Number(form.price),
    };

    const result = await onCreate(payload);

    if (result.success) {
      setForm(initialFormState);
      setFieldErrors({});
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <form className="item-form" onSubmit={handleSubmit} noValidate>
      <h2>Add Inventory Item</h2>

      <div className="form-row">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Wireless Mouse"
        />
        {fieldErrors.name && (
          <span className="field-error">{fieldErrors.name}</span>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="sku">SKU</label>
        <input
          id="sku"
          name="sku"
          value={form.sku}
          onChange={handleChange}
          placeholder="WM-001"
        />
        {fieldErrors.sku && (
          <span className="field-error">{fieldErrors.sku}</span>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Electronics"
        />
        {fieldErrors.category && (
          <span className="field-error">{fieldErrors.category}</span>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min="0"
          value={form.quantity}
          onChange={handleChange}
        />
        {fieldErrors.quantity && (
          <span className="field-error">{fieldErrors.quantity}</span>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="price">Price ($)</label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
        />
        {fieldErrors.price && (
          <span className="field-error">{fieldErrors.price}</span>
        )}
      </div>

      {submitError && <p className="form-error">{submitError}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Add Item"}
      </button>
    </form>
  );
}
