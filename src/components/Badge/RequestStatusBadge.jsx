import { Badge } from "react-bootstrap";

export default function RequestStatusBadge({ status }) {
  if (!status) return null;

  const normalizedStatus = status.toUpperCase();

  // Map status values to display text
  const statusLabels = {
    PENDING: "PENDING",
    IN_PROGRESS: "IN PROGRESS",
    RESOLVED: "RESOLVED",
    REJECTED: "REJECTED",
  };

  const statusVariants = {
    PENDING: "secondary",
    IN_PROGRESS: "warning",
    RESOLVED: "success",
    REJECTED: "danger",
  };

  const displayText = statusLabels[normalizedStatus] || normalizedStatus;
  const variant = statusVariants[normalizedStatus] || "light";

  return <Badge bg={variant}>{displayText}</Badge>;
}
