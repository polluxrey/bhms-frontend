import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

export default function NavigationBar({
  appName = "Boarding House Management System",
  navLinks,
  roleModules,
  ctaContent,
  onBrandClick,
}) {
  const collapseId = "responsive-navbar-nav";

  return (
    <Navbar expand="lg" className="navbar-dark">
      <Container>
        <Navbar.Brand
          className="fw-bold"
          onClick={onBrandClick}
          style={{ cursor: "pointer" }}
        >
          {appName}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls={collapseId} />

        <Navbar.Collapse id={collapseId}>
          {/* Main navigation links */}
          <Nav className="me-auto">{navLinks}</Nav>

          {/* Role-based modules (visible on small screens only) */}
          <Nav className="mt-2 mt-lg-0 d-lg-none">{roleModules}</Nav>

          {/* CTA buttons (e.g., login/logout, visible on small screens only) */}
          <Nav className="mt-2 mt-lg-0 ms-lg-auto">{ctaContent}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
