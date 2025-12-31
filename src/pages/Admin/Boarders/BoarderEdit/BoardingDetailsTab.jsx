import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { chunkFields } from "../../../../../utils/chunkFields";
import DynamicFormRow from "./DynamicForm";
import { useFetch } from "../../../../hooks/useFetch";
import { fetchRoomData } from "../../../../services/boarderService";

export default function BoardingDetailsTab({
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
    data: roomData,
    loading: roomLoading,
    error: roomError,
  } = useFetch(fetchRoomData);

  const rooms = roomData ?? [];

  const fields = [
    {
      label: "Room Number",
      key: "room_number",
      type: "dropdown",
      required: true,
      options: rooms.map((r) => ({
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
    {
      label: "Move-Out Date",
      key: "move_out_date",
      type: "date",
      required: (formData?.is_active ?? boarder?.is_active) === false,
      disabled: (formData?.is_active ?? boarder?.is_active) === true,
      colSpan: 4,
    },
    {
      label: "Is Active?",
      key: "is_active",
      type: "switch",
      colSpan: 4,
    },
  ];

  const fieldRows = chunkFields(fields, 3);

  return (
    <Form noValidate validated={validated} onSubmit={handleSave}>
      {rooms.length === 0 && <div>Loading rooms...</div>}
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
