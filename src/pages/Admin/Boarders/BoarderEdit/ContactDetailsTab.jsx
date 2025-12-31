import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { chunkFields } from "../../../../../utils/chunkFields";
import DynamicFormRow from "./DynamicForm";

export default function ContactDetailsTab({
  boarder,
  formData,
  setFormData,
  handleSave,
  validated,
  setValidated,
}) {
  // useEffect(() => {
  //   setFormData({});
  // }, []);

  const fields = [
    {
      label: "Email Address",
      key: "email",
      type: "text",
      required: true,
      colSpan: 6,
    },
    {
      label: "Phone Number",
      key: "phone_number",
      type: "phone",
      prefix: "+63",
      required: true,
      placeholder: "9123456789",
      colSpan: 6,
    },
  ];

  const fieldRows = chunkFields(fields, 2);

  return (
    <Form noValidate validated={validated} onSubmit={handleSave}>
      {fieldRows.map((row, i) => (
        <DynamicFormRow
          key={i}
          fields={row}
          formData={formData}
          boarder={boarder}
          setFormData={setFormData}
        />
      ))}

      {Object.keys(formData).length > 0 && (
        <div className="d-flex justify-content-center gap-2 w-100">
          <Button variant="primary" size="sm" type="submit">
            Save Changes
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setFormData({});
              setValidated(false);
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </Form>
  );
}
