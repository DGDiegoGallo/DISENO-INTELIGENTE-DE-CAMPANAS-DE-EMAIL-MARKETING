import React, { useState, useEffect } from 'react'; 
import { FaEdit, FaTrashAlt, FaSync, FaUser, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import AddContactModal from '../AddContactModal'; 
import EditGroupModal from '../EditGroupModal';
import DeleteContactModal from '../DeleteContactModal';
import * as contactsService from '../../services/contactsService';
import { useAuthStore } from '../../store';
import useLoadingStore from '../../store/useLoadingStore';

interface Contact {
  id: number; 
  name: string;
  phone: string;
  group: string;
  email: string; 
}

// Estructura para grupos de contactos en Strapi
interface ContactGroup {
  id: string;
  nombre: string;
  contactos: {
    nombre: string;
    email: string;
    telefono: string;
  }[];
}

// Estructura para el JSON de gruposdecontactosJSON
interface GroupsData {
  grupos: ContactGroup[];
}

// Interface para los datos de Strapi
interface StrapiContact {
  id: number;
  documentId: string;
  nombre: string;
  Fechas: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  asunto: string;
  contenidoHTML: string | null;
  disenoJSON?: Record<string, unknown>;
  gruposdecontactosJSON: GroupsData;
  contactos: string;
  usuario: {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    nombre: string;
    apellido: string;
    sexo: string;
    edad: number;
    fechaDeNacimiento: string;
    pais: string;
    ciudad: string;
    domicilio: string;
    telefono: string;
    avatar: string | null;
    rol: string;
  }
}

const ContactView: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  // Estado para los grupos disponibles
  const [groups, setGroups] = useState<string[]>([]);
  
  // Estado para los grupos de Strapi - usado para sincronización
  const [strapiGroups, setStrapiGroups] = useState<ContactGroup[]>([]);
  
  // Estado para indicar carga
  const [loading, setLoading] = useState<boolean>(false);
  
  // Estado para el contacto seleccionado (vista previa)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Obtener el ID del usuario actual desde Zustand
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  // Obtener el ID del usuario actual desde el store de autenticación
  const getCurrentUserId = (): number => {
    // Verificamos el id del usuario en el store de autenticación
    return user ? user.id : 0;
  };
  
  // Obtener grupos de contactos desde Strapi
  const fetchContactGroups = async () => {
    try {
      setLoading(true);
      // Activar indicador de carga global
      useLoadingStore.getState().startLoading('Sincronizando contactos...');
      let userIdToUse = getCurrentUserId();
      
      console.log('Usuario actual:', user);
      console.log('ID de usuario inicial:', userIdToUse);
      console.log('¿Está autenticado?:', isAuthenticated);
      
      // Si el usuario está inactivo, intentar obtener el ID de otra fuente como localStorage
      if (!userIdToUse && localStorage.getItem('user')) {
        try {
          const localUser = JSON.parse(localStorage.getItem('user') || '{}');
          console.log('Usuario desde localStorage:', localUser);
          if (localUser && localUser.id) {
            userIdToUse = localUser.id;
            console.log('ID de usuario desde localStorage:', userIdToUse);
          }
        } catch (err) {
          console.error('Error al parsear usuario de localStorage:', err);
        }
      }
      
      // Para pruebas, si aún no hay ID, usar 56 como valor predeterminado
      if (!userIdToUse) {
        userIdToUse = 56; // ID de prueba
        console.log('Usando ID de prueba:', userIdToUse);
      }
      
      // Usar el nuevo endpoint que filtra directamente por ID de usuario
      const API_URL = 'http://34.238.122.213:1337';
      const url = `${API_URL}/api/proyecto-56s?populate=usuario&filters[usuario][id][$eq]=${userIdToUse}`;
      
      console.log('Consultando URL:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const jsonResponse = await response.json();
      console.log('Respuesta completa:', jsonResponse);
      
      // Procesar los datos si existen
      if (jsonResponse.data && jsonResponse.data.length > 0) {
        // Buscar el registro que contiene grupos de contactos independientemente del estado
        const contactsData = jsonResponse.data.find((item: StrapiContact) => 
          item && 
          item.gruposdecontactosJSON && 
          item.gruposdecontactosJSON.grupos
        );
        
        if (contactsData) {
          console.log('Datos de contacto encontrados:', contactsData);
          const groupsData = contactsData.gruposdecontactosJSON.grupos;
          setStrapiGroups(groupsData);
          
          // Actualizar también los grupos locales
          const groupNames = groupsData.map((group: ContactGroup) => group.nombre);
          setGroups([...new Set([...groups, ...groupNames])]);
          contactsService.saveAllGroups([...new Set([...groups, ...groupNames])]);
          
          // Sincronizar contactos del strapi con localStorage
          syncContactsFromStrapi(groupsData);
        } else {
          console.log('No se encontraron datos con grupos de contactos');
          // Para usuarios sin grupos, inicializar con grupo predeterminado
          const defaultGroups = ['General'];
          setGroups(defaultGroups);
          contactsService.saveAllGroups(defaultGroups);
          setStrapiGroups([]);
        }
      } else {
        // Usuario nuevo sin datos, inicializar con valores predeterminados
        console.log('No se encontraron datos para este usuario, inicializando valores predeterminados');
        const defaultGroups = ['General'];
        setGroups(defaultGroups);
        contactsService.saveAllGroups(defaultGroups);
        setStrapiGroups([]);
      }
    } catch (error) {
      console.error('Error al obtener grupos de contactos:', error);
      // Asegurar que se muestre el error al usuario
      alert('Error al sincronizar contactos: ' + error);
    } finally {
      setLoading(false);
      // IMPORTANTE: Asegurar que SIEMPRE se detenga el indicador de carga global
      useLoadingStore.getState().stopLoading();
    }
  };
  
  // Sincronizar contactos de Strapi a localStorage
  const syncContactsFromStrapi = (groupsData: ContactGroup[]) => {
    const existingContacts = contactsService.getAllContacts();
    const newContacts: Contact[] = [];
    
    groupsData.forEach(group => {
      group.contactos.forEach(contacto => {
        // Verificar si el contacto ya existe (por email)
        const existingContact = existingContacts.find(c => c.email === contacto.email);
        
        if (!existingContact) {
          // Añadir solo si no existe
          const newContact: Omit<Contact, 'id'> = {
            name: contacto.nombre,
            email: contacto.email,
            phone: contacto.telefono,
            group: group.nombre
          };
          
          const addedContact = contactsService.addContact(newContact);
          newContacts.push(addedContact);
        }
      });
    });
    
    // Actualizar la lista de contactos si se añadieron nuevos
    if (newContacts.length > 0) {
      setContacts(contactsService.getAllContacts());
    }
  };
  
  // Guardar grupos de contactos en Strapi
  const saveContactGroupsToStrapi = async (forceCreate = false) => {
    try {
      setLoading(true);
      let userIdToUse = getCurrentUserId();
      
      // Si no hay ID de usuario, intentar obtenerlo de localStorage o usar valor predeterminado 56
      if (!userIdToUse) {
        console.error('No hay usuario autenticado en store');
        console.log('Verificando datos en localStorage...');
        
        try {
          const localUser = JSON.parse(localStorage.getItem('user') || '{}');
          if (localUser && localUser.id) {
            userIdToUse = localUser.id;
            console.log('Usando ID de usuario desde localStorage:', userIdToUse);
          } else {
            // Para pruebas, usar el ID fijo
            userIdToUse = 56; // ID de prueba
            console.log('Usando ID de prueba:', userIdToUse);
          }
        } catch (err) {
          console.error('Error al parsear usuario de localStorage:', err);
          // Usar ID de prueba
          userIdToUse = 56;
          console.log('Usando ID de prueba después de error:', userIdToUse);
        }
      }
      
      // Convertir contactos locales a formato Strapi
      const allContacts = contactsService.getAllContacts();
      
      // Agrupar contactos por grupo y mantener los IDs existentes si es posible
      const groupsMap: { [key: string]: ContactGroup } = {};
      
      // Primero convertir los grupos existentes (de strapiGroups) a un mapa para preservar IDs
      strapiGroups.forEach(existingGroup => {
        groupsMap[existingGroup.nombre] = {
          id: existingGroup.id,
          nombre: existingGroup.nombre,
          contactos: [] // Lo llenaremos a continuación
        };
      });
      
      // Ahora agrupar los contactos por grupo
      allContacts.forEach(contact => {
        // Si el grupo no existe en el mapa, crearlo
        if (!groupsMap[contact.group]) {
          groupsMap[contact.group] = {
            id: `grupo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            nombre: contact.group,
            contactos: []
          };
        }
        
        // Añadir el contacto al grupo correspondiente
        groupsMap[contact.group].contactos.push({
          nombre: contact.name,
          email: contact.email,
          telefono: contact.phone
        });
      });
      
      // Convertir el mapa a un array de grupos
      const contactGroups: ContactGroup[] = Object.values(groupsMap);
      
      const gruposData: GroupsData = {
        grupos: contactGroups
      };
      
      // Usar el endpoint API directo que filtra por ID de usuario
      const API_URL = 'http://34.238.122.213:1337';
      const url = `${API_URL}/api/proyecto-56s?populate=usuario&filters[usuario][id][$eq]=${userIdToUse}`;
      
      console.log('Consultando URL para guardar:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const jsonResponse = await response.json();
      
      // Verificar si hay datos para este usuario
      const hasExistingData = jsonResponse.data && jsonResponse.data.length > 0;
      
      // Verificar si existe un registro con grupos de contactos
      const existingRecord = hasExistingData ? jsonResponse.data.find((item: StrapiContact) => 
        item && (item.gruposdecontactosJSON || forceCreate)
      ) : null;
      
      // Crear una cadena de emails para el campo contactos
      const emailsString = allContacts.map(c => c.email).join(', ');
      
      console.log('Hay datos existentes:', hasExistingData, 'Record encontrado:', !!existingRecord);
      
      if (existingRecord && !forceCreate) {
        // Actualizar registro existente - Usar el documentId en lugar del id numérico
        const documentId = existingRecord.documentId;
        
        console.log('Usando documentId para actualizar:', documentId);
        
        // URL para actualizar con el documentId
        const updateUrl = `${API_URL}/api/proyecto-56s/${documentId}`;
        
        // Exactamente la estructura solicitada
        const updateData = {
          data: {
            gruposdecontactosJSON: gruposData,
            contactos: emailsString
          }
        };
        
        console.log('Estructura enviada para actualizar:', JSON.stringify(updateData, null, 2));
        
        // Enviar petición PUT para actualizar
        const updateResponse = await fetch(updateUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });
        
        if (!updateResponse.ok) {
          throw new Error(`Error al actualizar: ${updateResponse.status}`);
        }
        
        const updateResult = await updateResponse.json();
        console.log('Actualización correcta:', updateResult);
      } else {
        // Crear nuevo registro
        const currentDate = new Date().toISOString();
        
        // URL para crear
        const createUrl = `${API_URL}/api/proyecto-56s`;
        
        // Datos a crear con la estructura exacta solicitada
        const createData = {
          data: {
            nombre: 'Gestión de Grupos de Contactos',
            Fechas: currentDate,
            estado: 'borrador',          // Usamos 'borrador' en lugar de 'sistema' para coincidir con tu ejemplo
            asunto: 'Sistema de Grupos',
            contenidoHTML: null,
            gruposdecontactosJSON: gruposData,
            contactos: emailsString,
            usuario: userIdToUse        // Asignamos directamente el ID de usuario (56)
          }
        };
        
        console.log('Estructura enviada para crear:', JSON.stringify(createData, null, 2));
        
        // Enviar petición POST para crear
        const createResponse = await fetch(createUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createData)
        });
        
        if (!createResponse.ok) {
          throw new Error(`Error al crear: ${createResponse.status}`);
        }
        
        const createResult = await createResponse.json();
        console.log('Creación correcta:', createResult);
      }
      
      // Actualizar estado local con los grupos de Strapi
      setStrapiGroups(contactGroups);
      console.log('Grupos de contactos guardados correctamente en Strapi');
    } catch (error) {
      console.error('Error al guardar grupos de contactos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const storedContacts = contactsService.getAllContacts();
    const storedGroups = contactsService.getAllGroups();
    
    setContacts(storedContacts);
    setGroups(storedGroups);
    
    // Cargar datos desde Strapi
    fetchContactGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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
  
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedContactIndex(null);
  };

  const handleAddContact = async (name: string, email: string, phone: string, group: string) => {
    // Usar el servicio para añadir el contacto
    contactsService.addContact({
      name,
      email,
      phone,
      group
    });
    
    // Actualizar el estado local
    setContacts(contactsService.getAllContacts());
    
    // Sincronizar con Strapi
    await saveContactGroupsToStrapi();
    
    handleCloseModals();
  };
  
  // Función para añadir un nuevo grupo
  const handleAddGroup = async (groupName: string) => {
    // Usar el servicio para añadir el grupo
    contactsService.addGroup(groupName);
    
    // Actualizar el estado local
    setGroups(contactsService.getAllGroups());
    
    // Para un usuario nuevo, necesitamos forzar la creación de un registro inicial
    // Verificar si hay grupos en Strapi
    const needsInitialRegistration = strapiGroups.length === 0;
    
    console.log('¿Necesita registro inicial?', needsInitialRegistration);
    
    // Sincronizar con Strapi - forzar creación si es un nuevo usuario
    await saveContactGroupsToStrapi(needsInitialRegistration);
  };

  const handleEditGroup = async (newGroup: string) => {
    if (selectedContactIndex === null) return;
    
    const contactToUpdate = contacts[selectedContactIndex];
    
    // Actualizar el contacto usando el servicio
    contactsService.updateContact(contactToUpdate.id, { group: newGroup });
    
    // Actualizar el estado local
    setContacts(contactsService.getAllContacts());
    
    // Sincronizar con Strapi
    await saveContactGroupsToStrapi();
    
    handleCloseModals();
  };
  
  // Función para sacar un contacto de un grupo
  const handleRemoveFromGroup = async (contactId: number) => {
    // Buscar el contacto
    const contactToUpdate = contacts.find(c => c.id === contactId);
    
    if (!contactToUpdate) return;
    
    // Asignar el contacto a "Sin grupo..."
    contactsService.updateContact(contactId, { group: 'Sin grupo...' });
    
    // Actualizar el estado local
    setContacts(contactsService.getAllContacts());
    
    // Sincronizar con Strapi
    await saveContactGroupsToStrapi();
    
    // Si el contacto que se está mostrando en la vista previa es modificado, actualizarlo
    if (selectedContact && selectedContact.id === contactId) {
      setSelectedContact({
        ...selectedContact,
        group: 'Sin grupo...'
      });
    }
    
    // Cerrar el modal de edición y abrir uno nuevo con la información actualizada
    if (showEditModal && selectedContactIndex !== null) {
      const updatedContacts = contactsService.getAllContacts();
      const currentContactIndex = updatedContacts.findIndex(c => c.id === contactToUpdate.id);
      if (currentContactIndex >= 0) {
        handleCloseModals();
        setTimeout(() => {
          setSelectedContactIndex(currentContactIndex);
          setShowEditModal(true);
        }, 100);
      }
    }
  };

  const handleDeleteContact = async () => {
    if (selectedContactIndex === null) return;
    
    const contactToDelete = contacts[selectedContactIndex];
    
    // Eliminar el contacto usando el servicio
    contactsService.removeContact(contactToDelete.id);
    
    // Actualizar el estado local
    setContacts(contactsService.getAllContacts());
    
    // Sincronizar con Strapi
    await saveContactGroupsToStrapi();
    
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
        <div>
          <button 
            style={{
              marginRight: '10px',
              padding: '10px 15px',
              backgroundColor: '#282A5B', 
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center'
            }}
            onClick={() => fetchContactGroups()}
            disabled={loading}
          >
            <FaSync style={{ marginRight: '5px' }} /> {loading ? 'Sincronizando...' : 'Sincronizar'}
          </button>
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
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Tabla de contactos (columna izquierda) */}
        <div style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderRadius: '5px', overflow: 'hidden', flex: 3 }}>
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
                <tr 
                  key={contact.id} 
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                    cursor: 'pointer',
                    ...(selectedContact?.id === contact.id ? { backgroundColor: '#f8e5e6' } : {})
                  }}
                  onClick={() => handleSelectContact(contact)}
                >
                  <td style={bodyCellStyle}>{contact.name}</td>
                  <td style={bodyCellStyle}>{contact.phone}</td>
                  <td style={bodyCellStyle}>{contact.group}</td>
                  <td style={actionsCellStyle}> 
                    <FaEdit 
                      style={actionIconStyle} 
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar que se seleccione el contacto
                        handleOpenEditModal(index);
                      }} 
                    />
                    <FaTrashAlt 
                      style={actionIconStyle} 
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar que se seleccione el contacto
                        handleOpenDeleteModal(index);
                      }} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Vista previa del contacto (columna derecha) */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'white', 
            borderRadius: '5px', 
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            height: '100%'
          }}>
            {selectedContact ? (
              <div>
                <h3 style={{ marginTop: 0, color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  Información de Contacto
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    backgroundColor: '#f0f0f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: '15px',
                    color: '#666'
                  }}>
                    <FaUser size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{selectedContact.name}</h4>
                    <span style={{ color: '#666', fontSize: '14px' }}>{selectedContact.group}</span>
                  </div>
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <FaEnvelope style={{ color: '#666', marginRight: '10px' }} />
                    <span>{selectedContact.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaPhoneAlt style={{ color: '#666', marginRight: '10px' }} />
                    <span>{selectedContact.phone}</span>
                  </div>
                </div>
                
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    style={{
                      padding: '8px 15px',
                      backgroundColor: '#282A5B',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    onClick={() => {
                      const index = contacts.findIndex(c => c.id === selectedContact.id);
                      if (index !== -1) {
                        handleOpenEditModal(index);
                      }
                    }}
                  >
                    Editar
                  </button>
                  
                  <button
                    style={{
                      padding: '8px 15px',
                      backgroundColor: '#F21A2B',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    onClick={() => {
                      const index = contacts.findIndex(c => c.id === selectedContact.id);
                      if (index !== -1) {
                        handleOpenDeleteModal(index);
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                color: '#999',
                textAlign: 'center',
                padding: '20px'
              }}>
                <FaUser size={40} style={{ marginBottom: '15px', opacity: 0.3 }} />
                <p>Selecciona un contacto para ver su información</p>
              </div>
            )}
          </div>
        </div>
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
        groups={groups}
        onAddGroup={handleAddGroup}
      />

      <EditGroupModal 
        isOpen={showEditModal}
        onClose={handleCloseModals}
        onSubmit={handleEditGroup}
        currentGroup={selectedContactIndex !== null ? contacts[selectedContactIndex]?.group : undefined}
        groups={groups}
        onAddGroup={handleAddGroup}
        contactsInGroup={selectedContactIndex !== null && contacts[selectedContactIndex]?.group 
          ? contacts.filter(c => c.group === contacts[selectedContactIndex].group) 
          : []}
        onRemoveFromGroup={handleRemoveFromGroup}
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
