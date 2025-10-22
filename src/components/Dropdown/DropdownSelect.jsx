// src/components/common/DropdownSelect.jsx
import { Form, Spinner, Alert } from "react-bootstrap";

/**
 * A general-purpose dropdown (select) component.
 *
 * Props:
 * - label: string → label text (optional)
 * - value: string → current selected value
 * - onChange: function(value) → callback when selection changes
 * - options: array → list of options [{ value, label }]
 * - loading: boolean → shows spinner
 * - error: string → shows error message
 * - required: boolean → adds HTML required attribute
 * - disabled: boolean → disables dropdown
 * - placeholder: string → default "Select an option"
 * - controlId: string → unique ID for Form.Group
 */
export default function DropdownSelect({
  label,
  value,
  onChange,
  options = [],
  loading = false,
  error = "",
  required = false,
  disabled = false,
  placeholder = "Select an option",
  controlId = "dropdown-select",
}) {
  return (
    <Form.Group className="mb-3" controlId={controlId}>
      {label && (
        <Form.Label className="fw-bold">
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}

      {loading && (
        <div className="mb-2">
          <Spinner animation="border" size="sm" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled || loading}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}
