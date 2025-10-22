import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./ActionCard.css";

export default function ActionCard({
  title,
  text,
  imageSrc,
  imageAlt = "", // Added for accessibility
  to, // For internal routing
  onClick, // For arbitrary click events
  isDisabled = false,
  actionLabel = "View",
}) {
  // Only show button if there's a link or click handler
  const showButton = !!to || !!onClick;
  const buttonVariant = isDisabled ? "secondary" : "primary";
  const cardOpacityClass = isDisabled ? "opacity-25" : "";

  // Decide which component to use for the button
  // 'button' is a string for the default HTML element
  const ButtonComponent = to ? Link : "button";
  const buttonProps = to
    ? { as: ButtonComponent, to: to } // Props for Link
    : { onClick: onClick }; // Props for standard Button

  return (
    <Card
      className={`action-card default-box-shadow ${cardOpacityClass} h-100 rounded-4`}
    >
      {/* Check that imageSrc is provided and truthy */}
      {imageSrc && (
        <Card.Img
          variant="top"
          src={imageSrc}
          alt={imageAlt || title} // Use title as fallback alt text
        />
      )}
      <Card.Body>
        <Card.Title className="fw-bold">{title}</Card.Title>
        <Card.Text>{text}</Card.Text>

        {/* Only render the button if an action is defined */}
        {showButton && (
          <Button
            variant={buttonVariant}
            disabled={isDisabled}
            {...buttonProps} // Spread either the Link or onClick props
          >
            {actionLabel}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
