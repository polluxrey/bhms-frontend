import { useEffect } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { useLoginForm } from "../../hooks/forms/useLoginForm";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function LoginForm({ onSuccess }) {
  useDocumentTitle("Login");

  const {
    formData,
    submitting,
    submitError,
    submitSuccess,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  useEffect(() => {
    if (submitSuccess && onSuccess) onSuccess();
  }, [submitSuccess, onSuccess]);

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        {(submitError || submitSuccess) && (
          <Alert variant={submitError ? "danger" : "success"} className="mt-3">
            {submitError || submitSuccess}
          </Alert>
        )}

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label className="fw-bold">Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter email"
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label className="fw-bold">Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </Container>
  );
}
