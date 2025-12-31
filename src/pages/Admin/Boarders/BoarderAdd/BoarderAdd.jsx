import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";

import { useDocumentTitle } from "../../../../hooks/useDocumentTitle";
import { useFetch } from "../../../../hooks/useFetch";
import { usePhilippineAddress } from "../../../../hooks/forms/usePhilippineAddress";
import {
  createBoarder,
  fetchAcademicProgramData,
  fetchRoomData,
  fetchSchoolData,
  fetchYearLevelData,
} from "../../../../services/boarderService";
import NewBoarderPhoto from "./NewBoarderPhoto";
import DynamicFormRow from "../BoarderEdit/DynamicForm";

export default function BoarderForm() {
  useDocumentTitle("Add New Boarder");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Philippine address hooks
  const {
    regionData,
    provinceData,
    cityData,
    barangayData,
    handleRegionChange,
    handleProvinceChange,
    handleCityChange,
    handleBarangayChange,
  } = usePhilippineAddress(formData, setFormData);

  // Fetching external data
  const { data: schoolData } = useFetch(fetchSchoolData);
  const { data: academicProgramData } = useFetch(fetchAcademicProgramData);
  const { data: yearLevelData } = useFetch(fetchYearLevelData);
  const { data: roomData } = useFetch(fetchRoomData);

  const handleRoleSwitch = (e) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.checked ? "STUDENT" : "",
    }));
  };

  // Clear messages after 5s
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Warn on page unload if form has changes
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

  // Define all form sections and fields dynamically
  const fields = [
    {
      title: "Personal Information",
      fields: [
        {
          label: "Last Name",
          key: "last_name",
          type: "text",
          required: true,
          colSpan: 4,
        },
        {
          label: "First Name",
          key: "first_name",
          type: "text",
          required: true,
          colSpan: 4,
        },
        {
          label: "Middle Name",
          key: "middle_name",
          type: "text",
          colSpan: 4,
        },
        {
          label: "Birth Date",
          key: "date_of_birth",
          type: "date",
          required: true,
          colSpan: 4,
        },
        {
          label: "Sex",
          key: "sex",
          type: "dropdown",
          required: true,
          options: [
            { value: "M", label: "Male" },
            { value: "F", label: "Female" },
            { value: "O", label: "Other / Prefer not to say" },
          ],
          colSpan: 4,
        },
        {
          label: "Region",
          key: "region",
          type: "dropdown",
          required: true,
          onChange: handleRegionChange,
          options: regionData.map((r) => ({
            value: r.region_code,
            label: r.region_name,
          })),
          colSpan: 4,
        },
        {
          label: "Province",
          key: "province",
          type: "dropdown",
          required: true,
          onChange: handleProvinceChange,
          options: provinceData.map((p) => ({
            value: p.province_code,
            label: p.province_name,
          })),
          colSpan: 4,
        },
        {
          label: "City / Municipality",
          key: "city",
          type: "dropdown",
          required: true,
          onChange: handleCityChange,
          options: cityData.map((c) => ({
            value: c.city_code,
            label: c.city_name,
          })),
          colSpan: 4,
        },
        {
          label: "Barangay",
          key: "barangay",
          type: "dropdown",
          required: true,
          onChange: handleBarangayChange,
          options: barangayData.map((b) => ({
            value: b.brgy_code,
            label: b.brgy_name,
          })),
          colSpan: 4,
        },
        {
          label: "Is a Student?",
          key: "role",
          type: "switch",
          onChange: handleRoleSwitch,
          colSpan: 4,
        },
      ],
    },
    {
      title: "Contact Details",
      fields: [
        {
          label: "Email Address",
          key: "email",
          type: "text",
          required: true,
          colSpan: 6,
        },
        {
          label: "Phone Number",
          key: "phone_number",
          type: "phone",
          prefix: "+63",
          required: true,
          placeholder: "9123456789",
          colSpan: 6,
        },
      ],
    },
    {
      title: "Academic Information",
      fields: [
        {
          label: "School",
          key: "school",
          type: "dropdown",
          required: true,
          options: (schoolData ?? []).map((s) => ({
            value: s.value,
            label: s.label,
          })),
          colSpan: 4,
        },
        {
          label: "Degree Program",
          key: "degree_program",
          type: "dropdown",
          required: true,
          options: (academicProgramData ?? []).map((p) => ({
            value: p.value,
            label: p.label,
          })),
          colSpan: 4,
        },
        {
          label: "Year Level",
          key: "year_level",
          type: "dropdown",
          required: true,
          options: (yearLevelData ?? []).map((l) => ({
            value: l.value,
            label: l.label,
          })),
          colSpan: 4,
        },
      ],
    },
    {
      title: "Boarding Details",
      fields: [
        {
          label: "Room Number",
          key: "room_number",
          type: "dropdown",
          required: true,
          options: (roomData ?? []).map((r) => ({
            value: r.value,
            label: r.label,
          })),
          colSpan: 4,
        },
        {
          label: "Move-In Date",
          key: "move_in_date",
          type: "date",
          required: true,
          colSpan: 4,
        },
      ],
    },
  ];

  const [validated, setValidated] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    // Run client-side validation
    if (!form.checkValidity()) {
      setValidated(true);
      return false;
    }

    setValidated(true);
    return true;
  };

  const handleSubmit = async (e) => {
    const isValid = handleSave(e);
    if (!isValid) return; // stop if validation failed

    if (Object.keys(formData).length === 0) {
      setSuccessMessage("No changes.");
      return;
    }

    const response = await createBoarder(formData);

    if (response.data?.id) {
      const newId = response.data.id;

      setSuccessMessage("Changes saved!");
      setFormData({});
      setValidated(false);

      navigate("/admin/boarders/view", {
        state: {
          boarder: { id: newId },
          message: "Boarder created successfully!",
        },
      });
    } else {
      setErrorMessage(response.error || "Save failed.");
    }
  };

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

      <Row className="py-3">
        <h3 className="fw-bold">
          <mark className="mark-pink text-white rounded-3">
            Add New Boarder
          </mark>
        </h3>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="default-box-shadow rounded-4 p-4">
            <Form noValidate validated={validated}>
              <Row>
                <Col xs={12} lg={4} className="mb-2 mb-md-0">
                  <NewBoarderPhoto
                    onPhotoChange={(file) =>
                      setFormData((prev) => ({ ...prev, photo: file }))
                    }
                  />
                </Col>

                <Col xs={12} lg={8}>
                  {fields.map((section) => {
                    if (
                      section.title === "Academic Information" &&
                      formData.role !== "STUDENT"
                    ) {
                      return null;
                    }

                    return (
                      <div key={section.title} className="mb-4">
                        <h5 className="mb-2">
                          <mark className="mark-pink text-white rounded-3">
                            {section.title}
                          </mark>
                        </h5>
                        <DynamicFormRow
                          fields={section.fields}
                          formData={formData}
                          boarder={{}}
                          setFormData={setFormData}
                        />
                      </div>
                    );
                  })}
                </Col>
              </Row>
              <div className="d-flex justify-content-center gap-3">
                <Button variant="secondary" onClick={handleSave}>
                  Validate
                </Button>

                <Button variant="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
