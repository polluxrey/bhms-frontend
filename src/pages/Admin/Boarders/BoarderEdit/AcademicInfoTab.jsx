import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { chunkFields } from "../../../../../utils/chunkFields";
import DynamicFormRow from "./DynamicForm";
import {
  fetchAcademicProgramData,
  fetchSchoolData,
  fetchYearLevelData,
} from "../../../../services/boarderService";
import { useFetch } from "../../../../hooks/useFetch";

export default function AcademicInfoTab({
  boarder,
  formData,
  setFormData,
  handleSave,
  validated,
  setValidated,
}) {
  // useEffect(() => {
  //   setFormData({});
  // }, []);

  const {
    data: schoolData,
    loading: schoolLoading,
    error: schoolError,
  } = useFetch(fetchSchoolData);

  const {
    data: academicProgramData,
    loading: academicProgramLoading,
    error: academicProgramError,
  } = useFetch(fetchAcademicProgramData);

  const {
    data: yearLevelData,
    loading: yearLevelLoading,
    error: yearLevelError,
  } = useFetch(fetchYearLevelData);

  const schools = schoolData ?? [];
  const programs = academicProgramData ?? [];
  const levels = yearLevelData ?? [];

  const fields = [
    {
      label: "School",
      key: "school",
      type: "dropdown",
      required: true,
      options: schools.map((s) => ({
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
      options: programs.map((p) => ({
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
      options: levels.map((l) => ({
        value: l.value,
        label: l.label,
      })),
      colSpan: 4,
    },
  ];

  const fieldRows = chunkFields(fields, 3);

  return (
    <Form noValidate validated={validated} onSubmit={handleSave}>
      {schools.length === 0 && <div>Loading schools...</div>}
      {programs.length === 0 && <div>Loading programs...</div>}
      {levels.length === 0 && <div>Loading levels...</div>}
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
