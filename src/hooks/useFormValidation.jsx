import { useState } from "react";

export function useFormValidation(handleSave) {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    handleSave();
  };

  return { validated, handleSubmit };
}
