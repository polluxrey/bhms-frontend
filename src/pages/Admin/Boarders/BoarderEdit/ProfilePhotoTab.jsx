import { Container, Button, InputGroup, Form, Spinner } from "react-bootstrap";
import { useBoarderPhoto } from "../../../../hooks/forms/useBoarderPhoto";
import { useEffect } from "react";

export default function ProfilePhotoTab({ boarderId, onSuccess, onError }) {
  const {
    photoFile,
    previewUrl,
    selectedFileName,
    successMessage,
    errorMessage,
    handlePhotoChange,
    handlePhotoSave,
    handlePhotoCancel,
  } = useBoarderPhoto(boarderId);

  useEffect(() => {
    if (successMessage) onSuccess("Photo uploaded successfully!");
    if (errorMessage) onError(errorMessage);
  }, [successMessage, errorMessage, onSuccess, onError]);

  return (
    <Container className="d-flex flex-column align-items-center">
      <div className="ratio ratio-1x1 mb-2" style={{ maxWidth: "275px" }}>
        {previewUrl ? (
          <img src={previewUrl} className="object-fit-cover" alt="Profile" />
        ) : (
          <div className="d-flex justify-content-center align-items-center w-100 h-100">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
      </div>

      <input
        type="file"
        id={`upload-photo`}
        accept="image/*"
        onChange={handlePhotoChange}
        style={{ display: "none" }}
      />

      <InputGroup size="sm" className="mb-3" style={{ maxWidth: "275px" }}>
        <Button
          variant="outline-secondary"
          onClick={() => document.getElementById(`upload-photo`).click()}
        >
          Upload Photo
        </Button>
        <Form.Control
          placeholder="No file selected"
          value={selectedFileName}
          readOnly
        />
      </InputGroup>

      {photoFile && (
        <div className="d-flex gap-2">
          <Button variant="primary" size="sm" onClick={handlePhotoSave}>
            Save Changes
          </Button>
          <Button variant="secondary" size="sm" onClick={handlePhotoCancel}>
            Cancel
          </Button>
        </div>
      )}
    </Container>
  );
}
