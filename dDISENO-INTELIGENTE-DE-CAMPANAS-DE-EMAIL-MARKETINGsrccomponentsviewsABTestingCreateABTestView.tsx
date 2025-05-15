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
const viewStyle: React.CSSProperties = {
  padding: '25px',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f8f9fa'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px'
};

const titleContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: '#333',
  fontSize: '22px'
};

const backIconStyle: React.CSSProperties = {
  color: '#555',
  cursor: 'pointer',
  fontSize: '18px'
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#F21A2B',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px'
};

const disabledButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#ccc',
  cursor: 'not-allowed'
};

const contentContainerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '20px'
};

const messageStyle: React.CSSProperties = {
  padding: '10px 15px',
  borderRadius: '4px',
  marginBottom: '15px'
};

const errorMessageStyle: React.CSSProperties = {
  ...messageStyle,
  backgroundColor: '#f8d7da',
  color: '#721c24',
  border: '1px solid #f5c6cb'
};

const successMessageStyle: React.CSSProperties = {
  ...messageStyle,
  backgroundColor: '#d4edda',
  color: '#155724',
  border: '1px solid #c3e6cb'
};

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

  // Cargar campañas disponibles
  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      useLoadingStore.getState().startLoading();
      
      try {
        // Obtener las campañas con populate y paginación adecuada
        const response = await campaignService.getAllCampaigns(1, 50);
        console.log('Respuesta Strapi completa:', response);
        
        // Transforma la respuesta de Strapi a un formato plano
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
    };

    loadCampaigns();
  }, []);

  // Cargar detalles de la campaña A seleccionada
  const handleCampaignAChange = useCallback(async (campaignId: number) => {
    if (!campaignId) {
      setCampaignA(null);
      setCampaignAId(null);
      return;
    }

    setLoadingCampaignA(true);
    useLoadingStore.getState().startLoading();
    
    try {
      // Buscar primero la campaña en las ya cargadas para evitar llamadas innecesarias a la API
      const existingCampaign = campaigns.find(c => c.id === campaignId);
      
      if (existingCampaign) {
        console.log('Usando campaña A existente:', existingCampaign);
        // Ya tenemos los datos, no es necesario hacer otra llamada API
        setCampaignA(existingCampaign);
        setCampaignAId(campaignId);
        
        // Si la campaña tiene un asunto, usarlo como nombre predeterminado para el test
        if (existingCampaign.asunto && !testName) {
          setTestName(`Comparación: ${existingCampaign.asunto}`);
        }
      } else {
        // Si no la encontramos en las ya cargadas, hacer una llamada a la API
        console.log('Cargando campaña A con ID:', campaignId);
        const response = await campaignService.getCampaignById(campaignId);
        console.log('Respuesta campaña A:', response);
        
        const formattedCampaign = transformStrapiSingle<Campaign>(response);
        console.log('Campaña A formateada:', formattedCampaign);
        
        if (formattedCampaign) {
          // Asegurarse de que tiene todos los campos requeridos
          if (!formattedCampaign.estado) {
            formattedCampaign.estado = 'borrador';
          }
          
          setCampaignA(formattedCampaign);
          setCampaignAId(campaignId);
          
          // Si la campaña tiene un asunto, usarlo como nombre predeterminado para el test
          if (formattedCampaign.asunto && !testName) {
            setTestName(`Comparación: ${formattedCampaign.asunto}`);
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar detalles de campaña A:', error);
      setErrorMessage('No se pudieron cargar los detalles de la campaña A.');
      setCampaignA(null);
      setCampaignAId(null);
    } finally {
      setLoadingCampaignA(false);
      useLoadingStore.getState().stopLoading();
    }
  }, [testName, campaigns]);

  // Cargar detalles de la campaña B seleccionada
  const handleCampaignBChange = useCallback(async (campaignId: number) => {
    if (!campaignId) {
      setCampaignB(null);
      setCampaignBId(null);
      return;
    }

    setLoadingCampaignB(true);
    useLoadingStore.getState().startLoading();
    
    try {
      // Buscar primero la campaña en las ya cargadas para evitar llamadas innecesarias a la API
      const existingCampaign = campaigns.find(c => c.id === campaignId);
      
      if (existingCampaign) {
        console.log('Usando campaña B existente:', existingCampaign);
        // Ya tenemos los datos, no es necesario hacer otra llamada API
        setCampaignB(existingCampaign);
        setCampaignBId(campaignId);
      } else {
        // Si no la encontramos en las ya cargadas, hacer una llamada a la API
        console.log('Cargando campaña B con ID:', campaignId);
        const response = await campaignService.getCampaignById(campaignId);
        console.log('Respuesta campaña B:', response);
        
        const formattedCampaign = transformStrapiSingle<Campaign>(response);
        console.log('Campaña B formateada:', formattedCampaign);
        
        if (formattedCampaign) {
          // Asegurarse de que tiene todos los campos requeridos
          if (!formattedCampaign.estado) {
            formattedCampaign.estado = 'borrador';
          }
          
          setCampaignB(formattedCampaign);
          setCampaignBId(campaignId);
        }
      }
    } catch (error) {
      console.error('Error al cargar detalles de campaña B:', error);
      setErrorMessage('No se pudieron cargar los detalles de la campaña B.');
      setCampaignB(null);
      setCampaignBId(null);
    } finally {
      setLoadingCampaignB(false);
      useLoadingStore.getState().stopLoading();
    }
  }, [campaigns]);

  // Generar resultados de la prueba A/B
  const generateResults = useCallback(() => {
    // Validar que ambas campañas estén seleccionadas
    if (!campaignA || !campaignB) {
      setErrorMessage('Debe seleccionar dos campañas para comparar.');
      return;
    }

    // Validar que se haya ingresado un nombre para la prueba
    if (!testName.trim()) {
      setErrorMessage('Debe ingresar un nombre para la prueba A/B.');
      return;
    }

    // Validar que no se esté comparando la misma campaña
    if (campaignA.id === campaignB.id) {
      setErrorMessage('No se puede comparar la misma campaña. Por favor seleccione dos campañas diferentes.');
      return;
    }

    try {
      // Generar resultados simulados
      const results = abTestingService.generateTestResults(campaignA, campaignB, testName);
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
  }, [campaignA, campaignB, testName]);

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
                <div style={{ marginTop: '15px' }}>
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <h4 style={{ margin: 0, fontSize: '16px' }}>Vista previa del correo</h4>
                    </div>
                    <div 
                      style={{ 
                        border: '1px solid #e0e0e0', 
                        borderRadius: '4px', 
                        backgroundColor: 'white',
                        padding: '10px',
                        maxHeight: '300px',
                        overflowY: 'auto'
                      }}
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
                <div style={{ marginTop: '15px' }}>
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <h4 style={{ margin: 0, fontSize: '16px' }}>Vista previa del correo</h4>
                    </div>
                    <div 
                      style={{ 
                        border: '1px solid #e0e0e0', 
                        borderRadius: '4px', 
                        backgroundColor: 'white',
                        padding: '10px',
                        maxHeight: '300px',
                        overflowY: 'auto'
                      }}
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
