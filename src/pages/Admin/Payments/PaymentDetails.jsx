import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import PaymentStatusBadge from "../../../components/Badge/PaymentStatusBadge";
import { updatePayment } from "../../../services/paymentService";
import ConfirmPaymentButton from "../../../components/Payment/ConfirmPaymentButton";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";

export default function PaymentDetails() {
  const title = "View Payment Details";
  useDocumentTitle(title);

  const location = useLocation();
  const navigate = useNavigate();

  const payment = location.state?.payment;
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!payment) {
    return (
      <Container>
        <Button
          variant="link"
          className="text-decoration-none text-muted p-0 mb-3"
          onClick={() => navigate("/admin/payments")}
        >
          <FaArrowLeft className="me-1" /> Back
        </Button>
        <p>No payment details available.</p>
      </Container>
    );
  }

  const fetchPayment = async (payment_id) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${
        import.meta.env.VITE_API_URL
      }/api/payment/view/${payment_id}`;

      const accessToken = localStorage.getItem("access_token");

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setPaymentDetails(data);
    } catch (error) {
      console.error("Error fetching payment:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (payment?.id) {
      fetchPayment(payment.id);
    }
  }, [payment?.id]);

  const paymentFields = [
    { label: "Date Submitted", key: "created_at_datetime_display" },
    { label: "Payment Type", key: "payment_type_name" },
    { label: "Payment Method", key: "payment_method_name" },
    { label: "Amount", key: "amount" },
    { label: "Status", key: "status" },
  ];

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const result = await updatePayment(payment.id, "confirm");

      if (result.success) {
        setSuccess("Payment confirmed successfully!");
        fetchPayment(payment.id);
      } else {
        setError(result.error || "Failed to confirm payment.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {(error || success) && (
        <Alert variant={error ? "danger" : "success"} className="mb-2 py-2">
          {error || success}
        </Alert>
      )}

      <Button
        variant="link"
        className="text-decoration-none text-muted p-0"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-1" /> Back
      </Button>

      <Row className="pt-4 pb-3">
        <h3 className="fw-bold">
          <mark className="mark-pink text-white rounded-3">
            View Boarder Payment
          </mark>
        </h3>
      </Row>

      <Row className="mb-3">
        <Col>
          <Card className="default-box-shadow rounded-4 p-3">
            <Container className="d-flex justify-content-between align-items-center gap-3 mb-3 p-0">
              <h2 className="mb-0">{paymentDetails.boarder_full_name}</h2>
              {paymentDetails.status?.toLowerCase() !== "confirmed" && (
                <ConfirmPaymentButton
                  variant="primary"
                  size=""
                  label={<>Confirm Payment</>}
                  onConfirm={handleConfirm}
                  disabled={loading}
                />
              )}
            </Container>
            <Table striped="columns" bordered className="mb-3">
              <tbody>
                {paymentFields
                  .filter(({ key }) => paymentDetails[key])
                  .map(({ label, key }) => (
                    <tr key={key}>
                      <td className="w-25 fw-bold">
                        <strong>{label}</strong>
                      </td>
                      <td>
                        {key === "status" ? (
                          <PaymentStatusBadge status={paymentDetails[key]} />
                        ) : (
                          paymentDetails[key] ?? "-"
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            <Table striped bordered className="mb-3">
              <thead>
                <tr>
                  <th className="fw-bold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{paymentDetails.description}</td>
                </tr>
              </tbody>
            </Table>
            <Table striped bordered className="mb-3">
              <thead>
                <tr>
                  <td className="fw-bold">Proof of Payment</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {paymentDetails.receipt ? (
                      <img
                        src={paymentDetails.receipt}
                        alt="Proof of payment"
                        className="img-fluid"
                        style={{ maxWidth: "400px" }}
                      />
                    ) : (
                      <span className="text-muted">No image uploaded.</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
