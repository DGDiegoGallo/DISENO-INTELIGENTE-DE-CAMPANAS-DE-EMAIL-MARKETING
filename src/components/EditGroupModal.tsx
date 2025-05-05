import React, { useState, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newGroup: string) => void;
  currentGroup?: string; // Grupo actual para preseleccionar
}

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  marginBottom: '20px',
  maxHeight: '150px', // Para permitir scroll si hay muchos grupos
  overflowY: 'auto',
  border: '1px solid #eee',
  borderRadius: '8px',
};

const listItemStyle: React.CSSProperties = {
  padding: '10px',
  borderBottom: '1px solid #eee',
  cursor: 'pointer',
};

const activeListItemStyle: React.CSSProperties = {
  backgroundColor: '#f0f0f0',
  fontWeight: 'bold',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  width: '100%',
};

const EditGroupModal: React.FC<EditGroupModalProps> = ({ isOpen, onClose, onSubmit, currentGroup }) => {
  const [selectedGroup, setSelectedGroup] = useState(currentGroup || '');
  const groups = ['Grupo 1', 'Grupo 2', 'Grupo 3']; // Placeholder - cargar desde estado/API

  // Actualizar el grupo seleccionado si el prop 'currentGroup' cambia
  useEffect(() => {
    setSelectedGroup(currentGroup || '');
  }, [currentGroup, isOpen]); // Re-evaluar cuando se abre o cambia el grupo

  const handleSubmit = () => {
    onSubmit(selectedGroup);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <h4 style={{ marginTop: 0, marginBottom: '20px', color: '#555' }}>Contactos</h4>
      {/* Usamos una lista para simular el diseño, pero un select podría ser más semántico */}
      <ul style={listStyle}>
        <li 
          style={{...listItemStyle, ...(selectedGroup === '' ? activeListItemStyle : {})}}
          onClick={() => setSelectedGroup('')}
        >
          Seleccionar
        </li>
        {groups.map(group => (
          <li 
            key={group}
            style={{...listItemStyle, ...(selectedGroup === group ? activeListItemStyle : {})}}
            onClick={() => setSelectedGroup(group)}
          >
            {group}
          </li>
        ))}
      </ul>

      <button 
        style={{...buttonStyle, backgroundColor: '#F21A2B', color: 'white'}} 
        onClick={handleSubmit}
        disabled={!selectedGroup} // Deshabilitar si no hay selección
      >
        Crear nuevo {/* Cambiar texto si es necesario -> Actualizar grupo? */}
      </button>
    </ModalWrapper>
  );
};

export default EditGroupModal;
