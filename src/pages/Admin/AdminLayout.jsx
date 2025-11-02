import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link, Outlet, NavLink } from "react-router-dom";
import { useAuthUser } from "../../context/authUserContext";
import "./Admin.css";

export default function AdminLayout() {
  const { user, loading } = useAuthUser();

  const getNavLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? "text-white fw-bold" : "text-white-50"}`;

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        {/* Sidebar — only visible on large screens */}
        <Col
          lg={2}
          className="sidebar text-white d-none d-lg-flex flex-column p-3 min-vh-100"
        >
          <h3 className="fw-bold mb-3 text-center">
            Hello, {user && user.first_name ? user.first_name : "Admin"}!
          </h3>

          <Nav className="flex-column mb-auto">
            {/* <NavLink to="/admin" className={getNavLinkClass}>
              Dashboard
            </NavLink> */}

            <NavLink to="/admin/boarders" className={getNavLinkClass}>
              Boarders
            </NavLink>

            <NavLink to="/admin/payments" className={getNavLinkClass}>
              Payments
            </NavLink>

            {/* <NavLink to="/admin/requests" className={getNavLinkClass}>
              Requests
            </NavLink> */}
          </Nav>
        </Col>

        {/* Main content area */}
        <Col lg={10} className="p-3">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
