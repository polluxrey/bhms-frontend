import { useCallback, useEffect, useState } from "react";
import { Container, Spinner, Row, Col, Card, Modal } from "react-bootstrap";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useFetch } from "../../hooks/useFetch";
import { fetchNameData } from "../../services/boarderService";
import { fetchPaymentListData } from "../../services/paymentService";
import { fetchOTP } from "../../services/otpService";
import VerificationForm from "../OTP/VerificationForm";
import DropdownSelect from "../../components/Dropdown/DropdownSelect";
import DataTable from "../../components/Table/DataTable";
import PaymentStatusBadge from "../../components/Badge/PaymentStatusBadge";

export default function BoarderPayments() {
  useDocumentTitle("View Payments");

  const [selectedBoarder, setSelectedBoarder] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [otpRequesting, setOtpRequesting] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: names,
    loading: nameLoading,
    error: nameError,
  } = useFetch(fetchNameData);

  const fetchPayments = useCallback(async () => {
    if (!selectedBoarder || !otpVerified) return { success: true, data: [] };
    return fetchPaymentListData(selectedBoarder, page);
  }, [selectedBoarder, otpVerified, page]);

  const {
    data: payments,
    loading: paymentLoading,
    error: paymentError,
  } = useFetch(fetchPayments);

  useEffect(() => {
    setPage(1);
    setOtpVerified(false);
    setShowModal(false);
    setOtpData(null);
    setOtpError("");
  }, [selectedBoarder]);

  const handleRequestOTP = async (boarderId) => {
    if (!boarderId) return;
    setOtpRequesting(true);
    setOtpError("");
    try {
      const response = await fetchOTP({ boarder_id: boarderId });
      if (response.data.message === "OTP sent to your registered email.") {
        setOtpData(response.data);
        setShowModal(true);
      } else {
        setOtpError(response.message || "Failed to send OTP.");
      }
    } catch {
      setOtpError("Failed to send OTP. Please try again.");
    } finally {
      setOtpRequesting(false);
    }
  };

  return (
    <Container className="mt-2 mb-3">
      <Row className="py-3">
        <h1 className="fw-bold">
          <mark className="mark-pink text-white rounded-3">
            Payment History
          </mark>
        </h1>
      </Row>

      <Row>
        <Col>
          <Card className="default-box-shadow rounded-4 p-3">
            <DropdownSelect
              label="Name"
              value={selectedBoarder}
              onChange={(val) => {
                setSelectedBoarder(val);
                if (val) handleRequestOTP(val);
              }}
              options={
                Array.isArray(names)
                  ? names.map((n) => ({ value: n.id, label: n.name }))
                  : []
              }
              loading={nameLoading}
              error={nameError}
              required
              placeholder="Select your name"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        show={otpRequesting}
        backdrop="static"
        keyboard={false}
        className="text-center"
        centered
      >
        <Modal.Body>
          <Spinner
            animation="border"
            role="status"
            size="lg"
            className="mr-3"
          />
          <p className="mt-2 mb-0">Sending OTP...</p>
        </Modal.Body>
      </Modal>

      <Modal show={showModal} centered>
        <Modal.Body>
          {otpData && (
            <VerificationForm
              boarderId={selectedBoarder}
              email={otpData.masked_email}
              onSuccess={() => {
                setShowModal(false);
                setOtpVerified(true);
              }}
              onClose={() => {
                setShowModal(false);
                setSelectedBoarder("");
              }}
            />
          )}
        </Modal.Body>
      </Modal>

      {otpVerified && (
        <Row className="mt-3">
          <Col>
            <Card className="default-box-shadow rounded-4 p-3">
              <h5>Payment History</h5>
              <DataTable
                columns={[
                  { key: "index", label: "#" },
                  { key: "date", label: "Date" },
                  { key: "amount", label: "Amount" },
                  { key: "status", label: "Status" },
                ]}
                data={
                  payments?.results
                    ? payments.results.map((p, idx) => {
                        return {
                          index: idx + 1,
                          date: p.created_at_date_display,
                          amount: p.amount,
                          status: <PaymentStatusBadge status={p.status} />,
                        };
                      })
                    : []
                }
                loading={paymentLoading}
                error={paymentError}
                count={payments?.count}
                next={payments?.next}
                previous={payments?.previous}
                onNext={() => {
                  if (payments?.next) setPage((p) => p + 1);
                }}
                onPrevious={() => {
                  if (page > 1) setPage((p) => p - 1);
                }}
              />
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
