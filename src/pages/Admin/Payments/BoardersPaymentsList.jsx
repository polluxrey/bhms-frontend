import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { FaSortUp, FaSortDown, FaSort, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PaymentStatusBadge from "../../../components/Badge/PaymentStatusBadge";

export default function BoardersPaymentsList() {
  const title = "View Boarders Payments";
  useDocumentTitle(title);

  const navigate = useNavigate();

  const [boarders, setBoarders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [sortKey, setSortKey] = useState("status");
  const [sortDir, setSortDir] = useState("asc");
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [boarderCount, setBoarderCount] = useState(null);

  // Fetch boarders
  const fetchBoarders = async (url = null) => {
    setLoading(true);
    setError(null);

    try {
      let fetchUrl = url;
      const accessToken = localStorage.getItem("access_token");

      // Build default URL if not provided
      if (!fetchUrl) {
        const params = new URLSearchParams({
          sort_key: sortKey,
          sort_dir: sortDir,
        });
        if (searchName.trim()) params.append("search_name", searchName.trim());
        fetchUrl = `${
          import.meta.env.VITE_API_URL
        }/api/boarder/boarders-payments/?${params}`;
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
      setBoarders(data.results || data);
      setPrevPage(data.previous || null);
      setNextPage(data.next || null);
      setBoarderCount(data.boarderCount || data.count || null);
    } catch (error) {
      console.error("Error fetching boarders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load when sort or direction changes
  useEffect(() => {
    fetchBoarders();
  }, [sortKey, sortDir]);

  // Handle sorting click
  const handleSort = (key) => {
    if (sortKey === key) {
      // toggle direction if same column
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // reset to ascending when a new column is clicked
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const renderSortIcon = (key) => {
    if (sortKey !== key) return <FaSort className="ms-1 text-muted" />; // always show neutral icon
    return sortDir === "asc" ? (
      <FaSortUp className="ms-1 text-primary" />
    ) : (
      <FaSortDown className="ms-1 text-primary" />
    );
  };

  return (
    <Container>
      {error && (
        <Alert variant="danger" className="mb-2 py-2">
          {error}
        </Alert>
      )}

      <Row className="py-3">
        <h3 className="fw-bold">
          <mark className="mark-pink text-white rounded-3">{title}</mark>
        </h3>
      </Row>

      <Row className="mb-4">
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
      </Row>

      <Row className="mb-3">
        <Col>
          <Card className="default-box-shadow rounded-4 p-4">
            {loading ? (
              <div className="text-center p-4">
                <Spinner animation="border" />
              </div>
            ) : (
              <Table striped bordered hover responsive>
                <thead className="text-center">
                  <tr>
                    <th
                      onClick={() => handleSort("last_name")}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="d-inline-flex align-items-center w-100">
                        <span className="flex-grow-1 text-center">
                          Last Name
                        </span>
                        {renderSortIcon("last_name")}
                      </span>
                    </th>
                    <th
                      onClick={() => handleSort("first_name")}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="d-inline-flex align-items-center w-100">
                        <span className="flex-grow-1 text-center">
                          First Name
                        </span>
                        {renderSortIcon("first_name")}
                      </span>
                    </th>
                    <th
                      onClick={() => handleSort("last_payment_date")}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="d-inline-flex align-items-center w-100">
                        <span className="flex-grow-1 text-center">
                          Last Payment Date
                        </span>
                        {renderSortIcon("last_payment_date")}
                      </span>
                    </th>
                    <th
                      onClick={() => handleSort("status")}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="d-inline-flex align-items-center w-100">
                        <span className="flex-grow-1 text-center">Status</span>
                        {renderSortIcon("status")}
                      </span>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {boarders.length > 0 ? (
                    boarders.map((b) => (
                      <tr key={b.id}>
                        <td>{b.last_name}</td>
                        <td>{b.first_name}</td>
                        <td>{b.last_payment_date || "—"}</td>
                        <td>
                          {b.last_payment_status ? (
                            <PaymentStatusBadge
                              status={b.last_payment_status}
                            />
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              navigate("/admin/payments/boarder/view-all", {
                                state: { boarder: b },
                              })
                            }
                          >
                            <FaEye />{" "}
                            <span className="d-none d-md-inline">
                              View Payments
                            </span>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No boarders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}

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
