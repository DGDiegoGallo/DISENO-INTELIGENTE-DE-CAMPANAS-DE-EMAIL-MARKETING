import React, { useState, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import { FaPlus, FaArrowRight } from 'react-icons/fa';

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newGroup: string) => void;
  currentGroup?: string; // Grupo actual para preseleccionar
  groups: string[];
  onAddGroup: (groupName: string) => void;
  // Nuevo prop para mostrar contactos del grupo actual
  contactsInGroup?: Array<{id: number, name: string, email: string, phone: string}>;
  // Función para remover un contacto del grupo
  onRemoveFromGroup?: (contactId: number) => void;
}

// Definimos solo los estilos necesarios

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  width: '100%',
};

const EditGroupModal: React.FC<EditGroupModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  currentGroup, 
  groups, 
  onAddGroup,
  contactsInGroup = [],
  onRemoveFromGroup
}) => {
  const [selectedGroup, setSelectedGroup] = useState(currentGroup || '');
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Actualizar el grupo seleccionado si el prop 'currentGroup' cambia
  useEffect(() => {
    setSelectedGroup(currentGroup || '');
  }, [currentGroup, isOpen]); // Re-evaluar cuando se abre o cambia el grupo

  const handleSubmit = () => {
    if (selectedGroup) {
      onSubmit(selectedGroup);
    }
  };
  
  const handleAddNewGroup = () => {
    if (!newGroupName.trim()) {
      alert('Por favor, ingresa un nombre para el grupo');
      return;
    }
    
    // Añadir el nuevo grupo a la lista
    onAddGroup(newGroupName);
    
    // Seleccionar automáticamente el nuevo grupo
    setSelectedGroup(newGroupName);
    
    // Reset del estado
    setNewGroupName('');
    setShowNewGroupInput(false);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <h3 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', color: '#333' }}>Gestionar grupo</h3>
      
      {!showNewGroupInput ? (
        <>
          <h5 style={{ color: '#555', marginBottom: '10px' }}>Selecciona un grupo</h5>
          <div style={{ marginBottom: '20px' }}>
            <select 
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxSizing: 'border-box' as const,
              }}
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">Seleccionar grupo</option>
              {groups.map((group, index) => (
                <option key={index} value={group}>{group}</option>
              ))}
              <option value="__new_group__">+ Crear nuevo grupo</option>
            </select>
            {selectedGroup === '__new_group__' && (
              <button 
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#F21A2B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '5px',
                  width: '100%'
                }}
                onClick={() => setShowNewGroupInput(true)}
              >
                <FaPlus style={{ marginRight: '5px' }} /> Crear grupo nuevo
              </button>
            )}
          </div>
          
          {/* Mostrar contactos del grupo actual si hay alguno */}
          {selectedGroup && selectedGroup !== '__new_group__' && contactsInGroup && contactsInGroup.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ color: '#555', marginBottom: '10px' }}>Contactos en este grupo:</h5>
              <div style={{ 
                maxHeight: '150px', 
                overflowY: 'auto', 
                border: '1px solid #eee', 
                borderRadius: '5px',
                padding: '10px'
              }}>
                {contactsInGroup.map(contact => (
                  <div key={contact.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px',
                    borderBottom: '1px solid #f5f5f5',
                    fontSize: '14px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{contact.name}</div>
                      <div style={{ color: '#666', fontSize: '12px' }}>{contact.email}</div>
                    </div>
                    {onRemoveFromGroup && (
                      <button 
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#F21A2B',
                          cursor: 'pointer',
                          padding: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '12px'
                        }}
                        onClick={() => onRemoveFromGroup(contact.id)}
                        title="Sacar de este grupo"
                      >
                        <FaArrowRight style={{ marginRight: '5px' }} /> Sacar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
            <button 
              style={{...buttonStyle, backgroundColor: 'transparent', border: '1px solid #F21A2B', color: '#F21A2B', width: '48%'}} 
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              style={{...buttonStyle, backgroundColor: '#F21A2B', color: 'white', width: '48%'}} 
              onClick={handleSubmit}
              disabled={!selectedGroup || selectedGroup === '__new_group__'}
            >
              Aplicar
            </button>
          </div>
        </>
      ) : (
        <>
          <h5 style={{ color: '#555', marginBottom: '10px' }}>Crear nuevo grupo</h5>
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="Nombre del nuevo grupo" 
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '8px 0 0 8px',
                boxSizing: 'border-box' as const,
              }}
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)} 
            />
            <button 
              style={{
                padding: '10px 15px',
                backgroundColor: '#F21A2B',
                color: 'white',
                border: 'none',
                borderRadius: '0 8px 8px 0',
                cursor: 'pointer',
              }}
              onClick={handleAddNewGroup}
            >
              Añadir
            </button>
          </div>
          
          <button 
            style={{
              padding: '10px 15px',
              backgroundColor: '#f0f0f0',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%'
            }}
            onClick={() => {
              setShowNewGroupInput(false);
              setNewGroupName('');
              setSelectedGroup('');
            }}
          >
            Cancelar
          </button>
        </>
      )}
    </ModalWrapper>
  );
};

export default EditGroupModal;
