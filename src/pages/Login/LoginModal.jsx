import { Modal } from "react-bootstrap";
import LoginForm from "./LoginForm";

export default function LoginModal({ show, handleClose, onSuccess }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LoginForm
          onSuccess={() => {
            if (onSuccess) onSuccess();
            handleClose(); // close modal on success
          }}
        />
      </Modal.Body>
    </Modal>
  );
}
