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
import { useFetcher, useLocation, useNavigate } from "react-router-dom";
import { fetchBoarderDetailsData } from "../../../services/boarderService";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

export default function BoarderDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const boarderState = location.state?.boarder;

  const [boarder, setBoarder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!boarderState) {
    return (
      <Container>
        <Button
          variant="link"
          className="text-decoration-none text-muted p-0 mb-3"
          onClick={() => navigate("/admin/boarders")}
        >
          <FaArrowLeft className="me-1" /> Back
        </Button>
        <p>No boarder data available.</p>
      </Container>
    );
  }

  const fetchBoarder = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const {
        success,
        data,
        error: fetchError,
      } = await fetchBoarderDetailsData(id);
      if (success) {
        console.log(data);
        setBoarder(data); // single object
      } else {
        setError(fetchError || "Unknown error occurred");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boarderState?.id) {
      fetchBoarder(boarderState.id);
    }
  }, [boarderState.id]);

  const boarderFields = {
    "Personal Details": [
      { label: "Name", key: "full_name" },
      { label: "Birth Date", key: "date_of_birth" },
      { label: "Sex", key: "sex" },
      { label: "Address", key: "full_address" },
    ],
    "Contact Details": [
      { label: "Email Address", key: "email" },
      { label: "Phone Number", key: "phone_number" },
    ],
    "Academic Information": [
      { label: "Degree Program", key: "degree_program" },
      { label: "Year Level", key: "year_level" },
    ],
    "Boarding Details": [
      { label: "Room Number", key: "room_number" },
      { label: "Move-In Date", key: "move_in_date" },
      { label: "Move-Out Date", key: "move_out_date" },
      { label: "Status", key: "is_active" },
    ],
  };

  return (
    <Container>
      {error && (
        <Alert variant="danger" className="mb-2 py-2">
          {error}
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
            View Boarder Details
          </mark>
        </h3>
      </Row>

      <Row className="mb-3">
        <Col>
          <Card className="default-box-shadow rounded-4 p-3">
            <Container className="d-flex justify-content-between justify-content-lg-start align-items-center gap-3 mb-3 p-0">
              <h2 className="mb-0">{boarder.full_name}</h2>
              {boarder.is_active && (
                <Button variant="warning" disabled>
                  <FaEdit className="me-1" /> Edit
                </Button>
              )}
            </Container>
            {boarder && (
              <Row>
                <Col xs={12} md={3}>
                  <div
                    className="ratio ratio-1x1 mb-3 mb-lg-0 mx-auto"
                    style={{ maxWidth: "275px" }}
                  >
                    <img
                      src={boarder["profile_photo_url"]}
                      className="object-fit-cover"
                    />
                  </div>
                </Col>
                <Col xs={12} md={9}>
                  {Object.entries(boarderFields).map(
                    ([sectionName, fields]) => (
                      <Table
                        striped="columns"
                        bordered
                        key={sectionName}
                        className="mb-3"
                      >
                        <thead>
                          <tr>
                            <th colSpan={2} className="fw-bold">
                              {sectionName}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields
                            .filter(
                              ({ key }) =>
                                boarder[key] !== null &&
                                boarder[key] !== undefined &&
                                boarder[key] !== ""
                            )
                            .map(({ label, key }) => (
                              <tr key={key}>
                                <td className="w-25 fw-bold">
                                  <strong>{label}</strong>
                                </td>
                                <td>
                                  {key === "is_active" ? (
                                    <Badge
                                      bg={
                                        boarder[key] ? "success" : "secondary"
                                      }
                                    >
                                      {boarder[key] ? "Active" : "Inactive"}
                                    </Badge>
                                  ) : (
                                    boarder[key] ?? "-"
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    )
                  )}
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
