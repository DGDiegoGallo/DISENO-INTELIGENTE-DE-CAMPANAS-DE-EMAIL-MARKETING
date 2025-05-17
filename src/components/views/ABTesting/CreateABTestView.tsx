import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
// FaUndo is now used in ActionButtons.tsx
import useLoadingStore from '../../../store/useLoadingStore';
import useUserStore from '../../../store/useUserStore'; 
import campaignService, { Campaign } from '../../../services/campaignService';
import * as abTestingService from '../../../services/abTestingComparisonService';
import { TestResults } from './interfaces/testResults';
import { transformStrapiCollection, transformStrapiSingle } from '../../../services/strapiHelpers';
import { toast } from 'react-toastify';

// Componentes
import LoadingSpinner from '../../common/LoadingSpinner';
// CampaignSelector and CampaignPreview will be used within CampaignSelectionCard
import TestResultsDisplay from './components/TestResultsDisplay';
import ActionButtons from './components/ActionButtons';
import ABTestFormHeader from './components/ABTestFormHeader';
import ABTestNameInput from './components/ABTestNameInput';
import CampaignSelectionCard from './components/CampaignSelectionCard';

// Estilos
import {
  titleStyle,
  headerStyle,
  viewStyle,
  titleContainerStyle,
  contentContainerStyle,
  errorMessageStyle,
  successMessageStyle, 
  previewContainerStyle,
  previewHeaderStyle,
  previewTitleContainerStyle,
  previewTitleStyle,
  previewContentStyle,
  formSectionStyle, 
  sectionTitleStyle, 
  buttonStyle,
  disabledButtonStyle,
  buttonHoverStyle,
  modalOverlayStyle,
  modalContentStyle,
  modalTextStyle,
  modalActionsStyle,
  modalButtonPrimaryStyle,
  modalButtonSecondaryStyle
} from './styles/CreateABTestView.styles';

const CreateABTestView: React.FC = () => {
  const navigate = useNavigate(); 
  // Hover states for buttons will be managed within ActionButtons.tsx
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
  const [isGeneratingResults, setIsGeneratingResults] = useState(false);
  const [showMinCampaignsModal, setShowMinCampaignsModal] = useState(false);

  const currentUser = useUserStore(state => state.user); // Get current user object
  const currentUserId = currentUser?.id; // Get user ID from user object

  // Función para hacer scroll a la sección de resultados
  const scrollToResults = useCallback(() => {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Función para cargar campañas disponibles
  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    useLoadingStore.getState().startLoading();
    setErrorMessage(''); 
    setSuccessMessage(''); 
    
    try {
      const response = await campaignService.getAllCampaigns(1, 50);
      
      const formattedCampaigns = transformStrapiCollection<Campaign>(response);
      
      let userFilteredCampaigns: Campaign[] = [];
      if (currentUserId) {
        userFilteredCampaigns = formattedCampaigns.filter(campaign => {
          let campaignOwnerId: number | string | undefined;
          if (campaign.usuario && typeof campaign.usuario === 'object' && 'id' in campaign.usuario) {
            // With improved typing, direct access should be possible
            campaignOwnerId = campaign.usuario.id;
          } else if (typeof campaign.usuario === 'number') { // campaign.usuario can also be a number
            campaignOwnerId = campaign.usuario;
          } else if (typeof campaign.usuario === 'string') { // Or a string, though less common for IDs
            campaignOwnerId = campaign.usuario;
          }
          return campaignOwnerId === currentUserId;
        });
      } else {
        console.warn('No current user ID found. Campaigns will be empty for A/B test selection.');
      }
      
      const finalFilteredCampaigns = userFilteredCampaigns.filter(campaign => 
        campaign.nombre !== 'Gestión de Grupos de Contactos'
      );
      
      if (finalFilteredCampaigns.length < 2) {
        setShowMinCampaignsModal(true);
      }

      setCampaigns(finalFilteredCampaigns);

      if (finalFilteredCampaigns.length === 0) {
        toast.info('No se encontraron campañas para el usuario actual que puedan usarse en un Test A/B.');
      } else if (finalFilteredCampaigns.length === 1) {
        toast.warn(`Solo se encontró 1 campaña disponible. Necesitas al menos 2 para un Test A/B.`);
      } else { // 2 or more campaigns
        toast.success(`Se cargaron ${finalFilteredCampaigns.length} campañas para el Test A/B.`);
      }

    } catch (error) {
      console.error('Error al cargar campañas:', error);
      setErrorMessage('No se pudieron cargar las campañas. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
      useLoadingStore.getState().stopLoading();
    }
  }, [currentUserId]); 

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
      const existingCampaign = campaigns.find(c => c.id === campaignId);
      
      if (existingCampaign) {
        console.log(`Usando campaña ${campaignLabel} existente:`, existingCampaign);
        setCampaign(existingCampaign);
        setCampaignId(campaignId);
        
        if (updateTestName && existingCampaign.asunto && !testName) {
          setTestName(`Comparación: ${existingCampaign.asunto}`);
        }
      } else {
        console.log(`Cargando campaña ${campaignLabel} con ID:`, campaignId);
        const response = await campaignService.getCampaignById(campaignId);
        console.log(`Respuesta campaña ${campaignLabel}:`, response);
        
        const formattedCampaign = transformStrapiSingle<Campaign>(response);
        console.log(`Campaña ${campaignLabel} formateada:`, formattedCampaign);
        
        if (formattedCampaign) {
          if (!formattedCampaign.estado) {
            formattedCampaign.estado = 'borrador';
          }
          
          setCampaign(formattedCampaign);
          setCampaignId(campaignId);
          
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
      true 
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
      false 
    );
  }, [loadCampaignDetails]);

  // Validar datos antes de generar resultados
  const validateTestData = useCallback((): boolean => {
    if (!campaignA || !campaignB) {
      setErrorMessage('Debe seleccionar dos campañas para comparar.');
      return false;
    }

    if (!testName.trim()) {
      setErrorMessage('Debe ingresar un nombre para la prueba A/B.');
      return false;
    }

    if (campaignA.id === campaignB.id) {
      setErrorMessage('No se puede comparar la misma campaña. Por favor seleccione dos campañas diferentes.');
      return false;
    }

    return true;
  }, [campaignA, campaignB, testName]);

  // Generar resultados de la prueba A/B
  const generateResults = useCallback(async () => {
    if (!validateTestData()) return;

    setIsGeneratingResults(true);
    setErrorMessage('');
    setSuccessMessage(''); 
    setTestResults(null);
    setShowResults(false);
    
    console.log('Attempting to generate A/B test results...');
    console.log('Campaign A:', campaignA);
    console.log('Campaign B:', campaignB);

    try {
      if (!campaignA || !campaignB) {
        setErrorMessage('Las campañas A y B deben estar seleccionadas.');
        return; 
      }

      const newResults = abTestingService.generateTestResults(campaignA, campaignB, testName);
      console.log('Resultados de la comparación:', newResults);
      
      setTestResults(newResults);
      setShowResults(true); 
      
      try {
        abTestingService.saveABTest(testName, campaignA, campaignB, newResults);
        setSuccessMessage('Resultados generados y guardados en localStorage con éxito.');
      } catch (saveError) {
        console.error('Error al guardar la prueba A/B en localStorage:', saveError);
        setErrorMessage('Resultados generados, pero error al guardar en localStorage.');
      }

    } catch (error) {
      console.error('Error al generar resultados A/B:', error);
      setErrorMessage('Error al generar los resultados. Por favor, intente de nuevo.');
      setShowResults(false);
    } finally {
      setTimeout(() => {
        setIsGeneratingResults(false);
        console.log('Finished generating A/B test results attempt after delay. isGeneratingResults:', false);
        if (document.getElementById('results-section')) {
          scrollToResults();
        }
      }, 2000);
    }
  }, [campaignA, campaignB, testName, validateTestData, scrollToResults]);

  // Función para reiniciar el estado de la prueba A/B
  const handleResetTest = useCallback(() => {
    setTestName('');
    setCampaignAId(null);
    setCampaignBId(null);
    setCampaignA(null);
    setCampaignB(null);
    setErrorMessage('');
    setSuccessMessage('');

    if (testResults && testResults.testId) {
      try {
        const deleted = abTestingService.deleteTest(testResults.testId);
        if (deleted) {
          console.log(`A/B Test ${testResults.testId} deleted from localStorage.`);
        } else {
          console.warn(`A/B Test ${testResults.testId} not found in localStorage or already deleted.`);
        }
      } catch (error) {
        console.error('Error deleting A/B Test from localStorage:', error);
      }
    }

    setTestResults(null);
    setShowResults(false);
    setIsGeneratingResults(false); 

    const formElement = document.getElementById('test-name');
    if (formElement) {
      formElement.focus();
      const yOffset = -80; 
      const y = formElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    } else {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }, [testResults]); 

  return (
    <div style={viewStyle}>
      {isGeneratingResults && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LoadingSpinner isVisible={true} text="Generando resultados..." />
        </div>
      )}

      <ABTestFormHeader 
        headerStyle={headerStyle}
        titleContainerStyle={titleContainerStyle}
        titleStyle={titleStyle}
      />

      {errorMessage && <div style={errorMessageStyle}>{errorMessage}</div>}
      {successMessage && <div style={successMessageStyle}>{successMessage}</div>}

      <ABTestNameInput 
        testName={testName}
        onTestNameChange={setTestName}
        formSectionStyle={formSectionStyle}
      />
      
      <h4 style={sectionTitleStyle}>Selección de campañas a comparar</h4>
      
      <div style={contentContainerStyle}>
        <CampaignSelectionCard 
          label="Campaña A"
          campaigns={campaigns}
          selectedCampaignId={campaignAId}
          onCampaignChange={handleCampaignAChange}
          isLoadingSelector={isLoading || loadingCampaignA}
          campaignData={campaignA}
          isLoadingPreview={loadingCampaignA}
          excludeCampaignId={campaignBId}
          previewContainerStyle={previewContainerStyle}
          previewHeaderStyle={previewHeaderStyle}
          previewTitleContainerStyle={previewTitleContainerStyle}
          previewTitleStyle={previewTitleStyle}
          previewContentStyle={previewContentStyle}
        />
        <CampaignSelectionCard 
          label="Campaña B"
          campaigns={campaigns}
          selectedCampaignId={campaignBId}
          onCampaignChange={handleCampaignBChange}
          isLoadingSelector={isLoading || loadingCampaignB}
          campaignData={campaignB}
          isLoadingPreview={loadingCampaignB}
          excludeCampaignId={campaignAId}
          previewContainerStyle={previewContainerStyle}
          previewHeaderStyle={previewHeaderStyle}
          previewTitleContainerStyle={previewTitleContainerStyle}
          previewTitleStyle={previewTitleStyle}
          previewContentStyle={previewContentStyle}
        />
      </div>

      <ActionButtons 
        isGeneratingResults={isGeneratingResults}
        campaignASelected={!!campaignA}
        campaignBSelected={!!campaignB}
        testNameProvided={!!testName.trim()}
        resultsAvailable={!!(testResults && showResults)}
        onGenerate={generateResults}
        onReset={handleResetTest}
        buttonStyle={buttonStyle}
        buttonHoverStyle={buttonHoverStyle}
        disabledButtonStyle={disabledButtonStyle}
      />

      {showResults && testResults && (
        <TestResultsDisplay
          results={testResults}
          campaignA={campaignA}
          campaignB={campaignB}
        />
      )}

      {showMinCampaignsModal && (
        <div style={modalOverlayStyle}> 
          <div style={modalContentStyle}> 
            <p style={modalTextStyle}> 
              Necesitas tener al menos dos campañas disponibles para realizar un Test A/B.
              <br />
              Actualmente solo tienes {campaigns.length} campaña{campaigns.length === 1 ? '' : 's'} disponible{campaigns.length === 1 ? '' : 's'}.
            </p>
            <div style={modalActionsStyle}> 
              <button 
                style={modalButtonSecondaryStyle} 
                onClick={() => setShowMinCampaignsModal(false)}
              >
                Entendido
              </button>
              <button 
                style={modalButtonPrimaryStyle} 
                onClick={() => {
                  setShowMinCampaignsModal(false);
                  navigate('/dashboard/campaigns'); 
                }}
              >
                Ir a Campañas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateABTestView;
