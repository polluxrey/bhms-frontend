import { Badge } from "react-bootstrap";

export default function PaymentStatusBadge({ status }) {
  if (!status) return null;

  const normalizedStatus = status.toUpperCase();
  let variant = "light";
  let displayText = normalizedStatus;

  switch (normalizedStatus) {
    case "PENDING":
      variant = "warning";
      displayText = "PENDING REVIEW";
      break;
    case "CONFIRMED":
      variant = "success";
      break;
    case "REFUNDED":
      variant = "secondary";
      break;
    default:
      variant = "light";
      break;
  }

  return <Badge bg={variant}>{displayText}</Badge>;
}
