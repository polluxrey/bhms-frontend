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
import { FaEye, FaEdit, FaPlus } from "react-icons/fa";
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [roomChoices, setRoomChoices] = useState([]);

  const fetchBoarders = async (params = {}, url = null) => {
    setLoading(true);
    setError(null);
    try {
      const {
        success,
        data,
        error: fetchError,
      } = await fetchBoarderListData(url, params);
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

  const fetchRoomChoices = async () => {
    const url = `${import.meta.env.VITE_API_URL}/api/boarder/rooms`;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      setRoomChoices(data);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoarders();
  }, []);

  useEffect(() => {
    fetchRoomChoices();
  }, []);

  const buildSearchParams = () => {
    const params = {
      ...(firstName && { first_name: firstName }),
      ...(lastName && { last_name: lastName }),
      ...(roomNumber && { room_number: roomNumber }),
    };

    return params;
  };

  const handleSearch = () => {
    const params = buildSearchParams();

    if (Object.keys(params).length === 0) {
      // No filters → don't fetch
      fetchBoarders();
    }

    fetchBoarders(params);
  };

  return (
    <Container>
      {error && (
        <Alert variant="danger" className="mb-2 py-2">
          {error}
        </Alert>
      )}

      <Row className="py-3 align-items-center">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="fw-bold mb-0">
            <mark className="mark-pink text-white rounded-3">
              View Boarders
            </mark>
          </h3>
          <Button
            variant="primary"
            onClick={() => navigate("/admin/boarders/add")}
          >
            <FaPlus /> <span className="d-none d-md-inline">Add Boarder</span>
          </Button>
        </div>
      </Row>

      {/* <Row className="mb-4">
        <Col>
          <Card className="default-box-shadow rounded-4 p-4">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                fetchBoarders();
              }}
            >
              <Form.Label className="fw-bold">Search by Name</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Enter name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <Button variant="primary" type="submit">
                  Search
                </Button>
              </InputGroup>
            </Form>
          </Card>
        </Col>
      </Row> */}

      <Row className="mb-4">
        <Col>
          <Card className="default-box-shadow rounded-4 p-4">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <Form.Group as={Row} className="align-items-end">
                <Col xs={12} md={4} className="mb-2 mb-md-0">
                  <Form.Label className="fw-bold">First Name</Form.Label>
                  <Form.Control
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Col>

                <Col xs={12} md={4} className="mb-2 mb-md-0">
                  <Form.Label className="fw-bold">Last Name</Form.Label>
                  <Form.Control
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Col>

                <Col xs={12} md={3}>
                  <Form.Label className="fw-bold">Room Number</Form.Label>
                  <Form.Select
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    disabled={loading || !!error}
                  >
                    <option value="">Select a room</option>

                    {roomChoices.map((choice) => (
                      <option key={choice.value} value={choice.value}>
                        {choice.label}
                      </option>
                    ))}
                  </Form.Select>
                </Col>

                <Col xs={12} md="auto" className="d-flex align-items-end mt-3">
                  <Button variant="primary" type="submit">
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
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() =>
                              navigate("/admin/boarders/edit", {
                                state: { boarder },
                              })
                            }
                          >
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
