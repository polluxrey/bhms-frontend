import { Badge } from "react-bootstrap";

export default function RequestStatusBadge({ status }) {
  if (!status) return null;

  const normalizedStatus = status.toUpperCase();
  let variant = "light";
  let displayText = normalizedStatus;

  switch (normalizedStatus) {
    case "PENDING":
      variant = "secondary";
      break;
    case "IN_PROGRESS":
      variant = "warning";
      break;
    case "RESOLVED":
      variant = "success";
      break;
    case "REJECTED":
      variant = "danger";
      break;
    default:
      variant = "light";
      break;
  }

  return <Badge bg={variant}>{displayText}</Badge>;
}
