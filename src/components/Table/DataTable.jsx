// src/components/common/DataTable.jsx
import React from "react";
import { Table, Spinner, Alert, Button } from "react-bootstrap";

/**
 * General-purpose data table component with optional pagination.
 *
 * Props:
 * - columns: array of { key, label }
 * - data: array of objects
 * - loading, error, emptyMessage: state management
 * - bordered, striped, hover: styling
 * - pagination:
 *   - count: total records (optional)
 *   - next: boolean | string (URL or true/false)
 *   - previous: boolean | string (URL or true/false)
 *   - onNext: function → called when "Next" clicked
 *   - onPrevious: function → called when "Previous" clicked
 *   - pageSize: number (optional)
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  error = "",
  emptyMessage = "No records found.",
  bordered = true,
  striped = true,
  hover = true,
  count = null,
  next = null,
  previous = null,
  onNext = null,
  onPrevious = null,
  pageSize = 10,
}) {
  if (loading) {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!data || data.length === 0) {
    return <p className="mb-0">{emptyMessage}</p>;
  }

  const currentPage =
    count && pageSize
      ? Math.ceil(previous ? (count - (count % pageSize)) / pageSize : 1)
      : null;

  return (
    <>
      <Table
        bordered={bordered}
        striped={striped}
        hover={hover}
        responsive
        className="align-middle"
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map((col) => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {(onNext || onPrevious) && (
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>
            {count !== null && (
              <small className="text-muted">
                Showing {data.length} of {count} records
              </small>
            )}
          </div>
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
        </div>
      )}
    </>
  );
}
