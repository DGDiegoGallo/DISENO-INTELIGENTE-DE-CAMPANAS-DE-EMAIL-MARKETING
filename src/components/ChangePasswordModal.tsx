import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface ChangePasswordModalProps {
  show: boolean;
  onHide: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ show, onHide }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword.trim()) {
      toast.error('Por favor, ingresa tu contraseña actual.');
      return;
    }
    if (!newPassword.trim() || !confirmNewPassword.trim()) {
      toast.error('Por favor, completa los campos de nueva contraseña.');
      return;
    }
    if (newPassword.trim().length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword.trim() !== confirmNewPassword.trim()) {
      toast.error('Las nuevas contraseñas no coinciden.');
      return;
    }

    // Simulación de cambio de contraseña exitoso
    console.log('Simulando cambio de contraseña:', { 
      currentPassword: currentPassword.trim(), 
      newPassword: newPassword.trim() 
    });
    toast.success('Contraseña actualizada exitosamente (simulado).');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    onHide();
  };

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
            <Form.Control 
              type="password" 
              placeholder="Ingresa tu contraseña actual" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nueva contraseña</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Ingresa tu nueva contraseña" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirmar nueva contraseña</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Confirma tu nueva contraseña" 
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button type="submit" variant="danger" style={{ backgroundColor: '#FF3A44', borderColor: '#FF3A44' }} onClick={handleSaveChanges}>
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;
