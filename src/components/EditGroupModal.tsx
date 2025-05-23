import React, { useState, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import { FaPlus, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import ConfirmModal from './ConfirmModal';
import * as contactsService from '../services/contactsService';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  group: string;
}

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newGroup: string) => void;
  currentGroup?: string;
  groups: string[];
  onAddGroup?: (groupName: string) => void;
  contactsInGroup?: Array<Contact>;
  allContacts: Array<Contact>; // Todos los contactos disponibles
}

// Estilos
const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  width: '100%',
};

const contactItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px',
  borderBottom: '1px solid #f5f5f5',
  fontSize: '14px',
  marginBottom: '5px',
};

const contactListStyle: React.CSSProperties = {
  maxHeight: '150px',
  overflowY: 'auto',
  border: '1px solid #eee',
  borderRadius: '5px',
  padding: '10px',
  marginBottom: '15px',
};

const actionButtonStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  color: '#F21A2B',
  cursor: 'pointer',
  padding: '5px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '12px',
};

const listHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 5px 5px 5px',
  borderBottom: '1px solid #eee',
  marginBottom: '10px',
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#555',
};

// Componente de etiqueta de grupo
const GroupTag: React.FC<{groupName: string}> = ({ groupName }) => (
  <span style={{
    backgroundColor: '#f0f0f0',
    color: '#666',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '11px',
    marginRight: '8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '120px',
    display: 'inline-block',
  }}>
    {groupName}
  </span>
);

const EditGroupModal: React.FC<EditGroupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentGroup,
  groups,
  onAddGroup,
  contactsInGroup = [],
  allContacts = []
}) => {
  const [selectedGroup, setSelectedGroup] = useState(currentGroup || '');
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  
  // Estado temporal para gestionar los contactos antes de aplicar cambios
  const [tempContactsInGroup, setTempContactsInGroup] = useState<Array<Contact>>([]);
  const [tempContactsOutGroup, setTempContactsOutGroup] = useState<Array<Contact>>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Estado para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [contactToRemove, setContactToRemove] = useState<Contact | null>(null);

  // Actualizar el grupo seleccionado y los contactos temporales cuando cambian los props
  useEffect(() => {
    if (isOpen) {
      setSelectedGroup(currentGroup || '');
      
      // Inicializar los contactos que están en el grupo
      setTempContactsInGroup([...contactsInGroup]);
      
      // Inicializar los contactos que no están en el grupo
      const otherContacts = allContacts.filter(
        contact => !contactsInGroup.some(c => c.id === contact.id)
      );
      setTempContactsOutGroup(otherContacts);
      
      // Resetear el indicador de cambios
      setHasChanges(false);
    }
  }, [isOpen, currentGroup, contactsInGroup, allContacts]);

  // Actualizar los contactos cuando cambia el grupo seleccionado
  useEffect(() => {
    if (selectedGroup && selectedGroup !== '__new_group__' && isOpen) {
      // Encontrar los contactos que pertenecen al grupo seleccionado
      const inGroup = allContacts.filter(contact => contact.group === selectedGroup);
      setTempContactsInGroup(inGroup);
      
      // Encontrar los contactos que no pertenecen al grupo seleccionado
      const outGroup = allContacts.filter(contact => contact.group !== selectedGroup);
      setTempContactsOutGroup(outGroup);
      
      // Resetear el indicador de cambios
      setHasChanges(false);
    }
  }, [selectedGroup, isOpen, allContacts]);

  // Mover un contacto de fuera del grupo al grupo
  const moveContactToGroup = (contactId: number) => {
    const contactToMove = tempContactsOutGroup.find(c => c.id === contactId);
    if (contactToMove) {
      // Añadir al grupo temporal
      setTempContactsInGroup([...tempContactsInGroup, contactToMove]);
      
      // Remover de la lista de fuera del grupo
      setTempContactsOutGroup(tempContactsOutGroup.filter(c => c.id !== contactId));
      
      // Marcar que hay cambios
      setHasChanges(true);
    }
  };

  // Abrir modal de confirmación para eliminar contacto del grupo
  const openRemoveConfirmModal = (contactId: number) => {
    const contact = tempContactsInGroup.find(c => c.id === contactId);
    if (contact) {
      setContactToRemove(contact);
      setShowConfirmModal(true);
    }
  };

  // Eliminar permanentemente un contacto después de confirmación
  const deleteContact = () => {
    if (contactToRemove) {
      // Eliminar permanentemente el contacto usando el servicio
      contactsService.removeContact(contactToRemove.id);
      
      // Actualizar la lista de contactos en el grupo
      setTempContactsInGroup(tempContactsInGroup.filter(c => c.id !== contactToRemove.id));
      
      // Marcar que hay cambios
      setHasChanges(true);
      
      // Limpiar el contacto seleccionado
      setContactToRemove(null);
      
      // Cerrar el modal de confirmación
      setShowConfirmModal(false);
    }
  };

  // Aplicar todos los cambios
  const handleSubmit = () => {
    if (selectedGroup && hasChanges) {
      // Solo aplicamos los cambios de contactos que están en el grupo seleccionado
      // Los contactos que se sacaron del grupo se quedarán en su grupo original
      // hasta que se les asigne explícitamente otro grupo
      
      // Simplemente llamamos al handler original con el grupo seleccionado
      // Esto moverá todos los contactos que están en tempContactsInGroup al grupo seleccionado
      
      console.log('Aplicando cambios en grupo:', selectedGroup, 
                 'Contactos en grupo:', tempContactsInGroup.length, 
                 'Contactos fuera del grupo:', tempContactsOutGroup.length);
    }
    
    // Llamar al handler original con el grupo seleccionado
    onSubmit(selectedGroup);
  };
  
  const handleAddNewGroup = () => {
    if (!newGroupName.trim()) {
      alert('Por favor, ingresa un nombre para el grupo');
      return;
    }
    
    // Añadir el nuevo grupo a la lista si la función existe
    if (onAddGroup) {
      onAddGroup(newGroupName);
    }
    
    // Seleccionar automáticamente el nuevo grupo
    setSelectedGroup(newGroupName);
    
    // Reset del estado
    setNewGroupName('');
    setShowNewGroupInput(false);
  };

  return (
    <ModalWrapper 
      isOpen={isOpen} 
      onClose={onClose} 
      customStyle={{
        maxWidth: '500px', // Aumentando el ancho del modal
        width: '95%',
        maxHeight: '80vh', // Asegurar que no sea demasiado alto
        overflowY: 'auto' // Permitir scroll si es necesario
      }}
    >
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
          
          {/* Gestión de contactos en el grupo seleccionado */}
          {selectedGroup && selectedGroup !== '__new_group__' && (
            <>
              {/* Lista de contactos en este grupo */}
              <div style={{ marginBottom: '15px' }}>
                <h5 style={{ color: '#555', marginBottom: '5px' }}>Contactos en este grupo:</h5>
                <div style={contactListStyle}>
                  <div style={listHeaderStyle}>
                    <span>Nombre</span>
                    <span>Acción</span>
                  </div>
                  {tempContactsInGroup.length > 0 ? (
                    tempContactsInGroup.map(contact => (
                      <div key={contact.id} style={contactItemStyle}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{contact.name}</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>{contact.email}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {/* Mostrando el grupo del contacto */}
                          <GroupTag groupName={selectedGroup} />
                          <button 
                            style={actionButtonStyle}
                            onClick={() => openRemoveConfirmModal(contact.id)}
                            title="Eliminar de este grupo"
                          >
                            <FaUserMinus style={{ marginRight: '5px' }} /> Eliminar
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: '#888', padding: '10px' }}>
                      No hay contactos en este grupo
                    </div>
                  )}
                </div>
              </div>
              
              {/* Lista de contactos fuera de este grupo */}
              <div>
                <h5 style={{ color: '#555', marginBottom: '5px' }}>Otros contactos disponibles:</h5>
                <div style={contactListStyle}>
                  <div style={listHeaderStyle}>
                    <span>Nombre</span>
                    <span>Acción</span>
                  </div>
                  {tempContactsOutGroup.length > 0 ? (
                    tempContactsOutGroup.map(contact => (
                      <div key={contact.id} style={contactItemStyle}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{contact.name}</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>{contact.email}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {/* Mostrando el grupo actual del contacto */}
                          <GroupTag groupName={contact.group} />
                          <button 
                            style={actionButtonStyle}
                            onClick={() => moveContactToGroup(contact.id)}
                            title="Añadir a este grupo"
                          >
                            <FaUserPlus style={{ marginRight: '5px' }} /> Añadir
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: '#888', padding: '10px' }}>
                      No hay más contactos disponibles
                    </div>
                  )}
                </div>
              </div>
            </>
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
              setSelectedGroup(currentGroup || '');
            }}
          >
            Volver
          </button>
        </>
      )}
      
      {/* Modal de confirmación para eliminar contactos permanentemente */}
      <ConfirmModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={deleteContact}
        title="Confirmar eliminación"
        message={contactToRemove ? `¿Estás seguro de eliminar permanentemente a "${contactToRemove.name}"? Esta acción no se puede deshacer.` : ''}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </ModalWrapper>
  );
};

export default EditGroupModal;
