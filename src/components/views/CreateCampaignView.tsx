import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPen, FaEye, FaSpinner } from 'react-icons/fa';
import EmailEditorComponent, { Design } from '../EmailEditor';
import campaignService from '../../services/campaignService';
import authService from '../../services/auth/authService';

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

  // Cargar datos guardados del localStorage al iniciar
  useEffect(() => {
    const savedCampaign = localStorage.getItem('currentCampaign');
    if (savedCampaign) {
      try {
        const parsedData = JSON.parse(savedCampaign);
        setCampaignData(parsedData);
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
  };

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
    
    // Guardar en localStorage para mantener compatibilidad con la vista de campañas
    localStorage.setItem('currentCampaign', JSON.stringify(campaignData));
    
    try {
      setFormState({ ...formState, isLoading: true, error: null, success: null });
      
      // Obtener el usuario actual
      const currentUser = authService.getCurrentUser();
      
      // Preparar datos para Strapi según la estructura de Proyecto_56
      // En Strapi, las relaciones se manejan de manera especial
      const strapiCampaignData = {
        nombre: campaignData.title,
        fechas: new Date().toISOString(),
        estado: 'borrador' as 'borrador' | 'programado' | 'enviado' | 'cancelado',
        // Para las relaciones en Strapi, necesitamos usar el formato correcto
        // Si es una relación uno a uno, usar: { connect: [{ id: currentUser?.id }] }
        // Si es una relación uno a muchos, usar: { connect: [{ id: currentUser?.id }] }
        usuarios: currentUser?.id ? { connect: [{ id: currentUser.id }] } : undefined,
        asunto: campaignData.subject,
        contenidoHTML: campaignData.emailHtml,
        // Convertir el diseño a JSON string para evitar problemas de estructura
        disenoJSON: campaignData.emailDesign ? JSON.stringify(campaignData.emailDesign) : undefined,
        contactos: campaignData.contactGroup
      };
      
      console.log('Datos a enviar a Strapi:', strapiCampaignData);
      
      // Enviar a Strapi
      await campaignService.createCampaign(strapiCampaignData);
      
      // Actualizar estado
      setFormState({
        isLoading: false,
        error: null,
        success: 'Campaña guardada exitosamente en Strapi'
      });
      
      // Opcional: Redirigir a la vista de campañas después de un tiempo
      setTimeout(() => {
        onBack();
      }, 2000);
      
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
              <label htmlFor="contactGroup" className="form-label text-muted small mb-1">Contactos</label>
              <select 
                className="form-select" 
                id="contactGroup"
                value={campaignData.contactGroup}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar</option>
                <option value="todos">Todos los contactos</option>
                <option value="grupo1">Grupo 1</option>
                <option value="grupo2">Grupo 2</option>
                <option value="grupo3">Grupo 3</option>
              </select>
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
