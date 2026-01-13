import { useCallback, useEffect, useState } from "react";
import {
  Container,
  Spinner,
  Row,
  Col,
  Card,
  Modal,
  Alert,
} from "react-bootstrap";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useFetch } from "../../hooks/useFetch";
import { fetchNameData } from "../../services/boarderService";
import { fetchPaymentListData } from "../../services/paymentService";
import { fetchOTP } from "../../services/otpService";
// import VerificationForm from "../OTP/VerificationForm";
import DropdownSelect from "../../components/Dropdown/DropdownSelect";
import DataTable from "../../components/Table/DataTable";
import PaymentStatusBadge from "../../components/Badge/PaymentStatusBadge";
import VerificationForm_v2 from "../OTP/VerificationForm";

export default function BoarderPayments() {
  useDocumentTitle("View Payments");

  const [selectedBoarder, setSelectedBoarder] = useState("");
  const [otpData, setOtpData] = useState(null);
  const [otpRequesting, setOtpRequesting] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    if (!selectedBoarder) return;

    setPage(1);
    setOtpData(null);
    setOtpVerified(false);
    setShowModal(false);
    setErrorMessage("");

    const requestOTP = async () => {
      setOtpRequesting(true);
      try {
        const response = await fetchOTP({ boarder_id: selectedBoarder });
        if (response.success && response.data.status === "otp_sent") {
          setOtpData(response.data);
          setShowModal(true);
        } else {
          setErrorMessage(response.message || "Failed to send OTP.");
        }
      } catch {
        setErrorMessage("Failed to send OTP. Please try again.");
      } finally {
        setOtpRequesting(false);
      }
    };

    requestOTP();
  }, [selectedBoarder]);

  // Clear messages after 5s
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <Container className="my-3">
      {errorMessage && (
        <Alert variant="danger" className="py-2">
          {errorMessage}
        </Alert>
      )}

      <Row className="pt-1 pb-2">
        <h3 className="fw-bold">
          <mark className="mark-pink text-white rounded-3">
            Payment History
          </mark>
        </h3>
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
            <VerificationForm_v2
              boarderId={selectedBoarder}
              otpChannel={otpData.otp_channel}
              maskedData={
                otpData.otp_channel === "sms"
                  ? otpData.phone_suffix
                  : otpData.masked_email
              }
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
