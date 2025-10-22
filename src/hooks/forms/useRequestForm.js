import { useState } from "react";
import { submitRequest } from "../../services/requestService";

export function useRequestForm() {
  const [formData, setFormData] = useState({
    boarder: "",
    request_type: "",
    description: "",
    attachment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });

      const result = await submitRequest(payload);

      if (!result?.success) {
        throw new Error(result.error || "Request submission failed");
      }

      const referenceNumber = result.data?.reference_number;

      setSubmitSuccess(
        `We've received your request. Reference No: ${referenceNumber}.`
      );

      setFormData({
        boarder: "",
        request_type: "",
        description: "",
        attachment: "",
      });
    } catch (err) {
      setSubmitError(err.message || "An error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
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
