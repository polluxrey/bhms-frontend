import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { fetchRequestByRef } from "../../services/requestService";
import RequestStatusBadge from "../../components/Badge/RequestStatusBadge";

export default function ServiceRequests() {
  useDocumentTitle("View Request");

  const [refNumber, setRefNumber] = useState("");
  const [searchRef, setSearchRef] = useState(null); // triggers fetch
  const [validationError, setValidationError] = useState("");
  const [showAlert, setShowAlert] = useState(true);

  const { data, loading, error } = useFetch(
    searchRef ? fetchRequestByRef : null, // The function is conditional
    [searchRef] // The dependency array is constant (Size 1)
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    setValidationError("");
    setShowAlert(true);

    if (refNumber.trim().length !== 7) {
      setValidationError("Please enter a valid 7-digit reference number.");
      return;
    }

    setSearchRef(refNumber);
  };

  const requestFields = [
    { label: "Reference Number", key: "reference_number" },
    { label: "Requested By", key: "boarder_full_name" },
    { label: "Request Date", key: "created_at" },
    { label: "Last Updated", key: "updated_at" },
    { label: "Request Type", key: "request_type" },
    { label: "Status", key: "status" },
  ];

  return (
    <Container className="mt-2 mb-3">
      {(validationError || error) && (
        <Alert
          show={showAlert}
          variant="danger"
          dismissible
          onClose={() => setShowAlert(false)}
          className="mb-3"
        >
          {validationError || error}
        </Alert>
      )}
      <Row className="py-3">
        <h1 className="fw-bold">
          <mark className="mark-pink text-white rounded-3">View Request</mark>
        </h1>
      </Row>

      <Row className="mb-3">
        <Col>
          <Card className="default-box-shadow rounded-4 p-4">
            <Form onSubmit={handleSearch}>
              <Form.Group
                as={Row}
                className="align-items-center"
                controlId="formRef"
              >
                <Form.Label className="fw-bold">
                  Reference Number <span className="text-danger">*</span>
                </Form.Label>
                <Col>
                  <Form.Control
                    placeholder="Your 7-digit code"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                  />
                </Col>
                <Col xs="auto" className="ms-auto">
                  <Button variant="primary" type="submit">
                    Search
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </Card>
        </Col>
      </Row>

      {data && !(validationError || error) && (
        <Row>
          <Col>
            <Card className="default-box-shadow rounded-4 p-4">
              <Table striped="columns" bordered>
                <tbody>
                  {requestFields
                    .filter(({ key }) => data[key])
                    .map(({ label, key }) => (
                      <tr key={key}>
                        <td>
                          <strong>{label}</strong>
                        </td>
                        <td>
                          {key === "status" ? (
                            <RequestStatusBadge status={data[key]} />
                          ) : (
                            data[key]
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>

              {data.admin_remarks && (
                <Table striped bordered>
                  <tbody>
                    <tr>
                      <td colSpan={2}>
                        <strong>Admin Remarks</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{data.admin_remarks}</td>
                    </tr>
                  </tbody>
                </Table>
              )}

              {data.description && (
                <Table striped bordered>
                  <tbody>
                    <tr>
                      <td colSpan={2}>
                        <strong>Description</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>{data.description}</td>
                    </tr>
                  </tbody>
                </Table>
              )}

              {data.attachment_url && (
                <Table striped bordered>
                  <tbody>
                    <tr>
                      <td colSpan={2}>
                        <strong>Attached Image</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <img
                          src={data.attachment_url}
                          alt="Attached"
                          style={{ maxWidth: "300px" }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

{
  /*               
              <Table striped bordered>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      <strong>Admin Remarks</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Bought two garbage bags each for 2nd and 3rd floor.</td>
                  </tr>
                </tbody>
              </Table>
              <Table striped bordered>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      <strong>Details</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      This is line 1.
                      <br />
                      This is line 2.
                      <br />
                      This is line 3.
                    </td>
                  </tr>
                </tbody>
              </Table>
              <Table striped bordered>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      <strong>Attached Photo</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img
                        src="https://images.unsplash.com/photo-1480497490787-505ec076689f"
                        alt="Placeholder image of a sunset"
                        style={{
                          maxWidth: "300px",
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </Table> */
}
