import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

export default function NavigationBar({
  appName = "Boarding House Management System",
  navLinks,
  ctaContent,
}) {
  const collapseId = "responsive-navbar-nav";

  return (
    <Navbar expand="lg" className="navbar-dark mb-2">
      <Container>
        <Navbar.Brand className="fw-bold" as={Link} to="/">
          {appName}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls={collapseId} />

        <Navbar.Collapse id={collapseId}>
          {/* Main Navigation Links (Pushed to the left) */}
          <Nav className="me-auto">{navLinks}</Nav>

          {/* CTA / Login Button (Pushed to the far right) */}
          <Nav>{ctaContent}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
