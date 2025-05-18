import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import { FaArrowLeft, FaPen, FaEye, FaUsers } from 'react-icons/fa';
import EmailEditorComponent from '../EmailEditor';
import { Design } from '../../interfaces/emailEditor';
import campaignService from '../../services/campaignService';
import authService from '../../services/auth/authService';
import * as contactsService from '../../services/contactsService';
import useLoadingStore from '../../store/useLoadingStore';
// Import modal styles from ABTesting view styles
import {
  modalOverlayStyle,
  modalContentStyle,
  modalTextStyle,
  modalActionsStyle,
  modalButtonPrimaryStyle,
  modalButtonSecondaryStyle
} from './ABTesting/styles/CreateABTestView.styles';

interface CreateCampaignViewProps {
  onBack: () => void; // Función para volver a la vista anterior
}

interface CampaignData {
  title: string;
  subject: string;
  contactGroup: string;
  scheduledTime: string;
  emailDesign: Design | undefined;
  emailHtml: string;
}

// Estado para manejar la carga y errores
interface FormState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const CreateCampaignView: React.FC<CreateCampaignViewProps> = ({ onBack }) => {
  const [showEmailEditor, setShowEmailEditor] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    title: '',
    subject: '',
    contactGroup: '',
    scheduledTime: '',
    emailDesign: undefined,
    emailHtml: ''
  });
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null,
    success: null
  });
  const [availableGroups, setAvailableGroups] = useState<string[]>([]);
  const [emailsPreview, setEmailsPreview] = useState<string>('');
  const [showNoContactsModal, setShowNoContactsModal] = useState(false); // State for the modal on send
  const [showNoGroupsAvailableModal, setShowNoGroupsAvailableModal] = useState(false); // State for modal if no groups exist on load

  const navigate = useNavigate(); 

  // Cargar datos guardados del localStorage al iniciar
  useEffect(() => {
    // Función para cargar grupos desde Strapi
    const fetchContactGroups = async () => {
      try {
        setFormState(prev => ({ ...prev, isLoading: true }));
        useLoadingStore.getState().startLoading('Cargando grupos de contactos...');
        
        // Obtener el usuario actual
        const currentUser = authService.getCurrentUser();
        const userId = currentUser?.id || 56; // Valor por defecto si no hay usuario
        
        console.log('Usuario actual en CreateCampaignView:', currentUser);
        console.log('ID de usuario para consulta de grupos:', userId);
        
        // Primero cargar grupos desde localStorage como respaldo inicial
        const localGroups = contactsService.getAllGroups().filter(group => group !== 'General');
        setAvailableGroups(localGroups); // Establecer grupos locales inicialmente
        
        // Consultar si existe el registro "Gestión de Grupos de Contactos"
        const API_URL = 'http://34.238.122.213:1337';
        const url = `${API_URL}/api/proyecto-56s?populate=usuario&filters[usuario][id][$eq]=${userId}&filters[nombre][$eq]=Gestión de Grupos de Contactos`;
        
        console.log('Consultando URL para obtener grupos de contactos:', url);
        
        const response = await fetch(url);
        
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log('Respuesta completa de Strapi (Gestión de Grupos):', jsonResponse);
          
          if (jsonResponse.data && jsonResponse.data.length > 0) {
            interface StrapiContactItem {
              nombre?: string;
              gruposdecontactosJSON?: {
                grupos?: Array<{
                  id: string;
                  nombre: string;
                  contactos: Array<{
                    nombre: string;
                    email: string;
                    telefono: string;
                  }>;
                }>;
              };
            }
            
            const contactsData = jsonResponse.data.find((item: StrapiContactItem) => 
              item && 
              item.nombre === 'Gestión de Grupos de Contactos' &&
              item.gruposdecontactosJSON && 
              item.gruposdecontactosJSON.grupos
            );
            
            if (contactsData && contactsData.gruposdecontactosJSON && contactsData.gruposdecontactosJSON.grupos) {
              console.log('Datos de grupos encontrados en Strapi:', contactsData.gruposdecontactosJSON.grupos);
              
              // Extraer nombres de grupos desde Strapi
              interface GroupItem {
                id: string;
                nombre: string;
                contactos: Array<{
                  nombre: string;
                  email: string;
                  telefono: string;
                }>;
              }
              
              const strapiGroupNames = contactsData.gruposdecontactosJSON.grupos.map((group: GroupItem) => group.nombre);
              
              // Combinar con grupos locales
              const allLoadedGroups = contactsService.getAllGroups();
              const combinedGroups = [...new Set([...allLoadedGroups, ...strapiGroupNames])];
              
              // Filtrar el grupo General
              const filteredGroups = combinedGroups.filter(group => group !== 'General');
              
              // Actualizar estado y localStorage
              setAvailableGroups(filteredGroups);
              contactsService.saveAllGroups(combinedGroups);
              
              console.log('Grupos disponibles actualizados desde Strapi:', filteredGroups);
              
              // Si hay grupos de Strapi, no mostrar el modal
              if (filteredGroups.length > 0) {
                setShowNoGroupsAvailableModal(false);
                return; // Salir de la función si encontramos grupos
              }
            }
          }
        }
        
        // Si llegamos aquí, es porque no se encontraron grupos adicionales en Strapi
        // Verificar si los grupos locales son suficientes
        if (localGroups.length === 0) {
          // No hay grupos ni en Strapi ni en localStorage
          console.log('No se encontraron grupos ni en Strapi ni en localStorage');
          setShowNoGroupsAvailableModal(true);
        } else {
          // Hay grupos en localStorage pero no adicionales en Strapi
          console.log('Se encontraron grupos solo en localStorage:', localGroups);
          setShowNoGroupsAvailableModal(false);
        }  
      } catch (error) {
        console.error('Error al obtener grupos de contactos desde Strapi:', error);
      } finally {
        setFormState(prev => ({ ...prev, isLoading: false }));
        useLoadingStore.getState().stopLoading();
      }
    };
    
    // Ejecutar la función para cargar grupos desde Strapi
    fetchContactGroups();
    
    // Cargar campaña guardada si existe
    const savedCampaign = localStorage.getItem('currentCampaign');
    if (savedCampaign) {
      try {
        const parsedData = JSON.parse(savedCampaign);
        setCampaignData(prev => ({ 
          ...prev, 
          title: parsedData.title || '', 
          subject: parsedData.subject || '', 
          contactGroup: parsedData.contactGroup || '', 
          scheduledTime: parsedData.scheduledTime || '', 
          emailDesign: parsedData.emailDesign, 
          emailHtml: parsedData.emailHtml || ''
        }));
        if (parsedData.emailHtml) {
          setPreviewHtml(parsedData.emailHtml);
        }
      } catch (error) {
        console.error('Error al cargar la campaña guardada:', error);
      }
    }
  }, []);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setCampaignData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Si se cambió el grupo de contactos, actualizar la vista previa de correos
    if (id === 'contactGroup') {
      updateEmailsPreview(value);
    }
  };
  
  // Función para actualizar la vista previa de correos según el grupo seleccionado
  const updateEmailsPreview = useCallback((groupName: string) => {
    if (!groupName) {
      setEmailsPreview('');
      return;
    }
    
    if (groupName === 'todos') {
      // Obtener todos los correos de todos los grupos
      const allEmails = contactsService.getEmailsFromGroups(availableGroups);
      setEmailsPreview(allEmails);
    } else {
      // Obtener correos del grupo específico
      const groupEmails = contactsService.getEmailsByGroup(groupName);
      setEmailsPreview(contactsService.emailArrayToString(groupEmails));
    }
  }, [availableGroups]);

  // Efecto para actualizar la vista previa de correos cuando cambie el grupo seleccionado
  useEffect(() => {
    if (campaignData.contactGroup) {
      updateEmailsPreview(campaignData.contactGroup);
    } else {
      setEmailsPreview(''); // Limpiar vista previa si no hay grupo seleccionado
    }
  }, [campaignData.contactGroup, updateEmailsPreview]);

  const handleSaveEmailDesign = (design: Design, html: string) => {
    setCampaignData(prev => ({
      ...prev,
      emailDesign: design,
      emailHtml: html
    }));
    setPreviewHtml(html);
    setShowEmailEditor(false);
  };

  const handleSendCampaign = async () => {
    // Si hay datos faltantes, no continuar
    if (!campaignData.title || !campaignData.subject || !campaignData.contactGroup || !campaignData.emailDesign) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    
    // Validar que la fecha de envío no sea en el pasado
    if (campaignData.scheduledTime) {
      const scheduledDate = new Date(campaignData.scheduledTime);
      const currentDate = new Date();
      
      if (scheduledDate < currentDate) {
        setFormState({
          isLoading: false,
          error: 'No puedes programar una campaña con hora de envío en el pasado',
          success: null
        });
        return;
      }
    }

    // Iniciar proceso de envío
    setFormState({
      isLoading: true,
      error: null,
      success: null
    });
    
    // Activar el indicador de carga global
    useLoadingStore.getState().startLoading('Guardando campaña...');

  // Añadir duración artificial de 1 segundo al spinner
  setTimeout(() => {
    setFormState(prevState => ({
      ...prevState,
      isLoading: false, // Ocultar spinner local si existe
    }));
    useLoadingStore.getState().stopLoading(); // Ocultar spinner global
  }, 1000);
    
    // Validar que se haya seleccionado un grupo de contactos específico
    // Modal should appear if no group, 'todos', or 'General' is selected.
    if (campaignData.contactGroup === '' || campaignData.contactGroup === 'todos') {
      setFormState({
        isLoading: false,
        error: 'Por favor, selecciona un grupo de contactos específico o crea uno.',
        success: null
      });
      setShowNoContactsModal(true); 
      useLoadingStore.getState().stopLoading();
      return;
    }
    
    // Guardar en localStorage para mantener compatibilidad con la vista de campañas
    localStorage.setItem('currentCampaign', JSON.stringify(campaignData));
    
    try {
      // Obtener el usuario actual
      const currentUser = authService.getCurrentUser();
      const userId = currentUser?.id || 56; // Valor por defecto si no hay usuario
      
      // Obtener correos electrónicos según el grupo seleccionado
      let contactEmails = '';
      
      // Definir interfaces para el formato correcto de gruposdecontactosJSON
      interface ContactoParaGrupo {
        nombre: string;
        email: string;
        telefono: string;
      }
      
      interface GrupoDeContactos {
        id: string;
        nombre: string;
        contactos: ContactoParaGrupo[];
      }
      
      interface GruposdecontactosData {
        grupos: GrupoDeContactos[];
      }
      
      // Inicializar con el formato correcto
      const gruposdecontactosData: GruposdecontactosData = { grupos: [] };
      
      // Primero intentar obtener los grupos desde el registro "Gestión de Grupos de Contactos"
      // para mantener los IDs consistentes
      const API_URL = 'http://34.238.122.213:1337';
      let existingGroups: GrupoDeContactos[] = [];
      
      try {
        // Obtener el usuario actual
        const currentUser = authService.getCurrentUser();
        const userId = currentUser?.id || 56; // Valor por defecto si no hay usuario
        
        // Consultar si existe el registro "Gestión de Grupos de Contactos"
        const url = `${API_URL}/api/proyecto-56s?populate=usuario&filters[usuario][id][$eq]=${userId}&filters[nombre][$eq]=Gestión de Grupos de Contactos`;
        const response = await fetch(url);
        
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log('Respuesta completa de Strapi (Gestión de Grupos):', jsonResponse);
          
          if (jsonResponse.data && jsonResponse.data.length > 0) {
            const contactsData = jsonResponse.data.find((item: {
              nombre?: string,
              gruposdecontactosJSON?: {
                grupos?: GrupoDeContactos[]
              }
            }) => 
              item && 
              item.nombre === 'Gestión de Grupos de Contactos' &&
              item.gruposdecontactosJSON && 
              item.gruposdecontactosJSON.grupos
            );
            
            if (contactsData && contactsData.gruposdecontactosJSON && contactsData.gruposdecontactosJSON.grupos) {
              existingGroups = contactsData.gruposdecontactosJSON.grupos;
              console.log('Grupos existentes encontrados:', existingGroups);
            }
          }
        }
      } catch (error) {
        console.error('Error al obtener grupos existentes:', error);
        // Continuar con la lógica normal si hay un error
      }
      
      if (campaignData.contactGroup === 'todos') {
        // Obtener todos los correos de todos los grupos
        contactEmails = contactsService.getEmailsFromGroups(availableGroups);
        
        // Usar los grupos existentes o crear nuevos si no existen
        gruposdecontactosData.grupos = availableGroups.map(groupName => {
          // Buscar si el grupo ya existe en los grupos obtenidos de Strapi
          const existingGroup = existingGroups.find(g => g.nombre === groupName);
          
          if (existingGroup) {
            // Si existe, usar el mismo ID pero actualizar los contactos
            const contactos = contactsService.getContactsByGroup(groupName);
            return {
              id: existingGroup.id,
              nombre: groupName,
              contactos: contactos.map(contact => ({
                nombre: contact.name,
                email: contact.email,
                telefono: contact.phone
              }))
            };
          } else {
            // Si no existe, crear uno nuevo
            const contactos = contactsService.getContactsByGroup(groupName);
            return {
              id: `grupo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              nombre: groupName,
              contactos: contactos.map(contact => ({
                nombre: contact.name,
                email: contact.email,
                telefono: contact.phone
              }))
            };
          }
        });
      } else {
        // Obtener correos del grupo específico
        const groupEmails = contactsService.getEmailsByGroup(campaignData.contactGroup);
        contactEmails = contactsService.emailArrayToString(groupEmails);
        
        // Buscar si el grupo ya existe en los grupos obtenidos de Strapi
        const existingGroup = existingGroups.find(g => g.nombre === campaignData.contactGroup);
        
        // Obtener datos del grupo específico
        const groupContacts = contactsService.getContactsByGroup(campaignData.contactGroup);
        
        if (existingGroup) {
          // Si existe, usar el mismo ID pero actualizar los contactos
          gruposdecontactosData.grupos = [
            {
              id: existingGroup.id,
              nombre: campaignData.contactGroup,
              contactos: groupContacts.map(contact => ({
                nombre: contact.name,
                email: contact.email,
                telefono: contact.phone
              }))
            }
          ];
        } else {
          // Si no existe, crear uno nuevo
          gruposdecontactosData.grupos = [
            {
              id: `grupo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              nombre: campaignData.contactGroup,
              contactos: groupContacts.map(contact => ({
                nombre: contact.name,
                email: contact.email,
                telefono: contact.phone
              }))
            }
          ];
        }
      }
      
      // Ya no generamos documentId aquí, ya que parece que es generado automáticamente por Strapi
      
      // Definir la interfaz para Contacto
      interface Contact {
        id: number;
        name: string;
        email: string;
        phone: string;
        group: string;
      }
      
      // Crear la estructura para interacciones de destinatarios
      // Obtener todos los contactos afectados, ya sea de un grupo o de todos los grupos
      let allContactsToTrack: Contact[] = [];
      
      if (campaignData.contactGroup === 'todos') {
        // Obtener contactos de todos los grupos
        availableGroups.forEach(groupName => {
          const groupContacts = contactsService.getContactsByGroup(groupName);
          allContactsToTrack = [...allContactsToTrack, ...groupContacts];
        });
      } else {
        // Obtener contactos del grupo específico
        allContactsToTrack = contactsService.getContactsByGroup(campaignData.contactGroup);
      }
      
      // Eliminar duplicados por email (un contacto podría estar en múltiples grupos)
      const uniqueContacts = allContactsToTrack.filter((contact, index, self) =>
        index === self.findIndex(c => c.email === contact.email)
      );
      
      // Crear estructura de interacciones para cada destinatario
      // Vamos a crear un objeto que contenga cada destinatario como entrada
      interface DestinatarioInteraccion {
        email_destinatario: string;
        se_registro_en_pagina: boolean;
        dinero_gastado: string;
      }
      
      const destinatarios: Record<string, DestinatarioInteraccion> = {};
      
      // Para cada contacto, crear un registro en interaccion_destinatario
      uniqueContacts.forEach(contact => {
        // Usamos el email como clave para cada destinatario
        const emailKey = contact.email.replace(/[@.]/g, '_'); // Reemplazar @ y . para crear claves válidas
        
        destinatarios[emailKey] = {
          email_destinatario: contact.email,
          se_registro_en_pagina: false,
          dinero_gastado: "0"
        };
      });
      
      // Estructurar el objeto de interacciones como solicitado
      // Si no hay contactos, establecer como null
      const interaccion_destinatario = Object.keys(destinatarios).length > 0 ? destinatarios : null;
      
      // Preparar datos para el servicio de campaña
      // Estos datos son compatibles con la interfaz ExtendedCampaignData
      const campaignPayload = {
        title: campaignData.title,
        subject: campaignData.subject,
        emailHtml: campaignData.emailHtml,
        // Convertir emailDesign a Record<string, unknown> compatible con ExtendedCampaignData
        emailDesign: campaignData.emailDesign as unknown as Record<string, unknown>,
        // Usar la fecha programada seleccionada por el usuario
        // Asegurarnos de que está en UTC para guardar correctamente
        Fechas: campaignData.scheduledTime ? new Date(campaignData.scheduledTime).toISOString() : new Date().toISOString(),
        // Campo adicional para mostrar la fecha en formato Argentina (opcional, solo para depuración)
        fechaArgentina: campaignData.scheduledTime ? new Date(campaignData.scheduledTime).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }) : null,
        estado: 'programado' as const,
        contactos: contactEmails,
        gruposdecontactosJSON: gruposdecontactosData as unknown as Record<string, unknown>,
        interaccion_destinatario: interaccion_destinatario as Record<string, unknown> | undefined,
        se_registro_en_pagina: null,
        dinero_gastado: null,
        email_destinatario: null,
        usuario: userId
      };
      
      console.log('Datos a enviar a Strapi:', campaignPayload);
      
      try {
        // Enviar los datos al servicio de campaña, que se encarga de formatearlos para Strapi
        const strapiResponse = await campaignService.createCampaign(campaignPayload);
        
        console.log('Campaña guardada con éxito en Strapi:', strapiResponse);
        
        Swal.fire({
          title: '¡Éxito!',
          text: 'Campaña enviada/programada con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#F21A2B'
        });

        setFormState({
          isLoading: false,
          error: null,
          success: null // Success message is now handled by Swal
        });

        // Limpiar el formulario y localStorage después de enviar
        setCampaignData({
          title: '',
          subject: '',
          contactGroup: '',
          scheduledTime: '',
          emailDesign: undefined,
          emailHtml: ''
        });
        localStorage.removeItem('currentCampaign');
        setPreviewHtml('');
        setEmailsPreview('');

        // Opcional: Volver a la vista anterior automáticamente
        // onBack();
      } catch (error) {
        console.error('Error al guardar la campaña en Strapi:', error);
        
        // Manejo seguro del mensaje de error
        let errorMessage = 'Hubo un problema al guardar la campaña';
        if (error instanceof Error) {
          errorMessage += ': ' + error.message;
        }
        
        setFormState({
          isLoading: false,
          error: errorMessage,
          success: null
        });
        
        // Desactivar el indicador de carga global
        useLoadingStore.getState().stopLoading();
      }
    } catch (error) {
      console.error('Error al guardar la campaña en Strapi:', error);
      setFormState({
        isLoading: false,
        error: 'Error al guardar la campaña en Strapi. Por favor intenta nuevamente.',
        success: null
      });
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Otras funciones del componente pueden ir aquí

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 56px)' }}>
      {/* Mensajes de estado */}
      {formState.error && (
        <div className="alert alert-danger mb-3" role="alert">
          {formState.error}
        </div>
      )}
      
      {formState.success && (
        <div className="alert alert-success mb-3" role="alert">
          {formState.success}
        </div>
      )}
      
      {/* Encabezado y botones principales */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <button onClick={onBack} className="btn btn-link text-dark p-0 me-3" style={{ fontSize: '1.2rem' }}>
            <FaArrowLeft />
          </button>
          <h2 className="mb-0 fw-bold" style={{ fontSize: '1.5rem' }}>Crear campaña</h2>
        </div>
        
        <div>
          <button 
            onClick={handleSendCampaign}
            className="btn text-white fw-bold px-4 py-2" 
            style={{ backgroundColor: '#F21A2B', borderRadius: '8px' }}
            disabled={formState.isLoading || !campaignData.title || !campaignData.subject || !campaignData.contactGroup || !campaignData.emailDesign}
          >
            {formState.isLoading ? 'Guardando...' : 'Enviar'}
          </button>
        </div>
      </div>

      {/* Contenido del formulario y diseño */}
      <div className="row g-4">
        {/* Columna del formulario */}
        <div className="col-lg-5">
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="mb-3">
              <label htmlFor="title" className="form-label text-muted small mb-1">Título</label>
              <input 
                type="text" 
                className="form-control" 
                id="title" 
                placeholder="Título de la campaña" 
                value={campaignData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="subject" className="form-label text-muted small mb-1">Asunto</label>
              <input 
                type="text" 
                className="form-control" 
                id="subject" 
                placeholder="Asunto del correo" 
                value={campaignData.subject}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contactGroup" className="form-label text-muted small mb-1">Grupo de contactos</label>
              <select 
                className="form-select" 
                id="contactGroup"
                value={campaignData.contactGroup}
                onChange={handleInputChange}
                disabled={formState.isLoading}
              >
                <option value="">Seleccionar un grupo</option>
                {/* Conditionally render 'Todos los contactos' only if there are other specific groups */}
                {availableGroups.length > 0 && (
                  <option value="todos">Todos los contactos</option>
                )}
                {availableGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              {formState.error && formState.error.includes('grupo de contactos') && (
                <div className="invalid-feedback">{formState.error}</div>
              )}
              {/* Previsualización de emails */}
              {emailsPreview && (
                <div className="mt-2 p-2 border rounded bg-light" style={{ fontSize: '0.85rem' }}>
                  <div className="d-flex align-items-center mb-1">
                    <FaUsers className="text-muted me-1" />
                    <span className="text-muted">Destinatarios:</span>
                  </div>
                  <div className="text-truncate" style={{ maxHeight: '60px', overflowY: 'auto' }}>
                    {emailsPreview}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="scheduledTime" className="form-label text-muted small mb-1">Hora de envío</label>
              <input 
                type="datetime-local" 
                className={`form-control ${formState.error && formState.error.includes('hora de envío') ? 'is-invalid' : ''}`} 
                id="scheduledTime" 
                value={campaignData.scheduledTime}
                onChange={handleInputChange}
                min={new Date().toISOString().slice(0, 16)}
              />
              {formState.error && formState.error.includes('hora de envío') && (
                <div className="invalid-feedback">{formState.error}</div>
              )}
              <small className="text-muted mt-1 d-block">Selecciona una fecha y hora actual o futura</small>
            </div>
          </div>
        </div>

        {/* Columna del diseño de correo */}
        <div className="col-lg-7">
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold">Diseña el contenido de tu correo electrónico</h5>
              {previewHtml && (
                <button 
                  onClick={togglePreview} 
                  className="btn btn-sm btn-outline-secondary"
                  title={showPreview ? "Ocultar vista previa" : "Mostrar vista previa"}
                >
                  <FaEye /> {showPreview ? "Ocultar" : "Vista previa"}
                </button>
              )}
            </div>
            
            <button 
              className="btn text-white fw-bold w-100 mb-3 py-2" 
              style={{ backgroundColor: '#F21A2B', borderRadius: '8px' }}
              onClick={() => setShowEmailEditor(true)}
            >
              Diseñar contenido
            </button>
            
            {/* Área de previsualización */}
            {previewHtml ? (
              <div className="border rounded overflow-hidden">
                {showPreview ? (
                  <div 
                    className="p-3" 
                    style={{ maxHeight: '400px', overflowY: 'auto' }}
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                ) : (
                  <div className="p-3 text-center bg-light">
                    <p className="text-muted mb-0">Contenido de correo diseñado. Haz clic en "Vista previa" para ver.</p>
                    <div className="d-flex justify-content-center mt-2">
                      <button 
                        className="btn btn-sm text-white" 
                        style={{ backgroundColor: '#F21A2B' }}
                        onClick={() => setShowEmailEditor(true)}
                      >
                        <FaPen className="me-1" /> Editar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border rounded p-3 text-center bg-light">
                <p className="text-muted">
                  No has diseñado el contenido del correo aún. Haz clic en "Diseñar contenido" para comenzar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for No Contacts Selected */}
      {showNoContactsModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <p style={modalTextStyle}>
              No has seleccionado ningún grupo de contactos para esta campaña.
              <br />
              Por favor, selecciona un grupo o crea uno en la sección de Contactos.
            </p>
            <div style={modalActionsStyle}>
              <button 
                style={modalButtonSecondaryStyle} 
                onClick={() => setShowNoContactsModal(false)}
              >
                Entendido
              </button>
              <button 
                style={modalButtonPrimaryStyle} 
                onClick={() => {
                  setShowNoContactsModal(false);
                  navigate('/dashboard/contacts'); 
                }}
              >
                Ir a Contactos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for No Groups Available on Load */}
      {showNoGroupsAvailableModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <p style={modalTextStyle}>
              No tienes grupos de contactos creados.
              <br />
              Para enviar campañas, primero necesitas crear al menos un grupo en la sección de Contactos.
            </p>
            <div style={modalActionsStyle}>
              <button 
                style={modalButtonSecondaryStyle} 
                onClick={() => setShowNoGroupsAvailableModal(false)}
              >
                Entendido
              </button>
              <button 
                style={modalButtonPrimaryStyle} 
                onClick={() => {
                  setShowNoGroupsAvailableModal(false);
                  navigate('/dashboard/contacts'); // Navigate to contacts view
                }}
              >
                Ir a Contactos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor de correo electrónico */}
      {showEmailEditor && (
        <EmailEditorComponent 
          onSave={handleSaveEmailDesign}
          onClose={() => setShowEmailEditor(false)}
          initialDesign={campaignData.emailDesign}
        />
      )}
    </div>
  );
};

export default CreateCampaignView;
