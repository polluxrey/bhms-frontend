import { useState } from "react";
import { useAuthUser } from "../../context/authUserContext";

export function useLoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const { login } = useAuthUser();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const result = await login(formData);
    if (result.success) {
      setSubmitSuccess("Login successful!");
      setFormData({ email: "", password: "" });
    } else {
      setSubmitError(result.error || "Login failed");
    }

    setSubmitting(false);
  };

  return {
    formData,
    submitting,
    submitError,
    submitSuccess,
    handleChange,
    handleSubmit,
  };
}
