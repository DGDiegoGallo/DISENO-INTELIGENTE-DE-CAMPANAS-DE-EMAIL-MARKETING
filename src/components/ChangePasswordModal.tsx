import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface ChangePasswordModalProps {
  show: boolean;
  onHide: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ show, onHide }) => {
  // Este componente está vacío intencionalmente para que el usuario lo implemente más tarde
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña actual</Form.Label>
            <Form.Control type="password" placeholder="Ingresa tu contraseña actual" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nueva contraseña</Form.Label>
            <Form.Control type="password" placeholder="Ingresa tu nueva contraseña" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirmar nueva contraseña</Form.Label>
            <Form.Control type="password" placeholder="Confirma tu nueva contraseña" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="danger" style={{ backgroundColor: '#FF3A44', borderColor: '#FF3A44' }}>
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;
