import React, { useState, useCallback, useRef } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { FaFilePdf } from 'react-icons/fa';
import useUserStore from '../../store/useUserStore';
import reportService, { UserCampaignsData } from '../../services/reportService';

// Importamos los componentes refactorizados para los informes
import ReportUserInfo from '../reports/ReportUserInfo';
import ReportCampaignSummary from '../reports/ReportCampaignSummary';
import ReportCharts from '../reports/ReportCharts';
import ReportPDFGenerator, { ReportPDFGeneratorRef } from '../reports/ReportPDFGenerator';
import AiRecommendations from '../AiRecommendations'; // Added import

const MetricsView: React.FC = () => {
  // Estados para gestionar la carga y generación del informe
  const [isLoading, setIsLoading] = useState(false); // True when loading data or generating PDF
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<UserCampaignsData | null>(null); // Holds data for preview and PDF
  
  // Usuario actual desde el store
  const { user } = useUserStore();
  
  // Referencias para los gráficos y el generador de PDF
  const campaignChartRef = useRef<HTMLDivElement>(null);
  const contactsChartRef = useRef<HTMLDivElement>(null);
  const pdfGeneratorRef = useRef<ReportPDFGeneratorRef>(null);

  // Función para cargar datos del informe
  const loadReportData = useCallback(async () => {
    if (!user || !user.id) {
      setError('No se encontró información del usuario');
      return;
    }
    
    setIsLoading(true);
    setProgress(10);
    setError(null);
    
    try {
      // Cargar datos de campañas del usuario desde Strapi
      setProgress(50);
      const userData = await reportService.getUserCampaigns(user.id);
      setReportData(userData);
      
      setProgress(100);
      setIsLoading(false);
    } catch (err) {
      console.error('Error al cargar datos para el informe:', err);
      setError('Error al cargar los datos para el informe. Por favor, inténtelo de nuevo.');
      setIsLoading(false);
    }
  }, [user]);
  
  
  // Función para iniciar la generación del PDF
  const handleGeneratePDF = () => {
    if (pdfGeneratorRef.current && reportData) { // Ensure reportData is loaded
      setIsLoading(true);
      setProgress(0); // Reset progress for PDF generation
      setError(null);
      pdfGeneratorRef.current.generatePDF();
    } else if (!reportData) {
      setError('Por favor, cargue los datos del informe primero.');
    }
  };
  
  // Función para manejar el éxito en la generación
  const handlePDFSuccess = () => {
    setIsLoading(false);
    setProgress(100); // Indicate completion
    // Optionally, show a success message to the user
    // For example: setError("Informe PDF generado y descargado con éxito."); // Using setError for a general message area
  };
  
  // --- Estilos --- 
  const viewStyle: React.CSSProperties = {
    padding: '25px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    maxHeight: 'calc(100vh - 120px)', // Limitar altura relativa al viewport
    overflowY: 'auto' // Añadir scroll vertical si el contenido sobrepasa
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    color: '#333',
    fontSize: '22px',
    fontWeight: 'bold',
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  };

  return (
    <div style={viewStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Generar Informe de Rendimiento</h2>
      </div>

      {/* Contenedor para el generador de informes */}
      <div style={containerStyle}>
        <p style={{ marginBottom: '20px', textAlign: 'center' }}>
          Utilice el siguiente generador para crear un informe detallado del rendimiento de sus campañas.
          El informe incluirá estadísticas de sus campañas, distribución de contactos, y recomendaciones personalizadas.
        </p>
        
        {/* Botón principal para cargar datos o generar PDF */}
        <div className="text-center mb-4">
          <Button
            variant="danger"
            onClick={reportData ? handleGeneratePDF : loadReportData}
            disabled={isLoading}
            size="lg"
            className="px-4 py-2"
          >
            <FaFilePdf className="me-2" />
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                {reportData ? `Generando PDF... ${progress}%` : `Cargando Datos... ${progress}%`}
              </>
            ) : reportData ? (
              'Descargar PDF del Informe'
            ) : (
              'Generar Informe y Ver Preview'
            )}
          </Button>
        </div>

        {/* Mensaje de error general */}
        {error && !isLoading && (
          <Alert variant="danger" className="mt-3">{error}</Alert>
        )}

        {/* Indicador de progreso general */}
        {isLoading && (
          <div className="text-center p-4">
            <Spinner animation="border" variant="primary" />
            <div className="mt-3">
              {reportData ? `Generando PDF... ${progress}%` : `Cargando datos... ${progress}%`}
            </div>
            <div className="progress mt-2" style={{ height: '20px' }}>
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>
        )}

        {/* Vista previa del informe (visible cuando los datos están cargados y no se está procesando nada) */}
        {reportData && !isLoading && (
          <div className="report-preview mt-4 p-3 border rounded bg-light">
            <h4 className="mb-3 text-center text-secondary">Vista Previa del Informe</h4>
            <ReportUserInfo user={user} />
            <hr className="my-3" />
            <ReportCampaignSummary reportData={reportData} />
            <hr className="my-3" />
            {/* ReportCharts necesita usar los refs campaignChartRef y contactsChartRef */}
            {/* Asegúrate que ReportCharts.tsx acepte y use estos refs en los divs que envuelven sus canvas */}
            <ReportCharts
              reportData={reportData}
              campaignChartRef={campaignChartRef} // Pasando ref para el gráfico de campañas
              contactsChartRef={contactsChartRef} // Pasando ref para el gráfico de contactos
            />
            <hr className="my-3" />
            <Alert variant="info" className="mt-3">
              <p className="mb-0">El informe PDF incluirá esta información, gráficos detallados y recomendaciones personalizadas para mejorar sus estrategias de email marketing.</p>
            </Alert>
            <hr className="my-3" /> {/* Separator before AI component */}
            <AiRecommendations reportData={reportData} />
          </div>
        )}

        {/* Componente no visible que maneja la generación del PDF */}
        {/* Se mantiene aquí para que su ref esté siempre disponible */}
        <ReportPDFGenerator
          ref={pdfGeneratorRef}
          user={user}
          reportData={reportData}
          onProgress={setProgress}
          onError={(err) => { setIsLoading(false); setError(err); }}
          onSuccess={handlePDFSuccess}
          chartRefs={{
            campaignChartRef,
            contactsChartRef
          }}
        />
      </div>
    </div>
  );
};

export default MetricsView;
