import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { FaUpload, FaCamera } from 'react-icons/fa';
import { uploadFile, updateUserAvatar } from '../services/uploadService';
import useUserStore from '../store/useUserStore';

interface ChangeProfilePhotoModalProps {
  show: boolean;
  onHide: () => void;
}

const ChangeProfilePhotoModal: React.FC<ChangeProfilePhotoModalProps> = ({ show, onHide }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user, login } = useUserStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo es demasiado grande. El tamaño máximo es 5MB.');
        return;
      }
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('El archivo debe ser una imagen (JPG, PNG, etc).');
        return;
      }
      
      setSelectedFile(file);
      
      // Crear una URL para previsualizar la imagen
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result) {
          setPreviewUrl(fileReader.result.toString());
        }
      };
      fileReader.readAsDataURL(file);
    }
  };
  
  const { setTemporaryUserAvatar } = useUserStore(); // Destructure the new action

  const handleUpload = async () => {
    if (!selectedFile || !user || !user.id) return;
    
    setIsUploading(true);
    setError(null);
    setSuccess(null);

    // --- Cascade: Set temporary avatar in localStorage and store --- 
    if (previewUrl && user.id) {
      setTemporaryUserAvatar(user.id, previewUrl);
    }
    // --- End Cascade edit ---

    
    try {
      // Subir el archivo a la carpeta 'profile-photos'
      const uploadResponse = await uploadFile(selectedFile, 'profile-photos');
      
      if (uploadResponse && uploadResponse.length > 0) {
        const fileId = uploadResponse[0].id;
        
        // Actualizar el avatar del usuario
        const updateResponse = await updateUserAvatar(user.id, fileId);
        
        // Actualizar el estado del usuario en el store
        if (updateResponse) {
          // Convertir el objeto de respuesta al formato esperado por el store
          const updatedUser = {
            ...user,
            ...updateResponse,
            // Asegurarse de que el avatar sea compatible con el tipo User
            avatar: typeof updateResponse.avatar === 'object' ? 
              updateResponse.avatar.id.toString() : 
              updateResponse.avatar?.toString() || null
          };
          
          // The login function in useUserStore will now automatically handle
          // checking for and applying the temporary avatar from localStorage if it exists.
          login({
            user: {
              ...updatedUser,
              // Ensure avatar is string | undefined as per StrapiUser
              avatar: updatedUser.avatar === null ? undefined : String(updatedUser.avatar),
            },
            token: localStorage.getItem('token') || ''
          });
          
          setSuccess('Foto de perfil actualizada correctamente');
          
          // Cerrar el modal después de 2 segundos
          setTimeout(() => {
            onHide();
            setSelectedFile(null);
            setPreviewUrl(null);
            setSuccess(null);
          }, 2000);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al subir la imagen');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar foto de perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" className="mb-3">
              {success}
            </Alert>
          )}
          
          <div 
            className="rounded-circle overflow-hidden mx-auto mb-3" 
            style={{ width: '150px', height: '150px', backgroundColor: '#f0f0f0' }}
          >
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Vista previa" 
                className="w-100 h-100 object-fit-cover" 
              />
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                <FaCamera size={40} />
              </div>
            )}
          </div>
          
          <Form.Group className="mb-3">
            <Form.Label visuallyHidden>Seleccionar imagen</Form.Label>
            <div className="d-grid gap-2">
              <Button 
                variant="outline-secondary"
                onClick={() => document.getElementById('fileInput')?.click()}
                disabled={isUploading}
              >
                <FaUpload className="me-2" />
                Seleccionar imagen
              </Button>
              <Form.Control 
                type="file" 
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={isUploading}
              />
            </div>
          </Form.Group>
          
          <p className="text-muted small">
            Formatos permitidos: JPG, PNG. Tamaño máximo: 5MB
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isUploading}>
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          style={{ backgroundColor: '#FF3A44', borderColor: '#FF3A44' }}
          disabled={!selectedFile || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Subiendo...
            </>
          ) : (
            'Guardar cambios'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeProfilePhotoModal;
