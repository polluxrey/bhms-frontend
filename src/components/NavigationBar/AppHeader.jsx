import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

import { useConfigData } from "../../context/configDataContext";
import { useAuthUser } from "../../context/authUserContext";

import { Spinner, Nav } from "react-bootstrap";
import Button from "react-bootstrap/Button";

import NavigationBar from "./NavigationBar";
import "./NavigationBar.css";
import LoginModal from "../../pages/Login/LoginModal";

function AppHeader() {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const { user, isLoggedIn, logout, loading: authLoading } = useAuthUser();
  const { branding, brandingLoading, brandingError } = useConfigData();

  const handleOpenLogin = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);

  const handleLoginSuccess = () => {
    handleCloseLogin();

    if (user?.role === "admin" || user?.role === "owner") {
      navigate("/admin");
    } else if (user?.role === "boarder") {
      navigate("/boarder");
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleNavClick = () => {
    if (user?.role === "admin" || user?.role === "owner") {
      navigate("admin/boarders");
    } else {
      navigate("/");
    }
  };

  // CTA/Login Button
  const loginButton = (
    <Button className="btn-login fw-bold rounded-3" onClick={handleOpenLogin}>
      LOGIN
    </Button>
  );

  const logoutButton = (
    <Button className="btn-login fw-bold rounded-3" onClick={handleLogout}>
      LOGOUT
    </Button>
  );

  let ctaButton;

  if (authLoading) {
    ctaButton = <Spinner animation="border" size="sm" variant="light" />;
  } else if (isLoggedIn) {
    ctaButton = logoutButton;
  } else {
    ctaButton = loginButton;
  }

  const primaryLinks = (
    <>
      {/* <NavLink as={Link} to="/about">
        About
      </NavLink> */}
    </>
  );

  const getNavLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? "text-white fw-bold" : "text-white-50"}`;

  const getRoleModules = () => {
    if (!isLoggedIn) return null;

    console.log(`User role: ${user?.role}`);

    switch (user?.role) {
      case "admin":
      case "owner":
        return (
          <>
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <NavigationBar
        appName={
          brandingLoading ? (
            <Spinner animation="border" />
          ) : brandingError ? (
            "Boarding House Management System"
          ) : (
            branding?.app_name
          )
        }
        navLinks={primaryLinks}
        roleModules={getRoleModules()}
        ctaContent={ctaButton}
        onBrandClick={handleNavClick}
      />
      <LoginModal
        show={showLogin}
        handleClose={handleCloseLogin}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default AppHeader;
