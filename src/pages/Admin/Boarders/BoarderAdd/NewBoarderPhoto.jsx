import { useState } from "react";
import { Container, InputGroup, Form, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import defaultUser from "../../../../assets/user.png";

export default function NewBoarderPhoto({ onPhotoChange }) {
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedFileName(file.name);
    onPhotoChange?.(file);
  };

  const handleReset = () => {
    setPhotoFile(null);
    setPreviewUrl(null);
    setSelectedFileName("");
    onPhotoChange?.(null);
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <div
        className="mb-2"
        style={{
          position: "relative",
          maxWidth: "275px",
          aspectRatio: "1 / 1",
          overflow: "hidden",
        }}
      >
        <img
          src={previewUrl || defaultUser} // fallback to default
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="Profile"
        />

        {previewUrl && (
          <div
            onClick={handleReset}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              width: "30px",
              height: "30px",
              borderRadius: "50%", // circular
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FaTimes
              style={{ color: "white", width: "16px", height: "16px" }}
            />
          </div>
        )}
      </div>

      <input
        type="file"
        id="upload-photo-new"
        accept="image/*"
        onChange={handlePhotoChange}
        style={{ display: "none" }}
      />

      <InputGroup size="sm" className="mb-3" style={{ maxWidth: "275px" }}>
        <Button
          variant="outline-secondary"
          onClick={() => document.getElementById("upload-photo-new").click()}
        >
          Select Photo
        </Button>
        <Form.Control
          placeholder="No file selected"
          value={selectedFileName}
          readOnly
        />
      </InputGroup>
    </Container>
  );
}
