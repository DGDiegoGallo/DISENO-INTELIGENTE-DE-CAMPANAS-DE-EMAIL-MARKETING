import React, { useState, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Button, Spinner, Modal, ProgressBar } from 'react-bootstrap';
import { FaFilePdf, FaChartBar, FaCheck, FaInfoCircle } from 'react-icons/fa';
import useUserStore from '../store/useUserStore';
import Chart from 'chart.js/auto';
import { ABTest } from '../services/abTestingService';

// Extender jsPDF con autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface ABTestReportGeneratorProps {
  testData: ABTest;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  buttonLabel?: string;
  buttonVariant?: string;
  showIcon?: boolean;
}

const ABTestReportGenerator: React.FC<ABTestReportGeneratorProps> = ({
  testData,
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
  
  // Función para renderizar los gráficos de A/B testing
  const renderCharts = useCallback(() => {
    if (!chartRefs.current.length || !testData?.results) {
      return;
    }

    // Destruir gráficos existentes para evitar duplicados
    charts.current.forEach(chart => chart.destroy());
    charts.current = [];
    
    // Datos para el gráfico de tasa de apertura
    const openRateData = {
      labels: ['Grupo A', 'Grupo B'],
      datasets: [
        {
          label: 'Tasa de apertura (%)',
          data: [
            (testData.results.groupA.opened / testData.results.groupA.sent) * 100,
            (testData.results.groupB.opened / testData.results.groupB.sent) * 100
          ],
          backgroundColor: ['#F21A2B', '#282A5B'],
          borderColor: ['#F21A2B', '#282A5B'],
          borderWidth: 1
        }
      ]
    };
    
    // Crear gráfico de tasa de apertura
    if (chartRefs.current[0]) {
      const canvas = document.createElement('canvas');
      chartRefs.current[0].innerHTML = '';
      chartRefs.current[0].appendChild(canvas);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const openRateChart = new Chart(ctx, {
          type: 'bar',
          data: openRateData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += `${(context.raw as number).toFixed(2)}%`;
                    }
                    return label;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Porcentaje de apertura'
                }
              }
            }
          }
        });
        charts.current.push(openRateChart);
      }
    }
    
    // Datos para el gráfico de tasa de clics
    const clickRateData = {
      labels: ['Grupo A', 'Grupo B'],
      datasets: [
        {
          label: 'Tasa de clics (%)',
          data: [
            (testData.results.groupA.clicked / testData.results.groupA.opened) * 100,
            (testData.results.groupB.clicked / testData.results.groupB.opened) * 100
          ],
          backgroundColor: ['#F21A2B', '#282A5B'],
          borderColor: ['#F21A2B', '#282A5B'],
          borderWidth: 1
        }
      ]
    };
    
    // Crear gráfico de tasa de clics
    if (chartRefs.current[1]) {
      const canvas = document.createElement('canvas');
      chartRefs.current[1].innerHTML = '';
      chartRefs.current[1].appendChild(canvas);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const clickRateChart = new Chart(ctx, {
          type: 'bar',
          data: clickRateData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += `${(context.raw as number).toFixed(2)}%`;
                    }
                    return label;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Porcentaje de clics'
                }
              }
            }
          }
        });
        charts.current.push(clickRateChart);
      }
    }
    
    // Datos para el gráfico de conversión
    const conversionRateData = {
      labels: ['Grupo A', 'Grupo B'],
      datasets: [
        {
          label: 'Tasa de conversión (%)',
          data: [
            (testData.results.groupA.converted / testData.results.groupA.clicked) * 100,
            (testData.results.groupB.converted / testData.results.groupB.clicked) * 100
          ],
          backgroundColor: ['#F21A2B', '#282A5B'],
          borderColor: ['#F21A2B', '#282A5B'],
          borderWidth: 1
        }
      ]
    };
    
    // Crear gráfico de tasa de conversión
    if (chartRefs.current[2]) {
      const canvas = document.createElement('canvas');
      chartRefs.current[2].innerHTML = '';
      chartRefs.current[2].appendChild(canvas);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const conversionRateChart = new Chart(ctx, {
          type: 'bar',
          data: conversionRateData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += `${(context.raw as number).toFixed(2)}%`;
                    }
                    return label;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Porcentaje de conversión'
                }
              }
            }
          }
        });
        charts.current.push(conversionRateChart);
      }
    }
  }, [testData]);

  useEffect(() => {
    if (showModal) {
      // Renderizar los gráficos cuando se muestra el modal
      setTimeout(() => {
        renderCharts();
      }, 100);
    }
  }, [showModal, renderCharts]);

  // Función para generar el PDF
  const generatePDF = async () => {
    if (!testData || !testData.results) {
      setError('No hay datos disponibles para generar el informe');
      return;
    }

    setIsLoading(true);
    setProgress(10);

    try {
      // Crear documento PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let currentY = 20;

      // Título del informe
      doc.setFontSize(18);
      doc.setTextColor('#F21A2B');
      doc.text('Informe de Prueba A/B', pageWidth / 2, currentY, { align: 'center' });
      currentY += 10;

      setProgress(20);

      // Información del test
      doc.setFontSize(12);
      doc.setTextColor('#000');
      doc.text(`Nombre: ${testData.name}`, margin, currentY);
      currentY += 7;
      doc.text(`Fecha: ${new Date(testData.date).toLocaleDateString()}`, margin, currentY);
      currentY += 7;
      doc.text(`Campaña: ${testData.campaignName}`, margin, currentY);
      currentY += 7;
      doc.text(`Asunto: ${testData.subject}`, margin, currentY);
      currentY += 15;

      setProgress(30);

      // Información del usuario
      doc.setFontSize(14);
      doc.setTextColor('#282A5B');
      doc.text('Información del Usuario', margin, currentY);
      currentY += 10;

      doc.setFontSize(10);
      doc.setTextColor('#000');
      doc.text(`Nombre: ${user?.nombre || ''} ${user?.apellido || ''}`, margin, currentY);
      currentY += 6;
      doc.text(`Email: ${user?.email || ''}`, margin, currentY);
      currentY += 15;

      setProgress(40);

      // Tabla de resultados
      doc.setFontSize(14);
      doc.setTextColor('#282A5B');
      doc.text('Resultados de la Prueba A/B', margin, currentY);
      currentY += 10;

      // Tabla con autoTable
      doc.autoTable({
        startY: currentY,
        head: [['Métrica', 'Grupo A', 'Grupo B', 'Diferencia', 'Ganador']],
        body: [
          [
            'Enviados', 
            testData.results.groupA.sent, 
            testData.results.groupB.sent, 
            '-', 
            '-'
          ],
          [
            'Abiertos', 
            `${testData.results.groupA.opened} (${((testData.results.groupA.opened / testData.results.groupA.sent) * 100).toFixed(2)}%)`, 
            `${testData.results.groupB.opened} (${((testData.results.groupB.opened / testData.results.groupB.sent) * 100).toFixed(2)}%)`, 
            `${(((testData.results.groupB.opened / testData.results.groupB.sent) - (testData.results.groupA.opened / testData.results.groupA.sent)) * 100).toFixed(2)}%`, 
            (testData.results.groupA.opened / testData.results.groupA.sent) > (testData.results.groupB.opened / testData.results.groupB.sent) ? 'Grupo A' : 'Grupo B'
          ],
          [
            'Clics', 
            `${testData.results.groupA.clicked} (${((testData.results.groupA.clicked / testData.results.groupA.opened) * 100).toFixed(2)}%)`, 
            `${testData.results.groupB.clicked} (${((testData.results.groupB.clicked / testData.results.groupB.opened) * 100).toFixed(2)}%)`, 
            `${(((testData.results.groupB.clicked / testData.results.groupB.opened) - (testData.results.groupA.clicked / testData.results.groupA.opened)) * 100).toFixed(2)}%`, 
            (testData.results.groupA.clicked / testData.results.groupA.opened) > (testData.results.groupB.clicked / testData.results.groupB.opened) ? 'Grupo A' : 'Grupo B'
          ],
          [
            'Conversiones', 
            `${testData.results.groupA.converted} (${((testData.results.groupA.converted / testData.results.groupA.clicked) * 100).toFixed(2)}%)`, 
            `${testData.results.groupB.converted} (${((testData.results.groupB.converted / testData.results.groupB.clicked) * 100).toFixed(2)}%)`, 
            `${(((testData.results.groupB.converted / testData.results.groupB.clicked) - (testData.results.groupA.converted / testData.results.groupA.clicked)) * 100).toFixed(2)}%`, 
            (testData.results.groupA.converted / testData.results.groupA.clicked) > (testData.results.groupB.converted / testData.results.groupB.clicked) ? 'Grupo A' : 'Grupo B'
          ],
          [
            'Ingresos', 
            `$${testData.results.groupA.revenue}`, 
            `$${testData.results.groupB.revenue}`, 
            `$${testData.results.groupB.revenue - testData.results.groupA.revenue}`, 
            testData.results.groupA.revenue > testData.results.groupB.revenue ? 'Grupo A' : 'Grupo B'
          ]
        ],
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [240, 26, 43], textColor: [255, 255, 255] }
      });

      currentY = (doc as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
      setProgress(60);

      // Generamos una nueva página para los gráficos
      if (currentY > 200) {
        doc.addPage();
        currentY = 20;
      }

      // Título de sección de gráficos
      doc.setFontSize(14);
      doc.setTextColor('#282A5B');
      doc.text('Análisis Gráfico de Resultados', margin, currentY);
      currentY += 15;

      setProgress(70);

      // Capturar los gráficos y añadirlos al PDF
      try {
        // Convertimos los canvas de los gráficos a imágenes para el PDF
        for (let i = 0; i < charts.current.length; i++) {
          const chart = charts.current[i];
          const canvas = chart.canvas;
          const imgData = canvas.toDataURL('image/png');
          
          // Añadir títulos para cada gráfico
          const titles = ['Tasa de Apertura', 'Tasa de Clics', 'Tasa de Conversión'];
          
          doc.setFontSize(12);
          doc.text(titles[i], margin, currentY);
          currentY += 5;
          
          // Añadir imagen del gráfico
          const imgWidth = contentWidth;
          const imgHeight = 70;
          doc.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 15;
          
          // Si hay poco espacio, añadir nueva página
          if (i < charts.current.length - 1 && currentY > 230) {
            doc.addPage();
            currentY = 20;
          }
        }
      } catch (err) {
        console.error('Error al añadir gráficos al PDF:', err);
      }

      setProgress(80);

      // Añadir análisis y conclusiones
      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor('#282A5B');
      doc.text('Conclusiones y Recomendaciones', margin, currentY);
      currentY += 10;

      doc.setFontSize(10);
      doc.setTextColor('#000');

      // Determinar cuál grupo tuvo mejor desempeño general
      const groupAOpenRate = testData.results.groupA.opened / testData.results.groupA.sent;
      const groupBOpenRate = testData.results.groupB.opened / testData.results.groupB.sent;
      
      const groupAClickRate = testData.results.groupA.clicked / testData.results.groupA.opened;
      const groupBClickRate = testData.results.groupB.clicked / testData.results.groupB.opened;
      
      const groupAConversionRate = testData.results.groupA.converted / testData.results.groupA.clicked;
      const groupBConversionRate = testData.results.groupB.converted / testData.results.groupB.clicked;
      
      let betterGroup = '';
      let points = 0;
      
      if (groupAOpenRate > groupBOpenRate) points++;
      else points--;
      
      if (groupAClickRate > groupBClickRate) points++;
      else points--;
      
      if (groupAConversionRate > groupBConversionRate) points++;
      else points--;
      
      if (testData.results.groupA.revenue > testData.results.groupB.revenue) points++;
      else points--;
      
      betterGroup = points > 0 ? 'A' : 'B';
      
      // Recomendaciones
      const conclusions = [
        `Basado en los resultados, el Grupo ${betterGroup} mostró un mejor desempeño general.`,
        `La tasa de apertura fue ${(Math.max(groupAOpenRate, groupBOpenRate) / Math.min(groupAOpenRate, groupBOpenRate) * 100 - 100).toFixed(2)}% mejor en el Grupo ${groupAOpenRate > groupBOpenRate ? 'A' : 'B'}.`,
        `La tasa de clics fue ${(Math.max(groupAClickRate, groupBClickRate) / Math.min(groupAClickRate, groupBClickRate) * 100 - 100).toFixed(2)}% mejor en el Grupo ${groupAClickRate > groupBClickRate ? 'A' : 'B'}.`,
        `La tasa de conversión fue ${(Math.max(groupAConversionRate, groupBConversionRate) / Math.min(groupAConversionRate, groupBConversionRate) * 100 - 100).toFixed(2)}% mejor en el Grupo ${groupAConversionRate > groupBConversionRate ? 'A' : 'B'}.`,
        `Los ingresos generados fueron $${Math.abs(testData.results.groupA.revenue - testData.results.groupB.revenue)} mayores en el Grupo ${testData.results.groupA.revenue > testData.results.groupB.revenue ? 'A' : 'B'}.`,
        `\nRecomendación: Utilizar la versión del Grupo ${betterGroup} para futuras campañas.`
      ];
      
      const textLines = doc.splitTextToSize(conclusions.join('\n\n'), contentWidth);
      doc.text(textLines, margin, currentY);

      setProgress(90);

      // Pie de página con fecha de generación
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100);
        const today = new Date().toLocaleDateString();
        doc.text(`Informe generado el ${today} - Página ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }

      setProgress(95);

      // Guardar PDF
      doc.save(`Informe_AB_Test_${testData.name.replace(/\s+/g, '_')}.pdf`);
      
      setProgress(100);
      setIsLoading(false);
      
      // Cerrar el modal después de un breve retraso
      setTimeout(() => {
        setShowModal(false);
        if (onSuccess) onSuccess();
      }, 1000);
      
    } catch (err) {
      console.error('Error al generar PDF:', err);
      setError(`Error al generar el informe: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      setIsLoading(false);
      if (onError && err instanceof Error) onError(err);
    }
  };

  return (
    <>
      <Button
        variant={buttonVariant}
        onClick={() => setShowModal(true)}
        className="d-flex align-items-center"
      >
        {showIcon && <FaFilePdf className="me-2" />}
        {buttonLabel}
      </Button>

      <Modal 
        show={showModal} 
        onHide={() => !isLoading && setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton={!isLoading}>
          <Modal.Title>Generar Informe de Prueba A/B</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading && (
            <div className="mb-4">
              <h5 className="mb-3">Generando informe...</h5>
              <ProgressBar 
                now={progress} 
                label={`${progress}%`} 
                variant="danger" 
                animated 
                className="mb-3" 
              />
              <p className="text-muted small">Por favor espere mientras se genera el informe en PDF.</p>
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          
          {!isLoading && !error && testData && (
            <div className="py-2">
              <div className="mb-4">
                <h5 className="d-flex align-items-center">
                  <FaInfoCircle className="me-2" /> Información del Test A/B
                </h5>
                <div className="card p-3">
                  <p><strong>Nombre:</strong> {testData.name}</p>
                  <p><strong>Campaña:</strong> {testData.campaignName}</p>
                  <p><strong>Fecha:</strong> {new Date(testData.date).toLocaleDateString()}</p>
                  <p><strong>Grupos:</strong> {testData.groupA} vs {testData.groupB}</p>
                </div>
              </div>
              
              {testData.results && (
                <div className="mb-4">
                  <h5 className="d-flex align-items-center">
                    <FaCheck className="me-2" /> Resumen de Resultados
                  </h5>
                  <div className="card p-3">
                    <div className="row">
                      <div className="col-md-6">
                        <h6>Grupo A: {testData.groupA}</h6>
                        <p><strong>Enviados:</strong> {testData.results.groupA.sent}</p>
                        <p><strong>Abiertos:</strong> {testData.results.groupA.opened} 
                          ({((testData.results.groupA.opened / testData.results.groupA.sent) * 100).toFixed(2)}%)
                        </p>
                        <p><strong>Clicks:</strong> {testData.results.groupA.clicked} 
                          ({((testData.results.groupA.clicked / testData.results.groupA.opened) * 100).toFixed(2)}%)
                        </p>
                        <p><strong>Conversiones:</strong> {testData.results.groupA.converted}</p>
                        <p><strong>Ingresos:</strong> ${testData.results.groupA.revenue}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>Grupo B: {testData.groupB}</h6>
                        <p><strong>Enviados:</strong> {testData.results.groupB.sent}</p>
                        <p><strong>Abiertos:</strong> {testData.results.groupB.opened} 
                          ({((testData.results.groupB.opened / testData.results.groupB.sent) * 100).toFixed(2)}%)
                        </p>
                        <p><strong>Clicks:</strong> {testData.results.groupB.clicked} 
                          ({((testData.results.groupB.clicked / testData.results.groupB.opened) * 100).toFixed(2)}%)
                        </p>
                        <p><strong>Conversiones:</strong> {testData.results.groupB.converted}</p>
                        <p><strong>Ingresos:</strong> ${testData.results.groupB.revenue}</p>
                      </div>
                    </div>
                    
                    <div className="alert alert-light mt-3">
                      <p className="mb-0">El informe incluirá un análisis detallado de los resultados de la prueba A/B, gráficos comparativos y recomendaciones basadas en los datos.</p>
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
                      <h6>Tasa de Apertura</h6>
                      <div ref={el => { if(el) chartRefs.current[0] = el; }} className="chart-container" style={{height: "200px"}}></div>
                    </div>
                  </div>
                  <div className="col-12 mb-3">
                    <div className="card p-3">
                      <h6>Tasa de Clics</h6>
                      <div ref={el => { if(el) chartRefs.current[1] = el; }} className="chart-container" style={{height: "200px"}}></div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="card p-3">
                      <h6>Tasa de Conversión</h6>
                      <div ref={el => { if(el) chartRefs.current[2] = el; }} className="chart-container" style={{height: "200px"}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="alert alert-info">
                <p className="mb-0">El informe incluirá un análisis detallado de los resultados de la prueba A/B, gráficos comparativos y recomendaciones basadas en los datos.</p>
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

export default ABTestReportGenerator;
