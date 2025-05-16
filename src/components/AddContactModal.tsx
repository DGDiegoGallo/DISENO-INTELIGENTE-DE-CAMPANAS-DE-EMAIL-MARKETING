import React, { useState } from 'react';
import Swal from 'sweetalert2';
import ModalWrapper from './ModalWrapper';
import { FaPlus } from 'react-icons/fa';
import CreateGroupModal from './CreateGroupModal';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string, phone: string, group: string) => void;
  groups: string[];
  onAddGroup: (groupName: string) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '5px',
  fontSize: '13px',
  color: '#555',
  fontWeight: 'bold',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 5px',
};

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onSubmit, groups, onAddGroup }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [group, setGroup] = useState('');
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Por favor, ingresa un nombre');
      return;
    }
    if (!email.trim()) {
      alert('Por favor, ingresa un correo electrónico');
      return;
    }
    if (!phone.trim()) {
      alert('Por favor, ingresa un número de teléfono');
      return;
    }
    if (!group.trim()) {
      alert('Por favor, selecciona un grupo');
      return;
    }
    
    // Enviamos los datos del nuevo contacto
    onSubmit(name, email, phone, group);

    Swal.fire({
      title: '¡Éxito!',
      text: 'Contacto añadido correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#F21A2B'
    });
    
    // Limpiamos los campos
    setName('');
    setEmail('');
    setPhone('');
    setGroup('');
  };
  
  // Maneja la creación de un nuevo grupo desde el modal
  const handleAddGroup = (newGroupName: string) => {
    // Añadir el nuevo grupo a la lista
    onAddGroup(newGroupName);
    
    // Seleccionar automáticamente el nuevo grupo
    setGroup(newGroupName);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <h3 style={{ marginTop: 0, marginBottom: '25px', textAlign: 'center', color: '#333' }}>Nuevo contacto</h3>
      <div>
        <label style={labelStyle}>Nombre</label>
        <input 
          type="text" 
          placeholder="Nombre" 
          style={inputStyle} 
          value={name}
          onChange={(e) => setName(e.target.value)} 
        />
      </div>
      <div>
        <label style={labelStyle}>Correo</label>
        <input 
          type="email" 
          placeholder="ejemplo@gmail.com" 
          style={inputStyle} 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div>
        <label style={labelStyle}>Teléfono</label>
        <input 
          type="tel" 
          placeholder="+1 000 000 00 00" 
          style={inputStyle} 
          value={phone}
          onChange={(e) => setPhone(e.target.value)} 
        />
      </div>

      <div>
        <label style={labelStyle}>Grupo</label>
        <div>
          <select 
            style={inputStyle} 
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            <option value="">Seleccionar grupo</option>
            {groups.map((groupName, index) => (
              <option key={index} value={groupName}>{groupName}</option>
            ))}
          </select>
          
          <button 
            style={{
              display: 'block',
              marginTop: '5px',
              background: 'transparent',
              border: 'none',
              color: '#F21A2B',
              cursor: 'pointer',
              fontSize: '13px',
              padding: '0',
              textAlign: 'left' as const
            }}
            onClick={() => setShowCreateGroupModal(true)}
            type="button"
          >
            <FaPlus style={{ marginRight: '5px', fontSize: '10px' }} /> Añadir más grupos
          </button>
        </div>
      </div>
      <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center' }}>
        <button 
          style={{...buttonStyle, backgroundColor: 'transparent', border: '1px solid #F21A2B', color: '#F21A2B'}} 
          onClick={onClose}
          type="button"
        >
          Cancelar
        </button>
        <button 
          style={{...buttonStyle, backgroundColor: '#F21A2B', color: 'white'}} 
          onClick={handleSubmit}
          type="button"
        >
          Aceptar
        </button>
      </div>
      
      {/* Modal para crear grupos */}
      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onAddGroup={handleAddGroup}
        existingGroups={groups}
      />
    </ModalWrapper>
  );
};

export default AddContactModal;
