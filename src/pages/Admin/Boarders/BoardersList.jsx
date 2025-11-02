import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBoarderListData } from "../../../services/boarderService";

export default function BoardersList() {
  useDocumentTitle("View Boarders");

  const navigate = useNavigate();
  const boarderState = location.state?.boarder;

  const [boarders, setBoarders] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [boarderCount, setBoarderCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBoarders = async (url = null) => {
    setLoading(true);
    setError(null);
    try {
      const {
        success,
        data,
        error: fetchError,
      } = await fetchBoarderListData(url);
      if (success) {
        setBoarders(data.results);
        setNextPage(data.next);
        setPrevPage(data.previous);
        setBoarderCount(data.count);
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
    fetchBoarders();
  }, []);

  return (
    <Container>
      {error && (
        <Alert variant="danger" className="mb-2 py-2">
          {error}
        </Alert>
      )}

      <Row className="py-3">
        <h3 className="fw-bold">
          <mark className="mark-pink text-white rounded-3">View Boarders</mark>
        </h3>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="default-box-shadow rounded-4 p-4">
            <Form>
              <Form.Group
                as={Row}
                className="align-items-end"
                controlId="formGuestInfo"
              >
                <Col xs={12} md={4} className="mb-2 mb-md-0">
                  <Form.Label className="fw-bold">First Name</Form.Label>
                  <Form.Control placeholder="Enter first name" disabled />
                </Col>

                <Col xs={12} md={4} className="mb-2 mb-md-0">
                  <Form.Label className="fw-bold">Last Name</Form.Label>
                  <Form.Control placeholder="Enter last name" disabled />
                </Col>

                <Col xs={12} md={3}>
                  <Form.Label className="fw-bold">Room Number</Form.Label>
                  <Form.Control placeholder="Enter room number" disabled />
                </Col>

                <Col xs={12} md="auto" className="d-flex align-items-end mt-3">
                  <Button variant="primary" type="submit" disabled>
                    Search
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </Card>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Card className="default-box-shadow rounded-4 p-4">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Room Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {boarders.map((boarder, idx) => (
                  <tr key={idx}>
                    <td>{boarder.full_name}</td>
                    <td>{boarder.room_number}</td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            navigate("/admin/boarders/view", {
                              state: { boarder },
                            })
                          }
                        >
                          <FaEye />{" "}
                          <span className="d-none d-md-inline">View</span>
                        </Button>
                        {boarder.is_active && (
                          <Button variant="warning" size="sm" disabled>
                            <FaEdit />{" "}
                            <span className="d-none d-md-inline">Edit</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {(prevPage || nextPage) && (
              <div className="d-flex justify-content-between align-items-center mt-2">
                <div>
                  {boarderCount !== null && (
                    <small className="text-muted">
                      Showing {boarders.length} of {boarderCount} records
                    </small>
                  )}
                </div>
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
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
