import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaChartBar } from 'react-icons/fa';
import useLoadingStore from '../../../store/useLoadingStore';
import campaignService, { Campaign } from '../../../services/campaignService';
import * as abTestingService from '../../../services/abTestingComparisonService';
import { TestResults } from './interfaces/testResults';
import { transformStrapiCollection, transformStrapiSingle } from '../../../services/strapiHelpers';

// Componentes
import CampaignSelector from './components/CampaignSelector';
import CampaignPreview from './components/CampaignPreview';
import TestResultsDisplay from './components/TestResultsDisplay';

// Estilos
import {
  viewStyle,
  headerStyle,
  titleContainerStyle,
  titleStyle,
  backIconStyle,
  buttonStyle,
  disabledButtonStyle,
  contentContainerStyle,
  errorMessageStyle,
  successMessageStyle,
  previewContainerStyle,
  previewHeaderStyle,
  previewTitleContainerStyle,
  previewTitleStyle,
  previewContentStyle
} from './styles/CreateABTestView.styles';

interface CreateABTestViewProps {
  onNavigate: (view: string) => void;
}

const CreateABTestView: React.FC<CreateABTestViewProps> = ({ onNavigate }) => {
  // Estados
  const [testName, setTestName] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignAId, setCampaignAId] = useState<number | null>(null);
  const [campaignBId, setCampaignBId] = useState<number | null>(null);
  const [campaignA, setCampaignA] = useState<Campaign | null>(null);
  const [campaignB, setCampaignB] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCampaignA, setLoadingCampaignA] = useState(false);
  const [loadingCampaignB, setLoadingCampaignB] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Función para cargar campañas disponibles
  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    useLoadingStore.getState().startLoading();
    
    try {
      const response = await campaignService.getAllCampaigns(1, 50);
      console.log('Respuesta Strapi completa:', response);
      
      const formattedCampaigns = transformStrapiCollection<Campaign>(response);
      console.log('Campañas formateadas:', formattedCampaigns);
      
      // Filtrar la campaña "Gestión de Grupos de Contactos"
      const filteredCampaigns = formattedCampaigns.filter(campaign => 
        campaign.nombre !== 'Gestión de Grupos de Contactos'
      );
      
      setCampaigns(filteredCampaigns);
    } catch (error) {
      console.error('Error al cargar campañas:', error);
      setErrorMessage('No se pudieron cargar las campañas. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
      useLoadingStore.getState().stopLoading();
    }
  }, []);

  // Cargar campañas al montar el componente
  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  // Función para buscar una campaña existente o cargarla desde la API
  const loadCampaignDetails = useCallback(async (
    campaignId: number,
    setCampaign: React.Dispatch<React.SetStateAction<Campaign | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setCampaignId: React.Dispatch<React.SetStateAction<number | null>>,
    campaignLabel: string,
    updateTestName: boolean = false
  ) => {
    if (!campaignId) {
      setCampaign(null);
      setCampaignId(null);
      return;
    }

    setLoading(true);
    useLoadingStore.getState().startLoading();
    
    try {
      // Buscar primero la campaña en las ya cargadas para evitar llamadas innecesarias a la API
      const existingCampaign = campaigns.find(c => c.id === campaignId);
      
      if (existingCampaign) {
        console.log(`Usando campaña ${campaignLabel} existente:`, existingCampaign);
        setCampaign(existingCampaign);
        setCampaignId(campaignId);
        
        // Actualizar nombre del test si es necesario
        if (updateTestName && existingCampaign.asunto && !testName) {
          setTestName(`Comparación: ${existingCampaign.asunto}`);
        }
      } else {
        // Si no la encontramos en las ya cargadas, hacer una llamada a la API
        console.log(`Cargando campaña ${campaignLabel} con ID:`, campaignId);
        const response = await campaignService.getCampaignById(campaignId);
        console.log(`Respuesta campaña ${campaignLabel}:`, response);
        
        const formattedCampaign = transformStrapiSingle<Campaign>(response);
        console.log(`Campaña ${campaignLabel} formateada:`, formattedCampaign);
        
        if (formattedCampaign) {
          // Asegurarse de que tiene todos los campos requeridos
          if (!formattedCampaign.estado) {
            formattedCampaign.estado = 'borrador';
          }
          
          setCampaign(formattedCampaign);
          setCampaignId(campaignId);
          
          // Actualizar nombre del test si es necesario
          if (updateTestName && formattedCampaign.asunto && !testName) {
            setTestName(`Comparación: ${formattedCampaign.asunto}`);
          }
        }
      }
    } catch (error) {
      console.error(`Error al cargar detalles de campaña ${campaignLabel}:`, error);
      setErrorMessage(`No se pudieron cargar los detalles de la campaña ${campaignLabel}.`);
      setCampaign(null);
      setCampaignId(null);
    } finally {
      setLoading(false);
      useLoadingStore.getState().stopLoading();
    }
  }, [campaigns, testName]);

  // Cargar detalles de la campaña A seleccionada
  const handleCampaignAChange = useCallback(async (campaignId: number) => {
    await loadCampaignDetails(
      campaignId,
      setCampaignA,
      setLoadingCampaignA,
      setCampaignAId,
      'A',
      true // Actualizar nombre del test
    );
  }, [loadCampaignDetails]);

  // Cargar detalles de la campaña B seleccionada
  const handleCampaignBChange = useCallback(async (campaignId: number) => {
    await loadCampaignDetails(
      campaignId,
      setCampaignB,
      setLoadingCampaignB,
      setCampaignBId,
      'B',
      false // No actualizar nombre del test
    );
  }, [loadCampaignDetails]);

  // Validar datos antes de generar resultados
  const validateTestData = useCallback((): boolean => {
    // Validar que ambas campañas estén seleccionadas
    if (!campaignA || !campaignB) {
      setErrorMessage('Debe seleccionar dos campañas para comparar.');
      return false;
    }

    // Validar que se haya ingresado un nombre para la prueba
    if (!testName.trim()) {
      setErrorMessage('Debe ingresar un nombre para la prueba A/B.');
      return false;
    }

    // Validar que no se esté comparando la misma campaña
    if (campaignA.id === campaignB.id) {
      setErrorMessage('No se puede comparar la misma campaña. Por favor seleccione dos campañas diferentes.');
      return false;
    }

    return true;
  }, [campaignA, campaignB, testName]);

  // Generar resultados de la prueba A/B
  const generateResults = useCallback(() => {
    if (!validateTestData()) return;

    try {
      // Generar resultados simulados
      const results = abTestingService.generateTestResults(campaignA!, campaignB!, testName);
      setTestResults(results);
      setShowResults(true);
      setErrorMessage('');
      
      // Desplazarse hacia los resultados
      setTimeout(() => {
        window.scrollTo({ 
          top: document.getElementById('results-section')?.offsetTop || 0,
          behavior: 'smooth'
        });
      }, 100);
    } catch (error) {
      console.error('Error al generar resultados:', error);
      setErrorMessage('Error al generar los resultados de la prueba A/B.');
    }
  }, [campaignA, campaignB, testName, validateTestData]);

  // Guardar la prueba A/B
  const saveTest = useCallback(() => {
    if (!testResults || !campaignA || !campaignB) {
      setErrorMessage('No hay resultados para guardar. Por favor genere resultados primero.');
      return;
    }

    try {
      // Guardar prueba A/B en localStorage
      abTestingService.saveABTest(testName, campaignA, campaignB, testResults);
      
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
  }, [testResults, campaignA, campaignB, testName, onNavigate]);

  return (
    <div className="container-fluid py-4" style={viewStyle}>
      {/* Cabecera */}
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <FaArrowLeft 
            style={backIconStyle}
            onClick={() => onNavigate('Pruebas A/B')}
            title="Volver a la lista"
          />
          <h2 style={titleStyle}>Crear prueba A/B</h2>
        </div>
        <button 
          style={testResults ? buttonStyle : disabledButtonStyle}
          onClick={saveTest}
          disabled={!testResults}
        >
          Guardar prueba
        </button>
      </div>

      {/* Mensajes */}
      {errorMessage && (
        <div style={errorMessageStyle}>
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div style={successMessageStyle}>
          {successMessage}
        </div>
      )}

      {/* Formulario */}
      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="test-name">Nombre de la prueba A/B</label>
            <input
              className="form-control"
              id="test-name"
              type="text"
              placeholder="Ej: Comparación de asuntos - Newsletter Mayo"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Selección de campañas */}
      <h4 className="mb-3">Selección de campañas a comparar</h4>
      
      <div style={contentContainerStyle}>
        <div>
          <CampaignSelector
            label="Campaña A"
            campaigns={campaigns}
            selectedCampaignId={campaignAId}
            onChange={handleCampaignAChange}
            disabled={isLoading || loadingCampaignA}
            isLoading={loadingCampaignA}
            excludeCampaignId={campaignBId} // Excluir la campaña B si está seleccionada
          />
          
          {campaignA && (
            <>
              <CampaignPreview 
                campaign={campaignA}
                title="Previsualización de Campaña A"
                loading={loadingCampaignA}
              />
              
              {/* Vista previa del HTML */}
              {campaignA.contenidoHTML && (
                <div style={previewContainerStyle}>
                  <div style={previewHeaderStyle}>
                    <div style={previewTitleContainerStyle}>
                      <h4 style={previewTitleStyle}>Vista previa del correo</h4>
                    </div>
                    <div 
                      style={previewContentStyle}
                      dangerouslySetInnerHTML={{ 
                        __html: typeof campaignA.contenidoHTML === 'string' 
                          ? campaignA.contenidoHTML 
                          : Array.isArray(campaignA.contenidoHTML)
                            ? campaignA.contenidoHTML.map(block => 
                                block.children?.map(child => child.text || '').join(' ') || ''
                              ).join('\n')
                            : ''
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <CampaignSelector
            label="Campaña B"
            campaigns={campaigns}
            selectedCampaignId={campaignBId}
            onChange={handleCampaignBChange}
            disabled={isLoading || loadingCampaignB}
            isLoading={loadingCampaignB}
            excludeCampaignId={campaignAId} // Excluir la campaña A si está seleccionada
          />
          
          {campaignB && (
            <>
              <CampaignPreview 
                campaign={campaignB}
                title="Previsualización de Campaña B"
                loading={loadingCampaignB}
              />
              
              {/* Vista previa del HTML */}
              {campaignB.contenidoHTML && (
                <div style={previewContainerStyle}>
                  <div style={previewHeaderStyle}>
                    <div style={previewTitleContainerStyle}>
                      <h4 style={previewTitleStyle}>Vista previa del correo</h4>
                    </div>
                    <div 
                      style={previewContentStyle}
                      dangerouslySetInnerHTML={{ 
                        __html: typeof campaignB.contenidoHTML === 'string' 
                          ? campaignB.contenidoHTML 
                          : Array.isArray(campaignB.contenidoHTML)
                            ? campaignB.contenidoHTML.map(block => 
                                block.children?.map(child => child.text || '').join(' ') || ''
                              ).join('\n')
                            : ''
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Botón Generar Resultados */}
      <div className="text-center mb-4">
        <button
          style={campaignA && campaignB ? buttonStyle : disabledButtonStyle}
          onClick={generateResults}
          disabled={!campaignA || !campaignB}
        >
          <FaChartBar style={{ marginRight: '8px' }} />
          Generar resultado de la comparación
        </button>
      </div>

      {/* Sección de resultados */}
      <div id="results-section">
        {showResults && testResults && (
          <TestResultsDisplay
            results={testResults}
            campaignA={campaignA}
            campaignB={campaignB}
          />
        )}
      </div>
    </div>
  );
};

export default CreateABTestView;
