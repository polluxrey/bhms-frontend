import { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";

export default function ConfirmPaymentButton({
  onConfirm,
  variant = "success",
  size = "sm",
  icon = null,
  label = "Confirm",
  disabled = false,
}) {
  const [showModal, setShowModal] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleConfirmClick = async () => {
    setConfirming(true);
    try {
      await onConfirm(); // run the parent handler
      setShowModal(false);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={() => setShowModal(true)}
      >
        {icon && <>{icon}</>}
        <span className="d-none d-md-inline"> {label}</span>
      </Button>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to confirm this payment? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            disabled={confirming}
          >
            Cancel
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirmClick}
            disabled={confirming}
          >
            {confirming ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />{" "}
                Confirming...
              </>
            ) : (
              <>
                <FaCheck className="me-1" /> Confirm
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
