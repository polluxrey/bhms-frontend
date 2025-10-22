import { useContext } from "react";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

import { ConfigDataContext } from "../../context/configDataContext";

import { Spinner } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import "./NavigationBar.css";

function AppHeader() {
  const primaryLinks = (
    <>
      {/* <NavLink as={Link} to="/about">
        About
      </NavLink> */}
    </>
  );

  // CTA/Login Button (passed as a single element)
  const loginButton = (
    <Button
      className="btn-login fw-bold rounded-3"
      as={Link}
      to="/login"
      disabled
    >
      LOGIN
    </Button>
  );

  const { branding, brandingLoading, brandingError } =
    useContext(ConfigDataContext);

  if (brandingLoading) {
    return (
      <NavigationBar
        appName={<Spinner animation="border" />}
        navLinks={primaryLinks}
        ctaContent={loginButton}
      />
    );
  }

  if (brandingError) {
    return <NavigationBar navLinks={primaryLinks} ctaContent={loginButton} />;
  }

  return (
    <NavigationBar
      appName={branding?.app_name}
      navLinks={primaryLinks}
      ctaContent={loginButton}
    />
  );
}

export default AppHeader;
