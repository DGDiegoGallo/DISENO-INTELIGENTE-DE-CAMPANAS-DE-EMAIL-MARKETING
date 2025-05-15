import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaCheck, FaChartBar, FaEye, FaUsers } from 'react-icons/fa';
import ABTestReportGenerator from '../../components/ABTestReportGenerator';
import * as abTestingService from '../../services/abTestingService';
import { processHtmlContent } from '../../services/abTestingService';
import * as contactsService from '../../services/contactsService';
import useLoadingStore from '../../store/useLoadingStore';
import { ABTest } from '../../services/abTestingService';
import { StrapiRichTextBlock } from '../../interfaces/strapi';

// Importar estilos
import {
  viewStyle,
  headerStyle,
  titleContainerStyle,
  titleStyle,
  backIconStyle,
  primaryButtonStyle
} from './viewStyles/CreateABTestView.styles';

// Props para manejar la navegación
interface CreateABTestViewProps {
  onNavigate: (view: string) => void;
}

// Tipo para campaign seleccionada
interface SelectedCampaign {
  id: number;
  nombre: string;
  asunto: string;
  contenidoHTML?: string | StrapiRichTextBlock[] | null;
  contactos?: string;
}

const CreateABTestView: React.FC<CreateABTestViewProps> = ({ onNavigate }) => {
  // Estados
  const [testName, setTestName] = useState('');
  const [campaigns, setCampaigns] = useState<Array<{id: number, nombre: string, fecha: string, asunto: string}>>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | ''>('');
  const [selectedCampaign, setSelectedCampaign] = useState<SelectedCampaign | null>(null);
  const [availableGroups, setAvailableGroups] = useState<string[]>([]);
  const [groupA, setGroupA] = useState('');
  const [groupB, setGroupB] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [previewA, setPreviewA] = useState(false);
  const [previewB, setPreviewB] = useState(false);
  const [simulatedResults, setSimulatedResults] = useState<abTestingService.ABTestResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Cargar campañas disponibles
  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      useLoadingStore.getState().startLoading();
      try {
        const availableCampaigns = await abTestingService.getAvailableCampaigns();
        // Filtrar campañas que no sean de "Sistema de Grupos"
        const filteredCampaigns = availableCampaigns.filter(campaign => {
          return campaign.asunto?.toLowerCase() !== 'sistema de grupos';
        });
        setCampaigns(filteredCampaigns);
      } catch (error) {
        console.error('Error al cargar campañas:', error);
        setErrorMessage('No se pudieron cargar las campañas. Por favor intente nuevamente.');
      } finally {
        setIsLoading(false);
        useLoadingStore.getState().stopLoading();
      }
    };

    const loadGroups = () => {
      const groups = abTestingService.getAvailableGroups();
      setAvailableGroups(groups);
    };

    loadCampaigns();
    loadGroups();
  }, []);

  // Cargar detalles de la campaña seleccionada
  const handleCampaignChange = useCallback(async (campaignId: number) => {
    if (!campaignId) {
      setSelectedCampaign(null);
      return;
    }

    setIsLoading(true);
    useLoadingStore.getState().startLoading();
    
    try {
      const campaignData = await abTestingService.getCampaignForABTest(campaignId);
      setSelectedCampaign(campaignData);
      // Si la campaña tiene un asunto, usarlo como nombre predeterminado
      if (campaignData.asunto && !testName) {
        setTestName(`Test A/B: ${campaignData.asunto}`);
      }
    } catch (error) {
      console.error('Error al cargar detalles de campaña:', error);
      setErrorMessage('No se pudieron cargar los detalles de la campaña seleccionada.');
      setSelectedCampaign(null);
    } finally {
      setIsLoading(false);
      useLoadingStore.getState().stopLoading();
    }
  }, [testName]);

  // Efecto para cargar campaña seleccionada
  useEffect(() => {
    if (selectedCampaignId && typeof selectedCampaignId === 'number') {
      handleCampaignChange(selectedCampaignId);
    }
  }, [selectedCampaignId, handleCampaignChange]);

  // Generar resultados simulados
  const generateResults = useCallback(() => {
    if (!groupA || !groupB) {
      setErrorMessage('Debe seleccionar los grupos A y B para generar resultados.');
      return;
    }

    const groupACount = abTestingService.getContactsCountInGroup(groupA);
    const groupBCount = abTestingService.getContactsCountInGroup(groupB);

    if (groupACount === 0 || groupBCount === 0) {
      setErrorMessage('Los grupos seleccionados no tienen contactos.');
      return;
    }

    const results = abTestingService.generateTestResults(groupACount, groupBCount);
    setSimulatedResults(results);
    setShowResults(true);
  }, [groupA, groupB]);

  // Guardar prueba A/B
  const saveABTest = useCallback(() => {
    if (!testName) {
      setErrorMessage('Debe ingresar un nombre para la prueba A/B.');
      return;
    }

    if (!selectedCampaign) {
      setErrorMessage('Debe seleccionar una campaña.');
      return;
    }

    if (!groupA || !groupB) {
      setErrorMessage('Debe seleccionar los grupos A y B.');
      return;
    }

    try {
      // Generar resultados si no existen
      if (!simulatedResults) {
        const groupACount = abTestingService.getContactsCountInGroup(groupA);
        const groupBCount = abTestingService.getContactsCountInGroup(groupB);
        const results = abTestingService.generateTestResults(groupACount, groupBCount);
        setSimulatedResults(results);
      }

      // Crear objeto de prueba A/B
      const abTest: ABTest = {
        id: `abtest-${Date.now()}`,
        name: testName,
        date: new Date().toISOString(),
        campaignId: selectedCampaign.id,
        campaignName: selectedCampaign.nombre,
        groupA,
        groupB,
        subject: selectedCampaign.asunto,
        emailHtmlA: selectedCampaign.contenidoHTML,
        emailHtmlB: selectedCampaign.contenidoHTML, // Inicialmente igual, se podría personalizar
        results: simulatedResults || undefined
      };

      // Guardar en localStorage
      abTestingService.saveABTest(abTest);

      // Mostrar mensaje de éxito
      setSuccessMessage('Prueba A/B guardada correctamente.');
      
      // Volver a la lista después de un breve retraso
      setTimeout(() => {
        onNavigate('Pruebas A/B');
      }, 1500);

    } catch (error) {
      console.error('Error al guardar prueba A/B:', error);
      setErrorMessage('Error al guardar la prueba A/B. Por favor intente nuevamente.');
    }
  }, [testName, selectedCampaign, groupA, groupB, simulatedResults, onNavigate]);

  // --- JSX --- 
  return (
    <div className="container-fluid py-4" style={{...viewStyle, height: '100vh', overflow: 'auto'}}>
      {/* Cabecera */}
      <div style={headerStyle} className="mb-4">
        <div style={titleContainerStyle}>
          <FaArrowLeft 
            style={backIconStyle}
            onClick={() => onNavigate('Pruebas A/B')} 
          />
          <h2 style={titleStyle}>Crear prueba A/B</h2>
        </div>
        <button 
          style={primaryButtonStyle} 
          onClick={saveABTest}
          disabled={isLoading || !selectedCampaign || !groupA || !groupB}
        >
          Guardar prueba
        </button>
      </div>

      {/* Mensajes de error/éxito */}
      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {/* Formulario Superior */}
      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="test-name">Nombre de la prueba A/B</label>
            <input 
              type="text" 
              className="form-control" 
              id="test-name" 
              value={testName} 
              onChange={(e) => setTestName(e.target.value)}
              placeholder="Ej: Test de asunto - Promoción verano"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="campaign-select">Seleccionar campaña existente</label>
            <select 
              className="form-select" 
              id="campaign-select"
              value={selectedCampaignId} 
              onChange={(e) => setSelectedCampaignId(Number(e.target.value) || '')}
            >
              <option value="">Seleccione una campaña</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.nombre} - {campaign.fecha}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedCampaign && (
          <div className="mt-3">
            <div className="p-3 bg-light rounded mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-2">Información de la campaña seleccionada:</h6>
                {selectedCampaign.contenidoHTML && (
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setPreviewA(!previewA)}
                  >
                    <FaEye className="me-1" /> {previewA ? 'Ocultar preview' : 'Ver preview'}
                  </button>
                )}
              </div>
              <div><strong>Nombre:</strong> {selectedCampaign.nombre}</div>
              <div><strong>Asunto:</strong> {selectedCampaign.asunto}</div>
              {selectedCampaign.contactos && (
                <div><strong>Contactos originales:</strong> {selectedCampaign.contactos}</div>
              )}
            </div>
            
            {/* Vista previa del contenido HTML */}
            {previewA && selectedCampaign.contenidoHTML && (
              <div className="bg-white p-3 rounded shadow-sm mb-3">
                <h6 className="border-bottom pb-2 mb-3">Vista previa del contenido de email</h6>
                <div 
                  className="border p-3 rounded" 
                  style={{maxHeight: '300px', overflowY: 'auto'}} 
                  dangerouslySetInnerHTML={{ __html: processHtmlContent(selectedCampaign.contenidoHTML) }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Columnas Grupo A y Grupo B */}
      {selectedCampaign && (
        <div className="row g-4 mb-4">
          {/* Columna Grupo A */}
          <div className="col-md-6">
            <div className="bg-white p-4 rounded shadow-sm h-100">
              <h5 className="border-bottom pb-2 mb-3">Grupo A</h5>
              <div className="mb-3">
                <label className="form-label" htmlFor="group-a-contacts">Seleccionar grupo de contactos</label>
                <select 
                  className="form-select" 
                  id="group-a-contacts"
                  value={groupA}
                  onChange={(e) => setGroupA(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="todos">Todos los contactos</option>
                  {availableGroups.map((group, idx) => (
                    <option key={idx} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              {groupA && (
                <div className="mt-2 p-2 bg-light rounded border">
                  <div className="d-flex align-items-center mb-1">
                    <FaUsers className="text-muted me-1" />
                    <span className="text-muted">Destinatarios: {abTestingService.getContactsCountInGroup(groupA)} contactos</span>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button 
                      className="btn btn-sm btn-outline-secondary" 
                      onClick={() => setPreviewA(!previewA)}
                    >
                      <FaEye /> {previewA ? 'Ocultar' : 'Ver'} contactos
                    </button>
                  </div>
                  {previewA && (
                    <div className="mt-2 border-top pt-2">
                      <div className="text-truncate" style={{maxHeight: '100px', overflowY: 'auto'}}>
                        {groupA === 'todos' 
                          ? contactsService.getEmailsFromGroups(contactsService.getAllGroups())
                          : contactsService.emailArrayToString(contactsService.getEmailsByGroup(groupA))
                        }
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Columna Grupo B */}
          <div className="col-md-6">
            <div className="bg-white p-4 rounded shadow-sm h-100">
              <h5 className="border-bottom pb-2 mb-3">Grupo B</h5>
              <div className="mb-3">
                <label className="form-label" htmlFor="group-b-contacts">Seleccionar grupo de contactos</label>
                <select 
                  className="form-select" 
                  id="group-b-contacts"
                  value={groupB}
                  onChange={(e) => setGroupB(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option value="todos">Todos los contactos</option>
                  {availableGroups.map((group, idx) => (
                    <option key={idx} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              {groupB && (
                <div className="mt-2 p-2 bg-light rounded border">
                  <div className="d-flex align-items-center mb-1">
                    <FaUsers className="text-muted me-1" />
                    <span className="text-muted">Destinatarios: {abTestingService.getContactsCountInGroup(groupB)} contactos</span>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button 
                      className="btn btn-sm btn-outline-secondary" 
                      onClick={() => setPreviewB(!previewB)}
                    >
                      <FaEye /> {previewB ? 'Ocultar' : 'Ver'} contactos
                    </button>
                  </div>
                  {previewB && (
                    <div className="mt-2 border-top pt-2">
                      <div className="text-truncate" style={{maxHeight: '100px', overflowY: 'auto'}}>
                        {groupB === 'todos' 
                          ? contactsService.getEmailsFromGroups(contactsService.getAllGroups())
                          : contactsService.emailArrayToString(contactsService.getEmailsByGroup(groupB))
                        }
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sección de Simulador de Resultados */}
      {selectedCampaign && groupA && groupB && (
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <h5 className="mb-3">Simulador de Resultados</h5>
          <p className="text-muted">Genere resultados simulados para su prueba A/B para visualizar el análisis que se podrá realizar.</p>
          
          <div className="d-flex gap-3 mb-4">
            <button 
              className="btn btn-primary" 
              onClick={generateResults}
              disabled={isLoading}
            >
              <FaChartBar className="me-2" />
              Generar resultados simulados
            </button>
          </div>
          
          {showResults && simulatedResults && (
            <div className="mt-3">
              <h6>Resultados simulados:</h6>
              <div className="row">
                <div className="col-md-6">
                  <div className="border rounded p-3 mb-3">
                    <h5 className="border-bottom pb-2">Grupo A: {groupA}</h5>
                    <div className="row g-2">
                      <div className="col-6">Emails enviados: <strong>{simulatedResults.groupA.sent}</strong></div>
                      <div className="col-6">Emails abiertos: <strong>{simulatedResults.groupA.opened}</strong></div>
                      <div className="col-6">Clicks: <strong>{simulatedResults.groupA.clicked}</strong></div>
                      <div className="col-6">Conversiones: <strong>{simulatedResults.groupA.converted}</strong></div>
                      <div className="col-12">Ingresos generados: <strong>${simulatedResults.groupA.revenue}</strong></div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="border rounded p-3 mb-3">
                    <h5 className="border-bottom pb-2">Grupo B: {groupB}</h5>
                    <div className="row g-2">
                      <div className="col-6">Emails enviados: <strong>{simulatedResults.groupB.sent}</strong></div>
                      <div className="col-6">Emails abiertos: <strong>{simulatedResults.groupB.opened}</strong></div>
                      <div className="col-6">Clicks: <strong>{simulatedResults.groupB.clicked}</strong></div>
                      <div className="col-6">Conversiones: <strong>{simulatedResults.groupB.converted}</strong></div>
                      <div className="col-12">Ingresos generados: <strong>${simulatedResults.groupB.revenue}</strong></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="alert alert-success mt-3">
                <FaCheck className="me-2" />
                <strong>Análisis:</strong> {' '}
                {simulatedResults.groupA.opened / simulatedResults.groupA.sent > 
                 simulatedResults.groupB.opened / simulatedResults.groupB.sent
                  ? 'El Grupo A tiene mejor tasa de apertura.'
                  : 'El Grupo B tiene mejor tasa de apertura.'} {' '}
                {simulatedResults.groupA.revenue > simulatedResults.groupB.revenue
                  ? 'El Grupo A generó más ingresos.'
                  : 'El Grupo B generó más ingresos.'}
              </div>
              
              <div className="mt-3">
                <ABTestReportGenerator 
                  testData={{
                    id: `temp-${Date.now()}`,
                    name: testName || 'Prueba A/B sin nombre',
                    date: new Date().toISOString(),
                    campaignId: Number(selectedCampaignId),
                    campaignName: selectedCampaign?.nombre || '',
                    groupA: groupA,
                    groupB: groupB,
                    subject: selectedCampaign?.asunto || '',
                    results: simulatedResults
                  }}
                  buttonLabel="Generar informe PDF"
                  buttonVariant="outline-danger"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateABTestView;
