import { Row, Col, Form, InputGroup } from "react-bootstrap";

export default function DynamicFormRow({
  fields,
  formData,
  boarder = {},
  setFormData,
}) {
  const updateFormData = (key, value) => {
    let finalValue = value;

    // Apply uppercase to all text values EXCEPT email
    if (typeof value === "string" && key !== "email") {
      finalValue = value.toUpperCase();
    }

    setFormData((prev) => {
      // If unchanged from boarder default, remove from formData
      if (finalValue === boarder[key]) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [key]: finalValue };
    });
  };

  const handleChange = (key, custom) => (e) => {
    if (custom) return custom(e);

    // If switch, use checked instead of value
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    updateFormData(key, value);
  };

  return (
    <Row className="mb-2 mb-md-0">
      {fields.map(
        ({
          colSpan,
          key,
          label,
          type = "text",
          checked,
          prefix,
          required,
          placeholder,
          disabled,
          options,
          onChange,
        }) => (
          <Col xs={12} md={colSpan ?? 4} key={key} className="mb-2">
            {type === "switch" ? (
              <Form.Group className="d-flex align-items-center gap-2">
                <Form.Label className="fw-bold mb-0">
                  {label}
                  {required && <span className="text-danger">*</span>}
                </Form.Label>
                <Form.Check
                  type="switch"
                  name={key}
                  checked={checked ?? formData[key] ?? boarder[key] ?? false}
                  onChange={handleChange(key, onChange)}
                  className="m-0"
                  required={required}
                  disabled={disabled}
                />
              </Form.Group>
            ) : (
              <>
                <Form.Label className="fw-bold">
                  {label}
                  {required && <span className="text-danger">*</span>}
                </Form.Label>

                {type === "dropdown" ? (
                  <>
                    {/* <Form.Select
                      name={key}
                      value={
                        (formData[key] ?? boarder[key] ?? "") &&
                        options?.some(
                          (o) => o.value === (formData[key] ?? boarder[key])
                        )
                          ? formData[key] ?? boarder[key]
                          : ""
                      }
                      onChange={handleChange(key, onChange)}
                      required={required}
                      disabled={disabled}
                    >
                      <option value="" disabled>
                        Select {label}
                      </option>
                      {options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Form.Select> */}
                    <Form.Select
                      name={key}
                      value={formData[key] ?? boarder[key] ?? ""}
                      onChange={handleChange(key, onChange)}
                      required={required}
                      disabled={disabled}
                    >
                      <option value="">Select {label}</option>
                      {options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Form.Select>
                    {required && (
                      <Form.Control.Feedback type="invalid">
                        Please select {label}.
                      </Form.Control.Feedback>
                    )}
                  </>
                ) : type === "phone" ? (
                  <>
                    <InputGroup>
                      {prefix && <InputGroup.Text>{prefix}</InputGroup.Text>}
                      <Form.Control
                        type="tel"
                        placeholder={placeholder}
                        name={key}
                        value={formData[key] ?? boarder[key] ?? ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [key]: e.target.value.replace(/[^\d]/g, ""),
                          }))
                        }
                        maxLength={10}
                        required={required}
                        disabled={disabled}
                      />
                    </InputGroup>
                    {required && (
                      <Form.Control.Feedback type="invalid">
                        {label} is required.
                      </Form.Control.Feedback>
                    )}
                  </>
                ) : type === "textarea" ? (
                  <>
                    <Form.Control
                      as="textarea"
                      name={key}
                      placeholder={placeholder}
                      value={formData[key] ?? boarder[key] ?? ""}
                      onChange={handleChange(key, onChange)}
                      rows={3}
                      required={required}
                      disabled={disabled}
                    />
                    {required && (
                      <Form.Control.Feedback type="invalid">
                        {label} is required.
                      </Form.Control.Feedback>
                    )}
                  </>
                ) : (
                  <>
                    <Form.Control
                      type={type}
                      name={key}
                      placeholder={placeholder}
                      value={formData[key] ?? boarder[key] ?? ""}
                      onChange={handleChange(key, onChange)}
                      required={required}
                      disabled={disabled}
                    />
                    {required && (
                      <Form.Control.Feedback type="invalid">
                        {label} is required.
                      </Form.Control.Feedback>
                    )}
                  </>
                )}
              </>
            )}
          </Col>
        )
      )}
    </Row>
  );
}
