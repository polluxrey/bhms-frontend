import { useContext, useEffect, useState } from "react";
import { ConfigDataContext } from "../../context/configDataContext";
import "./Home.css";
import { Col, Container, Row } from "react-bootstrap";

const HeroSection = () => {
  const { branding, brandingLoading, brandingError } =
    useContext(ConfigDataContext);

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning!");
    else if (hour < 18) setGreeting("Good afternoon!");
    else setGreeting("Good evening!");
  }, []);

  return (
    <section className="py-4 border-bottom">
      <Container>
        <Row className="justify-content-center text-center">
          <Col>
            {/* <h3 className="text-muted mb-3">{greeting}</h3> */}
            <h1 className="display-5 fw-bold mb-3">
              👋 Welcome to{" "}
              <mark className="mark-pink text-white rounded-3">
                {branding?.app_name}
              </mark>
            </h1>
            <h4 className="text-muted">
              Manage your stay, send payments, and report concerns — all in one
              place.
            </h4>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
