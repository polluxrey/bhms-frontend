import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";

import { useDocumentTitle } from "../../../../hooks/useDocumentTitle";
import { useFetch } from "../../../../hooks/useFetch";
import {
  fetchBoarderData,
  updateBoarder,
} from "../../../../services/boarderService";

import ProfilePhotoTab from "./ProfilePhotoTab";
import PersonalInfoTab from "./PersonalInfoTab";
import ContactDetailsTab from "./ContactDetailsTab";
import AcademicInfoTab from "./AcademicInfoTab";
import BoardingDetailsTab from "./BoardingDetailsTab";

export default function BoarderEdit() {
  useDocumentTitle("Edit Boarder Details");

  // Check for boarder data
  const location = useLocation();
  const navigate = useNavigate();
  const boarderState = location.state?.boarder;

  if (!boarderState) {
    return (
      <Container>
        <Button
          variant="link"
          className="text-decoration-none text-muted p-0 mb-3"
          onClick={() => navigate("/admin/boarders")}
        >
          <FaArrowLeft className="me-1" /> Back
        </Button>
        <p>No boarder data available.</p>
      </Container>
    );
  }

  // Fetch boarder details
  const {
    data: fetchedBoarder,
    loading: boarderLoading,
    error: boarderError,
  } = useFetch(fetchBoarderData, [boarderState?.id]);

  const [boarder, setBoarder] = useState(fetchedBoarder);
  const [formData, setFormData] = useState({});
  const [validated, setValidated] = useState(false);
  const [tabKey, setTabKey] = useState("profile-photo");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(boarderError || "");

  useEffect(() => {
    if (fetchedBoarder) {
      setBoarder(fetchedBoarder);
    }
  }, [fetchedBoarder]);

  const isStudent = (formData["role"] ?? boarder?.role ?? "") === "STUDENT";

  const handleSave = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    // Run client-side validation
    if (!form.checkValidity()) {
      setValidated(true);
      return false; // ❗ return false to indicate validation failed
    }

    setValidated(true);
    return true; // ❗ validation passed
  };

  const handleSubmit = async (e) => {
    const isValid = handleSave(e);
    if (!isValid) return; // stop if validation failed

    if (Object.keys(formData).length === 0) {
      setSuccessMessage("No changes.");
      return;
    }

    const response = await updateBoarder(boarder.id, formData);

    if (response.success) {
      setSuccessMessage("Changes saved!");
      setFormData({});
      setValidated(false);

      setBoarder((prev) => ({ ...prev, ...formData }));
    } else {
      setErrorMessage(response.error || "Save failed.");
    }
  };

  const handleTabSwitch = (newTab) => {
    if (newTab === "academic") {
      // Check if the role is currently STUDENT
      const isStudentRole =
        formData.role === "STUDENT" || boarder.role === "STUDENT";
      if (!isStudentRole) {
        alert(
          "You must set 'Is a Student?' to true before accessing Academic Information."
        );
        return; // prevent tab change
      }
    }

    if (Object.keys(formData).length > 0) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this tab?"
      );
      if (!confirmLeave) return;
    }

    setFormData({});
    setTabKey(newTab);
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (Object.keys(formData).length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData]);

  if (boarderLoading || !boarder) {
    return (
      <Container className="vh-100 d-flex flex-column justify-content-center align-items-center">
        <Spinner animation="border" role="status" variant="primary" />
        <div className="mt-2">Loading boarder data...</div>
      </Container>
    );
  }

  return (
    <Container>
      {successMessage && (
        <Alert variant="success" className="mb-2 py-2">
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="danger" className="mb-2 py-2">
          {errorMessage}
        </Alert>
      )}

      <Button
        variant="link"
        className="text-decoration-none text-muted p-0"
        onClick={() => navigate("/admin/boarders")}
      >
        <FaArrowLeft className="me-1" /> Back
      </Button>

      <Row className="pt-4 pb-3">
        <h3 className="fw-bold">
          <mark className="mark-pink text-white rounded-3">
            Edit Boarder Details
          </mark>
        </h3>
      </Row>

      <Row className="mb-3">
        <Col>
          <Card className="default-box-shadow rounded-4 p-3">
            <h2>
              {boarder?.last_name}
              {", "}
              {boarder?.first_name}{" "}
              {boarder?.middle_name ? boarder.middle_name + " " : ""}
            </h2>
            <Tabs
              activeKey={tabKey}
              onSelect={handleTabSwitch}
              className="mb-3"
            >
              <Tab eventKey="profile-photo" title="Profile Photo">
                <ProfilePhotoTab
                  boarderId={boarder?.id}
                  onSuccess={setSuccessMessage}
                  onError={setErrorMessage}
                />
              </Tab>
              <Tab eventKey="profile" title="Personal Details">
                <PersonalInfoTab
                  boarder={boarder}
                  formData={formData}
                  setFormData={setFormData}
                  handleSave={handleSubmit}
                  validated={validated}
                  setValidated={setValidated}
                />
              </Tab>
              <Tab eventKey="contact" title="Contact Details">
                <ContactDetailsTab
                  boarder={boarder}
                  formData={formData}
                  setFormData={setFormData}
                  handleSave={handleSubmit}
                  validated={validated}
                  setValidated={setValidated}
                />
              </Tab>
              {isStudent && (
                <Tab eventKey="academic" title="Academic Information">
                  <AcademicInfoTab
                    boarder={boarder}
                    formData={formData}
                    setFormData={setFormData}
                    handleSave={handleSubmit}
                    validated={validated}
                    setValidated={setValidated}
                  />
                </Tab>
              )}
              <Tab eventKey="boarding" title="Boarding Details">
                <BoardingDetailsTab
                  boarder={boarder}
                  formData={formData}
                  setFormData={setFormData}
                  handleSave={handleSubmit}
                  validated={validated}
                  setValidated={setValidated}
                />
              </Tab>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
