import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!form.password || form.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    const result = await register(form);
    setIsSubmitting(false);

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1>Create an Account</h1>
        <p className="auth-subtitle">Register to start managing your inventory.</p>

        <div className="form-row">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </div>

        {submitError && <p className="form-error">{submitError}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </main>
  );
}
