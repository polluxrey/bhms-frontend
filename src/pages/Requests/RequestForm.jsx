import { fetchNameData } from "../../services/boarderService";

import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useFetch } from "../../hooks/useFetch";
import { useRequestForm } from "../../hooks/forms/useRequestForm";

import Container from "react-bootstrap/Container";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { fetchRequestTypeData } from "../../services/requestService";

function RequestForm() {
  useDocumentTitle("Request Form");

  const {
    data: names,
    loading: nameLoading,
    error: nameError,
  } = useFetch(fetchNameData);

  const {
    data: requestTypes,
    loading: requestTypeLoading,
    error: requestTypeError,
  } = useFetch(fetchRequestTypeData);

  const {
    formData,
    submitting,
    submitError,
    submitSuccess,
    handleChange,
    handleSubmit,
  } = useRequestForm();

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (submitError || submitSuccess || nameError) {
      setShowAlert(true);
    }
  }, [submitError, submitSuccess, nameError]);

  // useEffect(() => {
  //   let timer;
  //   if (showAlert) {
  //     timer = setTimeout(() => {
  //       setShowAlert(false);
  //     }, 5000);
  //   }
  //   return () => clearTimeout(timer);
  // }, [showAlert]);

  const errorMessage = submitError || nameError;

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

      {nameLoading && <Spinner animation="border" />}

      <Row className="py-3">
        <h1 className="fw-bold">
          <mark className="mark-pink text-white rounded-3">Request Form</mark>
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
                  <option value="">Select your name</option>
                  {Array.isArray(names) &&
                    names.map((name) => (
                      <option key={name.id} value={name.id}>
                        {name.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formRequestType">
                <Form.Label className="fw-bold">
                  Type of Request <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="request_type"
                  value={formData.request_type}
                  onChange={handleChange}
                  disabled={requestTypeLoading || !!requestTypeError}
                  required
                >
                  <option value="">Select type of your request</option>
                  {Array.isArray(requestTypes) &&
                    requestTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label className="fw-bold">
                  Description <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Enter details of your request here."
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAttachment">
                <Form.Label className="fw-bold">Attach a Photo Here</Form.Label>
                <Form.Control
                  type="file"
                  name="attachment"
                  accept="image/*"
                  onChange={handleChange}
                />
              </Form.Group>

              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      <Modal
        show={submitting}
        backdrop="static"
        keyboard={false}
        className="text-center"
        centered
      >
        <Modal.Body>
          <Spinner
            animation="border"
            role="status"
            size="lg"
            className="mr-3"
          />
          <p className="mt-2 mb-0">Submitting request...</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default RequestForm;
