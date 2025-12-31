import { Alert, Button, Card, Container, Row } from "react-bootstrap";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DynamicTable from "../../../components/Table/DynamicTable";
import { fetchRequestByRef } from "../../../services/requestService";
import RequestStatusBadge from "../../../components/Badge/RequestStatusBadge";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import RequestStatusModal from "./RequestStatusModal";

export default function RequestDetails() {
  const title = "View Request";
  useDocumentTitle(title);

  const location = useLocation();
  const navigate = useNavigate();
  const referenceNumber = location.state?.referenceNumber;

  if (!referenceNumber) {
    return (
      <Container>
        <Button
          variant="link"
          className="text-decoration-none text-muted p-0 mb-3"
          onClick={() => navigate("/admin/requests")}
        >
          <FaArrowLeft className="me-1" /> Back
        </Button>
        <p>No request data available.</p>
      </Container>
    );
  }

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);

  const fetchRequest = async (referenceNumber) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const {
        success: fetchSuccess,
        data,
        error: fetchError,
      } = await fetchRequestByRef(referenceNumber);
      if (fetchSuccess) {
        setRequest(data);
      } else {
        setErrorMessage(fetchError || "Failed to fetch data");
      }
    } catch (err) {
      setErrorMessage(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (referenceNumber) {
      fetchRequest(referenceNumber);
    }
  }, [referenceNumber]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const fieldLabels = [
    {
      tableOptions: {
        showHeader: false,
        striped: "columns",
        bodyAlign: "left",
      },
      columns: [
        { key: "label", type: "text", fontWeight: "bold" },
        { key: "value" },
      ],
      data: [
        {
          label: "Reference Number",
          value: request?.reference_number,
          type: "text",
        },
        {
          label: "Requested By",
          value: request?.boarder_full_name,
          type: "text",
        },
        {
          label: "Request Type",
          value: request?.request_type,
          type: "badge",
        },
        {
          key: "status",
          label: "Status",
          value: request?.status,
          type: "badge",
          badge: RequestStatusBadge,
        },
        {
          label: "Date Requested",
          value: request?.created_at,
          type: "date",
          format: (value) =>
            new Date(value).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
        },
        {
          label: "Date Updated",
          value: request?.updated_at,
          type: "date",
          format: (value) =>
            new Date(value).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
        },
      ].filter((field) => field.value != null),
    },
    {
      columns: [
        {
          key: "description",
          label: "Description",
          type: "container",
          container: ({ row }) => (
            <>
              <textarea
                defaultValue={row.description}
                rows={3}
                style={{
                  width: "100%",
                  resize: "none",
                }}
                disabled
              />
            </>
          ),
        },
      ],
      data: request?.description ? [{ description: request.description }] : [],
    },
    {
      columns: [
        {
          key: "attachment_url",
          label: "Attachment",
          type: "container",
          container: ({ row }) => (
            <>
              <a
                href={row.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                View Image
              </a>
            </>
          ),
        },
      ],
      data: request?.attachment_url
        ? [{ attachment_url: request.attachment_url }]
        : [],
    },
    {
      columns: [
        {
          key: "admin_remarks",
          label: "Admin Remarks",
          type: "container",
          container: ({ row }) => (
            <>
              <textarea
                defaultValue={row.admin_remarks}
                rows={3}
                style={{
                  width: "100%",
                }}
                disabled
              />
            </>
          ),
        },
      ],
      data: request?.admin_remarks
        ? [{ admin_remarks: request.admin_remarks }]
        : [],
    },
  ];

  // console.log(fieldLabels);

  return (
    <Container>
      {successMessage && (
        <Alert variant="success" className="mb-2 py-2">
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="danger" className="mb-2 py-2">
          {errorMessage}
        </Alert>
      )}

      <Button
        variant="link"
        className="text-decoration-none text-muted p-0"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-1" /> Back
      </Button>

      <Row className="py-3">
        <h3 className="fw-bold">
          <mark className="mark-pink text-white rounded-3">{title}</mark>
        </h3>
      </Row>

      <Card className="default-box-shadow rounded-4 p-3">
        {request && (
          <>
            <Container className="d-flex justify-content-between justify-content-lg-start align-items-center gap-3 mb-3 p-0">
              <h2 className="mb-0">Request for {request.request_type}</h2>
              {request.status !== "RESOLVED" &&
                request.status !== "REJECTED" && (
                  <Button
                    variant="warning"
                    onClick={() => setShowStatusModal(true)}
                  >
                    <FaEdit />{" "}
                    <span className="d-none d-md-inline">Update status</span>
                  </Button>
                )}
            </Container>

            {fieldLabels
              .filter((section) => section.data && section.data.length > 0)
              .map((section, index) => (
                <Row key={index}>
                  <DynamicTable
                    columns={section.columns}
                    data={section.data}
                    loading={loading}
                    tableOptions={section.tableOptions}
                  />
                </Row>
              ))}
          </>
        )}
      </Card>

      {showStatusModal && (
        <RequestStatusModal
          referenceNumber={referenceNumber}
          initialData={{
            status: request?.status,
            admin_remarks: request?.admin_remarks,
          }}
          onSuccess={(data) => {
            setSuccessMessage(data.message);
            setRequest((prev) => ({
              ...prev,
              status: data.status,
              admin_remarks: data.admin_remarks,
              updated_at: new Date().toISOString(),
            }));
          }}
          onError={(message) => {
            setErrorMessage(message);
          }}
          show={showStatusModal}
          onHide={() => setShowStatusModal(false)}
        />
      )}
    </Container>
  );
}
