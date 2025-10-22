import { useState } from "react";
import { submitPayment } from "../../services/paymentService";

export function usePaymentForm() {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    receipt: "",
    boarder: "",
    payment_method: "",
    payment_type: "",
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

      const result = await submitPayment(payload);

      if (!result?.success) {
        throw new Error(result.error || "Payment submission failed");
      }

      setSubmitSuccess("Payment submitted successfully!");
      setFormData({
        amount: "",
        description: "",
        receipt: "",
        boarder: "",
        payment_method: "",
        payment_type: "",
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
