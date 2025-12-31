import { Button, Spinner, Table, Badge as DefaultBadge } from "react-bootstrap";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

export default function DynamicTable({
  columns = [],
  data = [],
  loading = false,
  sortKey = null,
  sortDirection = "asc",
  onSort = null,
  pagination = {},
  tableOptions = {},
}) {
  const {
    count = null,
    next = null,
    previous = null,
    onNext = null,
    onPrevious = null,
  } = pagination;

  const {
    showHeader = true,
    striped = true,
    headerAlign = "center",
    bodyAlign = "center",
  } = tableOptions;

  const handleSort = (key) => {
    if (!onSort) return;

    // Toggle direction if same column is clicked
    let direction = "asc";
    if (sortKey === key && sortDirection === "asc") {
      direction = "desc";
    }

    console.log(key, direction);

    onSort(key, direction);
  };

  const renderSortIcon = (key) => {
    if (sortKey !== key) return <FaSort className="ms-1 text-muted" />;

    return sortDirection === "asc" ? (
      <FaSortUp className="ms-1 text-primary" />
    ) : (
      <FaSortDown className="ms-1 text-primary" />
    );
  };

  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center py-2">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Table striped={striped} bordered hover responsive>
            {showHeader && (
              <thead className={`text-${headerAlign}`}>
                <tr>
                  {columns.map((col) => {
                    const sortField = col.sortKey ?? col.key;
                    const isSortable =
                      data.length > 1 && (col.sortable ?? true);

                    return (
                      <th
                        key={col.key}
                        onClick={() => isSortable && handleSort(sortField)}
                        style={{
                          cursor: isSortable ? "pointer" : "default",
                        }}
                      >
                        <span className="d-flex align-items-center w-100">
                          <span className="mx-auto">{col.label}</span>
                          {isSortable && renderSortIcon(sortField)}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
            )}
            <tbody>
              {data.length > 0 ? (
                data.map((row, i) => (
                  <tr key={i} className={`text-${bodyAlign}`}>
                    {columns.map((col, j) => {
                      {
                        /*
                        let cellValue = row[col.key];

                        if (col.type === "date" && cellValue) {
                          if (typeof col.format === "function") {
                            cellValue = col.format(cellValue);
                          } else {
                            cellValue = new Date(cellValue).toLocaleDateString(
                              col.format || "en-US"
                            );
                          }
                        } else if (col.type === "badge") {
                          const Badge = col.badge;
                          cellValue = <Badge {...{ [col.key]: cellValue }} />;
                        } else if (col.type === "container") {
                          const Container = col.container;
                          cellValue = (
                            <Container row={row}>{cellValue}</Container>
                          );
                        }
                        */
                      }

                      let cellValue = row[col.key];

                      const type = col.type || row.type;

                      if (type) {
                        if (type === "date") {
                          const format = col.format || row.format;

                          if (typeof format === "function") {
                            cellValue = format(cellValue);
                          } else {
                            cellValue = new Date(cellValue).toLocaleDateString(
                              format || "en-US"
                            );
                          }
                        } else if (type === "badge") {
                          const BadgeComponent =
                            col.badge || row.badge || DefaultBadge;

                          const propName = row.key ?? col.key;

                          if (BadgeComponent === DefaultBadge) {
                            cellValue = (
                              <BadgeComponent bg="primary">
                                {cellValue}
                              </BadgeComponent>
                            );
                          } else {
                            cellValue = (
                              <BadgeComponent {...{ [propName]: cellValue }} />
                            );
                          }
                        } else if (type === "container") {
                          const Container =
                            row.container || col.container || (() => cellValue);

                          cellValue = (
                            <Container row={row}>{cellValue}</Container>
                          );
                        }
                      }

                      return (
                        <td
                          key={j}
                          className={`fw-${
                            col.fontWeight === "bold" ? "bold" : "normal"
                          }`}
                        >
                          {cellValue}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center text-muted fst-italic"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center">
            {count !== null && (
              <small className="text-muted">
                Showing {data.length} of {count} records
              </small>
            )}
            {(onPrevious || onNext) && (
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  disabled={!previous}
                  onClick={onPrevious}
                >
                  Previous
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  disabled={!next}
                  onClick={onNext}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
