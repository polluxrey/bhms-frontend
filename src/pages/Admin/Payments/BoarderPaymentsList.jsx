import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaEye } from "react-icons/fa";
import PaymentStatusBadge from "../../../components/Badge/PaymentStatusBadge";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import ConfirmPaymentButton from "../../../components/Payment/ConfirmPaymentButton";
import { updatePayment } from "../../../services/paymentService";

export default function BoarderPaymentsList() {
  const title = "View Boarder Payments";
  useDocumentTitle(title);

  const location = useLocation();
  const navigate = useNavigate();

  const boarder = location.state?.boarder;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [payments, setPayments] = useState([]);
  const [prevPage, setPrevPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [paymentCount, setPaymentCount] = useState(0);

  if (!boarder) {
    return (
      <Container>
        <Button
          variant="link"
          className="text-decoration-none text-muted p-0 mb-3"
          onClick={() => navigate("/admin/payments")}
        >
          <FaArrowLeft className="me-1" /> Back
        </Button>
        <p>No boarder data available.</p>
      </Container>
    );
  }

  const fetchPayments = async (url = null) => {
    setLoading(true);
    setError(null);

    try {
      let fetchUrl = url;
      const accessToken = localStorage.getItem("access_token");

      if (!fetchUrl) {
        const params = new URLSearchParams({
          boarder_id: boarder.id,
        });
        fetchUrl = `${
          import.meta.env.VITE_API_URL
        }/api/payment/boarder-payments/?${params}`;
      }

      const response = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setPayments(data.results || data);
      setPrevPage(data.previous || null);
      setNextPage(data.next || null);
      setPaymentCount(data.paymentCount || data.count || null);
    } catch (error) {
      console.error("Error fetching boarders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boarder?.id) {
      fetchPayments();
    }
  }, []);

  const handleConfirm = async (paymentId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const result = await updatePayment(paymentId, "confirm");

      if (result.success) {
        setSuccess("Payment confirmed successfully!");
        await fetchPayments();
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
            View Boarder Payments
          </mark>
        </h3>
      </Row>

      <Row className="mb-3">
        <Col>
          <Card className="default-box-shadow rounded-4 p-3">
            <Container className="mb-3 p-0">
              <h2 className="mb-0">{boarder.full_name}</h2>
            </Container>
            <Container>
              <Table striped bordered hover responsive>
                <thead className="text-center">
                  <tr>
                    <th>Date Submitted</th>
                    <th>Payment Type</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map((p) => (
                      <tr key={p.id}>
                        <td>{p.created_at_date_display}</td>
                        <td>{p.payment_type_name}</td>
                        <td>{p.payment_method_name}</td>
                        <td>₱{p.amount}</td>
                        <td>
                          <PaymentStatusBadge status={p.status} />
                        </td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                navigate("/admin/payments/boarder/view", {
                                  state: { payment: p },
                                })
                              }
                            >
                              <FaEye />
                              <span className="d-none d-md-inline">
                                {" "}
                                View Details
                              </span>
                            </Button>
                            {p.status.toLowerCase() !== "confirmed" && (
                              <ConfirmPaymentButton
                                icon={<FaEye />}
                                label="Confirm"
                                onConfirm={() => handleConfirm(p.id)}
                                disabled={loading}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No payments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center mt-2">
                <div>
                  {paymentCount !== null && (
                    <small className="text-muted">
                      Showing {payments.length} of {paymentCount} records
                    </small>
                  )}
                </div>
                {(prevPage || nextPage) && (
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      disabled={!prevPage} // disable if no previous page
                      onClick={() => prevPage && fetchBoarders(prevPage)} // fetch previous page
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={!nextPage} // disable if no next page
                      onClick={() => nextPage && fetchBoarders(nextPage)} // fetch next page
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            </Container>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
