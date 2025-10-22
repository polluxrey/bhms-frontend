import { useState, useCallback } from "react";
import OTPInput from "./OTPInput";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import { verifyOTP } from "../../services/otpService";

const VerificationForm = ({ boarderId, email, onSuccess, onClose }) => {
  const [finalOtp, setFinalOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleOtpComplete = useCallback((otp) => {
    setFinalOtp(otp);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (finalOtp.length !== 6) return;

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await verifyOTP({
        boarder_id: boarderId,
        otp: finalOtp,
      });

      if (response.success) {
        setStatus({ type: "success", message: response.data.message });
        setTimeout(() => onSuccess(), 1000);
      } else {
        setStatus({
          type: "warning",
          message: response.error,
        });
      }
    } catch (err) {
      setStatus({
        type: "danger",
        message: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="text-center">
      <h1 className="h3 fw-bold text-dark mb-2">One-Time Password sent!</h1>
      <p className="text-muted">
        A 6-digit code has been sent to <strong>{email}</strong>
      </p>

      <OTPInput onComplete={handleOtpComplete} isSubmitting={isSubmitting} />

      {status.message && (
        <Alert variant={status.type} className="mt-3 mb-0 py-2">
          {status.message}
        </Alert>
      )}

      <div className="d-grid gap-2 mt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={finalOtp.length !== 6 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              Verifying...
            </>
          ) : (
            "Verify Code"
          )}
        </Button>

        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default VerificationForm;
