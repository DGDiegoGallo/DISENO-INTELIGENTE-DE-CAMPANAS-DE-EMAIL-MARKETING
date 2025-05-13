import React, { useState } from 'react';
import ModalWrapper from './ModalWrapper';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGroup: (groupName: string) => void;
  existingGroups: string[];
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddGroup,
  existingGroups
}) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Validar que no esté vacío
    if (!newGroupName.trim()) {
      setError('Por favor, ingresa un nombre para el grupo');
      return;
    }

    // Validar que no exista ya
    if (existingGroups.includes(newGroupName.trim())) {
      setError('Este nombre de grupo ya existe');
      return;
    }

    // Añadir el grupo
    onAddGroup(newGroupName.trim());
    
    // Limpiar y cerrar
    setNewGroupName('');
    setError('');
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <h3 style={{ marginTop: 0, marginBottom: '25px', textAlign: 'center', color: '#333' }}>Crear Nuevo Grupo</h3>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fff1f0', 
          color: '#ff4d4f', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '15px',
          fontSize: '13px'
        }}>
          {error}
        </div>
      )}
      
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '5px', 
          fontSize: '13px', 
          color: '#555', 
          fontWeight: 'bold' 
        }}>
          Nombre del Grupo
        </label>
        <input 
          type="text" 
          placeholder="Ej: Clientes VIP" 
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginBottom: '15px', 
            border: '1px solid #ccc', 
            borderRadius: '8px', 
            boxSizing: 'border-box' 
          }} 
          value={newGroupName}
          onChange={(e) => {
            setNewGroupName(e.target.value);
            setError('');
          }} 
        />
      </div>
      
      <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between' }}>
        <button 
          style={{ 
            padding: '10px 20px', 
            borderRadius: '8px', 
            border: '1px solid #F21A2B', 
            backgroundColor: 'transparent',
            color: '#F21A2B',
            cursor: 'pointer', 
            fontSize: '14px', 
            fontWeight: 'bold', 
            width: '48%' 
          }} 
          onClick={onClose}
        >
          Cancelar
        </button>
        <button 
          style={{ 
            padding: '10px 20px', 
            borderRadius: '8px', 
            border: 'none', 
            backgroundColor: '#F21A2B', 
            color: 'white', 
            cursor: 'pointer', 
            fontSize: '14px', 
            fontWeight: 'bold', 
            width: '48%' 
          }} 
          onClick={handleSubmit}
        >
          Crear Grupo
        </button>
      </div>
    </ModalWrapper>
  );
};

export default CreateGroupModal;
