import React, { useState } from 'react'; 
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import AddContactModal from '../AddContactModal'; 
import EditGroupModal from '../EditGroupModal';
import DeleteContactModal from '../DeleteContactModal';

interface Contact {
  id: number; 
  name: string;
  phone: string;
  group: string;
  email?: string; 
}

const ContactView: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>( 
    Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      name: `Nombre ${i + 1}`,
      phone: `+1 000 000 00 ${String(i+1).padStart(2,'0')}`,
      group: i % 3 === 0 ? 'Grupo 1' : i % 3 === 1 ? 'Grupo 2' : 'Sin grupo...',
      email: `ejemplo${i+1}@mail.com`
    }))
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContactIndex, setSelectedContactIndex] = useState<number | null>(null);

  const handleOpenAddModal = () => setShowAddModal(true);

  const handleOpenEditModal = (index: number) => {
    setSelectedContactIndex(index);
    setShowEditModal(true);
  };

  const handleOpenDeleteModal = (index: number) => {
    setSelectedContactIndex(index);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedContactIndex(null);
  };

  const handleAddContact = (name: string, email: string, group: string) => {
    const newContact: Contact = {
      id: Date.now(), 
      name,
      email,
      phone: '+1 000 000 00 00', 
      group,
    };
    setContacts(prevContacts => [...prevContacts, newContact]);
    handleCloseModals();
  };

  const handleEditGroup = (newGroup: string) => {
    if (selectedContactIndex === null) return;
    setContacts(prevContacts => 
      prevContacts.map((contact, index) => 
        index === selectedContactIndex ? { ...contact, group: newGroup } : contact
      )
    );
    handleCloseModals();
  };

  const handleDeleteContact = () => {
    if (selectedContactIndex === null) return;
    setContacts(prevContacts => 
      prevContacts.filter((_, index) => index !== selectedContactIndex)
    );
    handleCloseModals();
  };

  const headerCellStyle: React.CSSProperties = {
    backgroundColor: '#282A5B', 
    color: 'white',
    padding: '12px 15px',
    textAlign: 'left' as const,
    borderBottom: '1px solid #dee2e6'
  };

  const bodyCellStyle: React.CSSProperties = {
    padding: '12px 15px',
    borderBottom: '1px solid #eee',
    backgroundColor: 'white',
    color: '#333',
    verticalAlign: 'middle' 
  };
  
  const actionsCellStyle: React.CSSProperties = {
    ...bodyCellStyle,
    textAlign: 'center' 
  }

  const actionIconStyle: React.CSSProperties = {
    cursor: 'pointer',
    margin: '0 8px', 
    color: '#555',
    fontSize: '16px' 
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      padding: '20px', 
      maxHeight: 'calc(100vh - 120px)', 
      overflowY: 'auto' 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ color: '#333', margin: 0 }}>Interacciones</h2>
        <button 
          style={{
            padding: '10px 20px',
            backgroundColor: '#F21A2B', 
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          onClick={handleOpenAddModal} 
        >
          Añadir
        </button>
      </div>

      <div style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={headerCellStyle}>Nombre</th>
              <th style={headerCellStyle}>Teléfono</th>
              <th style={headerCellStyle}>Grupo</th>
              <th style={{...headerCellStyle, textAlign: 'center'}}>Acciones</th> 
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={contact.id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={bodyCellStyle}>{contact.name}</td>
                <td style={bodyCellStyle}>{contact.phone}</td>
                <td style={bodyCellStyle}>{contact.group}</td>
                <td style={actionsCellStyle}> 
                  <FaEdit 
                    style={actionIconStyle} 
                    onClick={() => handleOpenEditModal(index)} 
                  />
                  <FaTrashAlt 
                    style={actionIconStyle} 
                    onClick={() => handleOpenDeleteModal(index)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#666', fontSize: '13px' }}>
        <span>Mostrando {contacts.length} de {contacts.length} datos</span> 
        <div>
          <button style={{ border: '1px solid #ccc', background: 'none', padding: '5px 10px', margin: '0 2px', cursor: 'pointer' }}>&lt;</button>
          <button style={{ border: '1px solid #ccc', background: '#F21A2B', color: 'white', padding: '5px 10px', margin: '0 2px', cursor: 'pointer' }}>1</button>
          <button style={{ border: '1px solid #ccc', background: 'none', padding: '5px 10px', margin: '0 2px', cursor: 'pointer' }}>2</button>
          <button style={{ border: '1px solid #ccc', background: 'none', padding: '5px 10px', margin: '0 2px', cursor: 'pointer' }}>3</button>
          <button style={{ border: '1px solid #ccc', background: 'none', padding: '5px 10px', margin: '0 2px', cursor: 'pointer' }}>4</button>
          <span>...</span>
          <button style={{ border: '1px solid #ccc', background: 'none', padding: '5px 10px', margin: '0 2px', cursor: 'pointer' }}>40</button>
          <button style={{ border: '1px solid #ccc', background: 'none', padding: '5px 10px', margin: '0 2px', cursor: 'pointer' }}>&gt;</button>
        </div>
      </div>

      <AddContactModal 
        isOpen={showAddModal}
        onClose={handleCloseModals}
        onSubmit={handleAddContact}
      />

      <EditGroupModal 
        isOpen={showEditModal}
        onClose={handleCloseModals}
        onSubmit={handleEditGroup}
        currentGroup={selectedContactIndex !== null ? contacts[selectedContactIndex]?.group : undefined}
      />

      <DeleteContactModal 
        isOpen={showDeleteModal}
        onClose={handleCloseModals}
        onConfirm={handleDeleteContact}
      />

    </div>
  );
};

export default ContactView;
