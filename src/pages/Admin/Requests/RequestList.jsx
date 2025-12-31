import { Container, Button, Row, Col, Card, Form } from "react-bootstrap";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useFetch } from "../../../hooks/useFetch";
import { fetchNameData } from "../../../services/boarderService";
import {
  fetchRequestListData,
  fetchRequestTypeData,
} from "../../../services/requestService";
import { useEffect, useState } from "react";
import DynamicFormRow from "../Boarders/BoarderEdit/DynamicForm";
import DynamicTable from "../../../components/Table/DynamicTable";
import RequestStatusBadge from "../../../components/Badge/RequestStatusBadge";
import { FaEdit, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function RequestList() {
  const title = "View Requests";
  useDocumentTitle(title);

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    boarder: "",
    type: "",
    ref_no: "",
    sort: "",
    dir: "",
  });

  const [requests, setRequests] = useState([]);
  const [requestCount, setRequestCount] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("");

  const buildSearchParams = () => ({
    ...(filters.boarder && { boarder: filters.boarder }),
    ...(filters.type && { type: filters.type }),
    ...(filters.ref_no && { ref_no: filters.ref_no }),
    ...(filters.active ? { active: true } : {}),
  });

  const {
    data: nameData,
    loading: nameLoading,
    error: nameError,
  } = useFetch(fetchNameData);

  const {
    data: requestTypeData,
    loading: requestTypeLoading,
    error: requestTypeError,
  } = useFetch(fetchRequestTypeData);

  const fetchRequests = async (url = null, params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const {
        success,
        data,
        error: fetchError,
      } = await fetchRequestListData(url, params);
      if (success) {
        setRequests(data.results);
        setNextPage(data.next);
        setPrevPage(data.previous);
        setRequestCount(data.count);
      } else {
        setError(fetchError || "Failed to fetch data");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(null, buildSearchParams());
  }, []);

  const handleSearch = () => {
    const params = buildSearchParams();

    if (Object.keys(params).length === 0) {
      fetchRequests();
    }

    setSortKey("");
    setSortDirection("");

    fetchRequests(null, params);
  };

  const handleSort = (key, direction) => {
    setSortKey(key);
    setSortDirection(direction);

    // Build parameters including sorting
    const params = {
      ...buildSearchParams(),
      sort: key,
      dir: direction,
    };

    // Fetch sorted data
    fetchRequests(null, params);
  };

  // Pagination handlers
  const handlePrevPage = () => prevPage && fetchRequests(prevPage);
  const handleNextPage = () => nextPage && fetchRequests(nextPage);

  const searchFields = [
    {
      label: "Boarder",
      key: "boarder",
      type: "dropdown",
      options: (nameData ?? []).map((r) => ({
        value: r.id.toString(),
        label: r.name,
      })),
      colSpan: 4,
    },
    {
      label: "Request Type",
      key: "type",
      type: "dropdown",
      options: (requestTypeData ?? []).map((r) => ({
        value: r.value,
        label: r.label,
      })),
      colSpan: 4,
    },
    {
      label: "Reference Number",
      key: "ref_no",
      type: "text",
      placeholder: "7-digit Reference Number",
      colSpan: 4,
    },
    {
      label: "Show active requests only?",
      key: "active",
      type: "switch",
      checked: filters.active || false,
      onChange: (e) =>
        setFilters((prev) => ({
          ...prev,
          active: e.target.checked,
        })),
      colSpan: 4,
    },
  ];

  const tableColumns = [
    {
      key: "created_at",
      label: "Date Requested",
      type: "date",
      format: (value) =>
        new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      sortKey: "date",
    },
    {
      key: "reference_number",
      label: "Reference Number",
      type: "text",
      sortKey: "ref_no",
    },
    {
      key: "boarder_full_name",
      label: "Boarder",
      type: "text",
      sortKey: "boarder",
    },
    {
      key: "request_type",
      label: "Request Type",
      type: "badge",
      sortKey: "type",
    },
    {
      key: "status",
      label: "Status",
      type: "badge",
      badge: RequestStatusBadge,
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      type: "container",
      container: ({ row }) => (
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              navigate("/admin/requests/view", {
                state: { referenceNumber: row.reference_number },
              })
            }
          >
            <FaEye /> <span className="d-none d-md-inline">View</span>
          </Button>
          {/* <Button variant="warning" size="sm" onClick={() => {}}>
            <FaEdit /> <span className="d-none d-md-inline">Change Status</span>
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <Container>
      <Row className="py-3">
        <h3 className="fw-bold">
          <mark className="mark-pink text-white rounded-3">{title}</mark>
        </h3>
      </Row>

      <Card className="default-box-shadow rounded-4 p-3 mb-4">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <Row>
            <Col xs={12} md={11}>
              <DynamicFormRow
                fields={searchFields}
                formData={filters}
                boarder={{}}
                setFormData={setFilters}
              />
            </Col>
            <Col
              xs={12}
              md="auto"
              className="d-flex align-items-center mb-0 mb-md-2"
            >
              <Button variant="primary" type="submit">
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card className="default-box-shadow rounded-4 p-4">
        <DynamicTable
          columns={tableColumns}
          data={requests}
          loading={loading}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination={{
            count: requestCount,
            previous: prevPage,
            next: nextPage,
            onPrevious: handlePrevPage,
            onNext: handleNextPage,
          }}
        />
      </Card>
    </Container>
  );
}
