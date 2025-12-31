import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { usePhilippineAddress } from "../../../../hooks/forms/usePhilippineAddress";
import { chunkFields } from "../../../../../utils/chunkFields";
import DynamicFormRow from "./DynamicForm";
import { useFormValidation } from "../../../../hooks/useFormValidation";

export default function PersonalInfoTab({
  boarder,
  formData,
  setFormData,
  handleSave,
  validated,
  setValidated,
}) {
  console.log("Current formData:", formData);

  const [initialAddressData, setInitialAddressData] = useState({});

  useEffect(() => {
    if (boarder) {
      setInitialAddressData({
        region: boarder.region,
        province: boarder.province,
        city: boarder.city,
        barangay: boarder.barangay,
      });
    }
  }, [boarder]);

  // useEffect(() => {
  //   setFormData({});
  // }, []);

  const {
    regionData,
    provinceData,
    cityData,
    barangayData,
    handleRegionChange,
    handleProvinceChange,
    handleCityChange,
    handleBarangayChange,
  } = usePhilippineAddress(formData, setFormData, initialAddressData);

  const isStudent = (formData["role"] ?? boarder["role"] ?? "") === "STUDENT";
  const handleRoleSwitch = (e) => {
    const isChecked = e.target.checked;

    setFormData((prev) => ({
      ...prev,
      role: isChecked ? "STUDENT" : "",
    }));
  };

  const fields = [
    {
      label: "Last Name",
      key: "last_name",
      type: "text",
      required: true,
      placeholder: "Last name",
      colSpan: 4,
    },
    {
      label: "First Name",
      key: "first_name",
      type: "text",
      required: true,
      placeholder: "First name",
      colSpan: 4,
    },
    {
      label: "Middle Name",
      key: "middle_name",
      type: "text",
      placeholder: "Middle name",
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
      checked: isStudent,
      type: "switch",
      onChange: handleRoleSwitch,
      colSpan: 4,
    },
  ];

  const fieldRows = chunkFields(fields, 3);

  return (
    <Form noValidate validated={validated} onSubmit={handleSave}>
      {fieldRows.map((row, i) => (
        <DynamicFormRow
          key={i}
          fields={row}
          formData={formData}
          boarder={boarder}
          setFormData={setFormData}
        />
      ))}

      {Object.keys(formData).length > 0 && (
        <div className="d-flex justify-content-center gap-2 w-100">
          <Button variant="primary" size="sm" type="submit">
            Save Changes
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setFormData({});
              setValidated(false);
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </Form>
  );
}
