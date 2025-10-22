import React, { useState, useRef, useCallback, useEffect } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

const OTPInput = ({ onComplete, isSubmitting, length = 6 }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    const fullOtp = otp.join("");
    onComplete(fullOtp.length === length ? fullOtp : "");
  }, [otp, length, onComplete]);

  const handleChange = useCallback(
    (e, index) => {
      const value = e.target.value;
      if (isNaN(value) || value.length > 1) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp, length]
  );

  const handleKeyDown = useCallback(
    (e, index) => {
      switch (e.key) {
        case "Backspace":
        case "Delete":
          e.preventDefault();
          const newOtp = [...otp];
          let focusIndex = index;

          if (otp[index] !== "") {
            newOtp[index] = "";
          } else if (index > 0) {
            newOtp[index - 1] = "";
            focusIndex = index - 1;
          }

          setOtp(newOtp);
          inputRefs.current[focusIndex]?.focus();
          break;

        case "ArrowLeft":
          if (index > 0) {
            e.preventDefault();
            inputRefs.current[index - 1]?.focus();
          }
          break;

        case "ArrowRight":
          if (index < length - 1) {
            e.preventDefault();
            inputRefs.current[index + 1]?.focus();
          }
          break;

        default:
          break;
      }
    },
    [otp, length]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData("text/plain").trim();
      if (pasteData.length === length && /^\d+$/.test(pasteData)) {
        const newOtp = pasteData.split("");
        setOtp(newOtp);
        inputRefs.current[length - 1]?.focus();
        inputRefs.current[length - 1]?.select();
      }
    },
    [length]
  );

  return (
    <Container className="d-flex justify-content-center" onPaste={handlePaste}>
      <Row className="g-2 justify-content-center">
        {otp.map((digit, index) => (
          <Col key={index} xs={2} sm={2} style={{ maxWidth: "60px" }}>
            <Form.Control
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              disabled={isSubmitting}
              className={`text-center fs-3 fw-bold rounded-3 ${
                isSubmitting ? "bg-light" : ""
              }`}
              style={{ height: "60px" }}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default OTPInput;
