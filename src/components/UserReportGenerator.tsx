import React, { useState, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Button, Spinner, Modal } from 'react-bootstrap';
import { FaFilePdf, FaChartBar, FaUser, FaEnvelope, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import useUserStore from '../store/useUserStore';
import reportService, { UserCampaignsData } from '../services/reportService';
// Importamos solo los tipos necesarios
import Chart from 'chart.js/auto';

// Extender jsPDF con autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => jsPDF;
  }
}

interface UserReportGeneratorProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  buttonLabel?: string;
  buttonVariant?: string;
  showIcon?: boolean;
}

const UserReportGenerator: React.FC<UserReportGeneratorProps> = ({
  onSuccess,
  onError,
  buttonLabel = 'Generar informe',
  buttonVariant = 'danger',
  showIcon = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();
  
  // Referencias para los gráficos que se capturarán
  const chartRefs = React.useRef<HTMLDivElement[]>([]);
  const charts = React.useRef<Chart[]>([]);
  
  // Datos para los informes
  const [reportData, setReportData] = useState<UserCampaignsData | null>(null);
  
  // Función para renderizar los gráficos
  const renderCharts = useCallback(() => {
    if (chartRefs.current.length === 0 || !chartRefs.current[0] || !chartRefs.current[1] || !reportData) {
      return;
    }

    // Destruir gráficos existentes para evitar duplicados
    charts.current.forEach(chart => chart.destroy());
    charts.current = [];
    
    // Datos para el gráfico de estado de campañas
    const campaignStatusData = {
      labels: ['Borrador', 'Programado', 'Enviado', 'Cancelado'],
      datasets: [
        {
          data: [
            reportData.campaignStats.draft,
            reportData.campaignStats.scheduled,
            reportData.campaignStats.sent,
            reportData.campaignStats.cancelled
          ],
          backgroundColor: ['#282A5B', '#4ECDC4', '#F21A2B', '#FFC857'],
          hoverBackgroundColor: ['#3A3D7D', '#6EDFD7', '#FF4A59', '#FFD57F']
        }
      ]
    };
    
    // Crear gráfico de estado de campañas
    const campaignStatusCtx = chartRefs.current[0].querySelector('canvas');
    if (!campaignStatusCtx) {
      const canvas = document.createElement('canvas');
      chartRefs.current[0].appendChild(canvas);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const campaignStatusChart = new Chart(ctx, {
          type: 'doughnut',
          data: campaignStatusData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw as number;
                    const total = (context.dataset.data as number[]).reduce((acc, val) => acc + (val as number), 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            },
            cutout: '60%'
          }
        });
        charts.current.push(campaignStatusChart);
      }
    }
    
    // Preparar datos para el gráfico de grupos de contactos
    const contactGroupsData = {
      labels: reportData.contactGroups.map(group => group.name),
      datasets: [
        {
          data: reportData.contactGroups.map(group => group.contactCount),
          backgroundColor: [
            '#F21A2B', '#282A5B', '#4ECDC4', '#FFC857', '#A5A5A5',
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
          ],
          hoverBackgroundColor: [
            '#FF4A59', '#3A3D7D', '#6EDFD7', '#FFD57F', '#C7C7C7',
            '#FF8CB0', '#64B5FF', '#FFE08C', '#7CD7D7', '#B28CFF'
          ]
        }
      ]
    };
    
    // Crear gráfico de grupos de contactos
    const contactGroupsCtx = chartRefs.current[1].querySelector('canvas');
    if (!contactGroupsCtx) {
      const canvas = document.createElement('canvas');
      chartRefs.current[1].appendChild(canvas);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const contactGroupsChart = new Chart(ctx, {
          type: 'pie',
          data: contactGroupsData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw as number;
                    const total = (context.dataset.data as number[]).reduce((acc, val) => acc + (val as number), 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} contactos (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
        charts.current.push(contactGroupsChart);
      }
    }
  }, [reportData]);
  
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
      // Cargar datos de campañas del usuario
      setProgress(50);
      const userData = await reportService.getUserCampaigns(user.id);
      setReportData(userData);
      
      setProgress(100);
      setIsLoading(false);
      
      // Renderizar gráficos después de cargar datos
      setTimeout(() => {
        renderCharts();
      }, 500);
      
    } catch (err) {
      console.error('Error al cargar datos para el informe:', err);
      setError('Error al cargar los datos para el informe. Por favor, inténtelo de nuevo.');
      setIsLoading(false);
      if (onError && err instanceof Error) {
        onError(err);
      }
    }
  }, [onError, renderCharts, user]);
  
  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (showModal) {
      loadReportData();
    }
  }, [showModal, loadReportData]);
  

  

  
  // Función para generar el PDF
  const generatePDF = async () => {
    if (!user || !reportData) {
      setError('No se encontró información del usuario o no hay datos disponibles');
      return;
    }
    
    setIsLoading(true);
    setProgress(10);
    
    try {
      // Crear documento PDF
      const doc = new jsPDF();
      
      // Añadir título
      doc.setFontSize(20);
      doc.setTextColor(40, 42, 91);
      doc.text('Informe de Campañas de Email Marketing', 20, 20);
      
      // Añadir fecha
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 20, 30);
      
      // Añadir información del usuario
      doc.setFontSize(14);
      doc.setTextColor(40, 42, 91);
      doc.text('Información del Usuario', 20, 40);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Nombre: ${user.nombre || ''} ${user.apellido || ''}`, 20, 50);
      doc.text(`Email: ${user.email}`, 20, 55);
      doc.text(`País: ${user.pais || 'No especificado'}`, 20, 60);
      doc.text(`Ciudad: ${user.ciudad || 'No especificada'}`, 20, 65);
      
      setProgress(30);
      
      // Añadir resumen de campañas
      doc.setFontSize(14);
      doc.setTextColor(40, 42, 91);
      doc.text('Resumen de Campañas', 20, 75);
      
      // Datos de resumen
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total de campañas: ${reportData.totalCampaigns}`, 20, 85);
      doc.text(`Campañas en borrador: ${reportData.campaignStats.draft}`, 20, 95);
      doc.text(`Campañas programadas: ${reportData.campaignStats.scheduled}`, 20, 105);
      doc.text(`Campañas enviadas: ${reportData.campaignStats.sent}`, 20, 115);
      doc.text(`Campañas canceladas: ${reportData.campaignStats.cancelled}`, 20, 125);
      doc.text(`Total de contactos: ${reportData.totalContacts}`, 20, 135);
      
      // Añadir tabla de campañas
      doc.setFontSize(14);
      doc.setTextColor(40, 42, 91);
      doc.text('Listado de Campañas', 20, 150);
      
      // Usar autoTable para crear una tabla de campañas
      doc.autoTable({
        startY: 155,
        head: [['Nombre', 'Asunto', 'Estado', 'Fecha']],
        body: reportData.campaigns.map(campaign => [
          campaign.attributes.nombre || '',
          campaign.attributes.asunto || '',
          campaign.attributes.estado || '',
          new Date(campaign.attributes.Fechas || '').toLocaleDateString()
        ]),
        theme: 'striped',
        headStyles: { fillColor: [40, 42, 91] }
      });
      
      setProgress(50);
      
      // Capturar gráficos como imágenes
      if (chartRefs.current.length > 0 && chartRefs.current[0].firstChild) {
        const campaignChartCanvas = chartRefs.current[0].firstChild as HTMLCanvasElement;
        const campaignChartImage = campaignChartCanvas.toDataURL('image/png');
        
        // Añadir gráfico de estado de campañas
        doc.addPage();
        doc.setFontSize(14);
        doc.setTextColor(40, 42, 91);
        doc.text('Estado de Campañas', 20, 20);
        doc.addImage(campaignChartImage, 'PNG', 20, 30, 170, 80);
        
        setProgress(75);
        
        // Añadir gráfico de grupos de contactos si está disponible
        if (chartRefs.current[1] && chartRefs.current[1].firstChild) {
          const contactsChartCanvas = chartRefs.current[1].firstChild as HTMLCanvasElement;
          const contactsChartImage = contactsChartCanvas.toDataURL('image/png');
          
          doc.text('Distribución de Contactos por Grupo', 20, 130);
          doc.addImage(contactsChartImage, 'PNG', 60, 140, 100, 100);
        }
      }
      
      // Añadir tabla de grupos de contactos
      if (reportData.contactGroups.length > 0) {
        doc.addPage();
        doc.setFontSize(14);
        doc.setTextColor(40, 42, 91);
        doc.text('Grupos de Contactos', 20, 20);
        
        doc.autoTable({
          startY: 30,
          head: [['Nombre del Grupo', 'Cantidad de Contactos']],
          body: reportData.contactGroups.map(group => [
            group.name,
            group.contactCount
          ]),
          theme: 'striped',
          headStyles: { fillColor: [40, 42, 91] }
        });
      }
      
      // Añadir recomendaciones
      doc.addPage();
      doc.setFontSize(14);
      doc.setTextColor(40, 42, 91);
      doc.text('Recomendaciones', 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('1. Organizar contactos en grupos más específicos para mejorar la segmentación.', 20, 35);
      doc.text('2. Utilizar asuntos de correo más atractivos para aumentar tasas de apertura.', 20, 45);
      doc.text('3. Programar envíos en horarios óptimos según el público objetivo.', 20, 55);
      doc.text('4. Revisar y completar las campañas en borrador para aumentar el número de envíos.', 20, 65);
      doc.text('5. Analizar los resultados de campañas enviadas para mejorar futuras estrategias.', 20, 75);
      
      setProgress(90);
      
      // Guardar el PDF
      doc.save(`informe_campanas_${user.nombre || 'usuario'}_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      setProgress(100);
      setIsLoading(false);
      setShowModal(false);
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (err) {
      console.error('Error al generar el PDF:', err);
      setError('Error al generar el PDF. Por favor, inténtelo de nuevo.');
      setIsLoading(false);
      if (onError && err instanceof Error) {
        onError(err);
      }
    }
  };
  
  return (
    <>
      <Button 
        variant={buttonVariant} 
        onClick={() => setShowModal(true)}
        disabled={isLoading}
      >
        {showIcon && <FaFilePdf className="me-2" />}
        {buttonLabel}
      </Button>
      
      <Modal 
        show={showModal} 
        onHide={() => !isLoading && setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton={!isLoading}>
          <Modal.Title>Generar Informe de Métricas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          
          {isLoading ? (
            <div className="text-center p-4">
              <Spinner animation="border" variant="primary" />
              <div className="mt-3">
                Generando informe... {progress}%
              </div>
              <div className="progress mt-2">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress} 
                  aria-valuemin={0} 
                  aria-valuemax={100}
                ></div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h5 className="d-flex align-items-center">
                  <FaUser className="me-2" /> Información del Usuario
                </h5>
                <div className="card p-3">
                  <p><strong>Nombre:</strong> {user?.nombre || ''} {user?.apellido || ''}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>País:</strong> {user?.pais || 'No especificado'}</p>
                  <p><strong>Ciudad:</strong> {user?.ciudad || 'No especificada'}</p>
                </div>
              </div>
              
              {reportData && (
                <div className="mb-4">
                  <h5 className="d-flex align-items-center">
                    <FaEnvelope className="me-2" /> Resumen de Campañas
                  </h5>
                  <div className="card p-3">
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Total de campañas:</strong> {reportData.totalCampaigns}</p>
                        <p><strong>Campañas en borrador:</strong> {reportData.campaignStats.draft}</p>
                        <p><strong>Campañas programadas:</strong> {reportData.campaignStats.scheduled}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Campañas enviadas:</strong> {reportData.campaignStats.sent}</p>
                        <p><strong>Campañas canceladas:</strong> {reportData.campaignStats.cancelled}</p>
                        <p><strong>Total de contactos:</strong> {reportData.totalContacts}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <h5 className="d-flex align-items-center">
                  <FaChartBar className="me-2" /> Vista Previa de Gráficos
                </h5>
                <div className="row">
                  <div className="col-12 mb-3">
                    <div className="card p-3">
                      <h6 className="d-flex align-items-center">
                        <FaCalendarAlt className="me-2" /> Estado de Campañas
                      </h6>
                      <div ref={el => { if(el) chartRefs.current[0] = el; }} className="chart-container"></div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="card p-3">
                      <h6 className="d-flex align-items-center">
                        <FaUsers className="me-2" /> Distribución de Contactos por Grupo
                      </h6>
                      <div ref={el => { if(el) chartRefs.current[1] = el; }} className="chart-container"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="alert alert-info">
                <p className="mb-0">El informe incluirá un resumen de campañas, distribución de contactos por grupo, y recomendaciones personalizadas para mejorar sus estrategias de email marketing.</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={generatePDF}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Generando...
              </>
            ) : (
              <>
                <FaFilePdf className="me-2" />
                Generar PDF
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserReportGenerator;
