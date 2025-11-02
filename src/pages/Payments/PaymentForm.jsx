import { fetchNameData } from "../../services/boarderService";
import {
  fetchPaymentMethodData,
  fetchPaymentTypeData,
} from "../../services/paymentService";

import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useFetch } from "../../hooks/useFetch";
import { usePaymentForm } from "../../hooks/forms/usePaymentForm";

import Container from "react-bootstrap/Container";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";

function PaymentForm() {
  useDocumentTitle("Payment Form");

  const {
    data: names,
    loading: nameLoading,
    error: nameError,
  } = useFetch(fetchNameData);

  const {
    data: types,
    loading: typeLoading,
    error: typeError,
  } = useFetch(fetchPaymentTypeData);

  const {
    data: methods,
    loading: methodLoading,
    error: methodError,
  } = useFetch(fetchPaymentMethodData);

  const {
    formData,
    submitting,
    submitError,
    submitSuccess,
    handleChange,
    handleSubmit,
  } = usePaymentForm();

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (submitError || submitSuccess || nameError || typeError || methodError) {
      setShowAlert(true);
    }
  }, [submitError, submitSuccess, nameError, typeError, methodError]);

  useEffect(() => {
    let timer;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showAlert]);

  const errorMessage = submitError || nameError || typeError || methodError;

  return (
    <Container className="mt-2 mb-3">
      {showAlert && (errorMessage || submitSuccess) && (
        <Alert
          variant={errorMessage ? "danger" : "success"}
          dismissible
          onClose={() => setShowAlert(false)}
          className="mt-3"
        >
          {errorMessage || submitSuccess}
        </Alert>
      )}

      {(nameLoading || typeLoading || methodLoading) && (
        <Spinner animation="border" />
      )}

      <Row className="py-3">
        <h1 className="fw-bold">
          <mark className="mark-pink text-white rounded-3">Payment Form</mark>
        </h1>
      </Row>

      <Row>
        <Col>
          <Card className="default-box-shadow rounded-4 p-3">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label className="fw-bold">
                  Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="boarder"
                  value={formData.boarder}
                  onChange={handleChange}
                  disabled={nameLoading || !!nameError}
                  required
                >
                  <option value="">Select a name</option>
                  {Array.isArray(names) &&
                    names.map((name) => (
                      <option key={name.id} value={name.id}>
                        {name.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAmount">
                <Form.Label className="fw-bold">
                  Amount <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPaymentType">
                <Form.Label className="fw-bold">
                  Payment for: <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="payment_type"
                  value={formData.payment_type}
                  onChange={handleChange}
                  disabled={typeLoading || !!typeError}
                  required
                >
                  <option value="">Select what you're paying for</option>
                  {Array.isArray(types) &&
                    types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPaymentMethod">
                <Form.Label className="fw-bold">
                  Payment Method <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  disabled={methodLoading || !!methodError}
                  required
                >
                  <option value="">Select a payment method</option>
                  {Array.isArray(methods) &&
                    methods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label className="fw-bold">Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Example: Payment for August"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formReceipt">
                <Form.Label className="fw-bold">
                  Upload your proof of payment or receipt here
                </Form.Label>
                <Form.Control
                  type="file"
                  name="receipt"
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Payment"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PaymentForm;
