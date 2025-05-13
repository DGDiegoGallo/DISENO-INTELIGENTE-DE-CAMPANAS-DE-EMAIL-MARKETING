import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaPen, FaEye, FaSpinner, FaUsers } from 'react-icons/fa';
import EmailEditorComponent from '../EmailEditor';
import { Design } from '../../interfaces/emailEditor';
import campaignService from '../../services/campaignService';
import authService from '../../services/auth/authService';
import * as contactsService from '../../services/contactsService';

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

  // Cargar datos guardados del localStorage al iniciar
  useEffect(() => {
    // Cargar grupos disponibles
    const groups = contactsService.getAllGroups();
    setAvailableGroups(groups);
    
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
    // Validar datos requeridos
    if (!campaignData.title || !campaignData.subject || !campaignData.emailHtml) {
      setFormState({
        ...formState,
        error: 'Por favor completa todos los campos obligatorios: título, asunto y diseño del correo',
        success: null
      });
      return;
    }
    
    // Validar que se haya seleccionado un grupo de contactos
    if (!campaignData.contactGroup) {
      setFormState({
        ...formState,
        error: 'Por favor selecciona un grupo de contactos para enviar la campaña',
        success: null
      });
      return;
    }
    
    // Guardar en localStorage para mantener compatibilidad con la vista de campañas
    localStorage.setItem('currentCampaign', JSON.stringify(campaignData));
    
    try {
      setFormState({ ...formState, isLoading: true, error: null, success: null });
      
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
      
      if (campaignData.contactGroup === 'todos') {
        // Obtener todos los correos de todos los grupos
        contactEmails = contactsService.getEmailsFromGroups(availableGroups);
        
        // Obtener todos los grupos y sus contactos
        gruposdecontactosData.grupos = availableGroups.map(groupName => {
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
        });
      } else {
        // Obtener correos del grupo específico
        const groupEmails = contactsService.getEmailsByGroup(campaignData.contactGroup);
        contactEmails = contactsService.emailArrayToString(groupEmails);
        
        // Obtener datos del grupo específico
        const groupContacts = contactsService.getContactsByGroup(campaignData.contactGroup);
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
        Fechas: new Date().toISOString(),
        estado: 'borrador' as const,
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
        await campaignService.createCampaign(campaignPayload);
        
        setFormState({
          isLoading: false,
          error: null,
          success: '¡La campaña se ha creado correctamente!'
        });
        
        // Limpiar localStorage después de una creación exitosa
        localStorage.removeItem('currentCampaign');
        
        // Mostrar en consola los datos enviados para depuración
        console.log('Campaña creada exitosamente con los siguientes contactos:', campaignPayload.contactos);
      } catch (error) {
        console.error('Error al guardar la campaña:', error);
        
        let errorMessage = 'No se pudo guardar la campaña, intenta de nuevo.';
        // Intentar extraer el mensaje de error de la respuesta, si existe
        if (error instanceof Error) {
          errorMessage = `Error: ${error.message}`;
        }
        
        setFormState({
          isLoading: false,
          error: errorMessage,
          success: null
        });
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

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 56px)' }}>
      {/* Encabezado */}
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
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <button onClick={onBack} className="btn btn-link text-dark p-0 me-3" style={{ fontSize: '1.2rem' }}>
            <FaArrowLeft />
          </button>
          <h2 className="mb-0 fw-bold" style={{ fontSize: '1.5rem' }}>Crear campaña</h2>
        </div>
        <button 
          onClick={handleSendCampaign}
          className="btn text-white fw-bold px-4 py-2" 
          style={{ backgroundColor: '#F21A2B', borderRadius: '8px' }}
          disabled={formState.isLoading}
        >
          {formState.isLoading ? (
            <>
              <FaSpinner className="fa-spin me-2" /> Guardando...
            </>
          ) : (
            'Enviar'
          )}
        </button>
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
              >
                <option value="">Seleccionar un grupo</option>
                <option value="todos">Todos los contactos</option>
                {availableGroups.map((group, index) => (
                  <option key={index} value={group}>{group}</option>
                ))}
              </select>
              
              {emailsPreview && (
                <div className="mt-2 p-2 bg-light rounded border" style={{ fontSize: '0.8rem' }}>
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
                className="form-control" 
                id="scheduledTime" 
                value={campaignData.scheduledTime}
                onChange={handleInputChange}
              />
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
