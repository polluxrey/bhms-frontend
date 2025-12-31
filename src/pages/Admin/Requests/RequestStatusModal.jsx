import { useRef, useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import DynamicFormRow from "../Boarders/BoarderEdit/DynamicForm";
import {
  fetchRequestStatusesData,
  updateRequestStatusByRef,
} from "../../../services/requestService";
import { useFetch } from "../../../hooks/useFetch";
import ConfirmationModal from "../../../components/Modal/ConfirmationModal";

export default function RequestStatusModal({
  referenceNumber,
  initialData,
  onSuccess,
  onError,
  ...props
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialData);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validated, setValidated] = useState(false);

  const formRef = useRef();

  const {
    data: requestStatusData,
    loading: requestStatusLoading,
    error: requestStatusError,
  } = useFetch(fetchRequestStatusesData);

  const updateRequestStatus = async (status, remarks) => {
    setLoading(true);
    setError(null);

    try {
      const {
        success,
        data,
        error: fetchError,
      } = await updateRequestStatusByRef({
        ref_no: referenceNumber,
        status,
        remarks,
      });

      if (success) {
        setSuccess(data.message);
        onSuccess?.({
          message: data.message,
          status: formData.status,
          admin_remarks: formData.admin_remarks,
        });
      } else {
        const errMsg = fetchError || "Failed to fetch data";
        setError(errMsg);
        onError?.(errMsg);
      }
    } catch (err) {
      const errMsg = err.message || "Network error";
      setError(errMsg);
      onError?.(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    updateRequestStatus(formData.status, formData.admin_remarks);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();

    const form = formRef.current;

    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    setValidated(true);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    handleSave();
    setShowConfirm(false);
    props.onHide?.();
  };

  const handleCancel = () => setShowConfirm(false);

  const fields = [
    {
      label: "Request Status",
      key: "status",
      type: "dropdown",
      options: (requestStatusData ?? []).map((s) => ({
        value: s.value,
        label: s.label,
      })),
      required: true,
      colSpan: 12,
    },
    {
      label: "Remarks",
      key: "admin_remarks",
      type: "textarea",
      colSpan: 12,
    },
  ];

  const isUnchangedOrEmpty =
    !formData.status ||
    (formData.status === initialData.status &&
      (formData.admin_remarks ?? "") === (initialData.admin_remarks ?? ""));

  return (
    <>
      <Modal {...props} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} ref={formRef}>
            <DynamicFormRow
              fields={fields}
              formData={formData}
              setFormData={setFormData}
            />
          </Form>
          {loading && <p>Updating status...</p>}
          {success && <p className="text-success">{success}</p>}
          {error && <p className="text-danger">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveClick}
            disabled={loading || isUnchangedOrEmpty}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmationModal
        show={showConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={"Are you sure you want to update the status?"}
      />
    </>
  );
}
