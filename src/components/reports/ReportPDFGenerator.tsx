import React, { forwardRef, useImperativeHandle } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Interface for jsPDF instance extended by autoTable
// Interface for jsPDF instance extended by autoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: { // This property is added by autoTable and assumed to be present by its types
    finalY: number;
  };
}
import { UserCampaignsData, CampaignData, ContactGroup } from '@/services/reportService';
import type { StrapiUser } from '@/interfaces/user';

// Helper to format rates as percentages
const formatRateAsPercentage = (rate: number | undefined): string => {
  if (typeof rate !== 'number' || isNaN(rate)) return 'N/A';
  return `${(rate * 100).toFixed(2)}%`;
};

// Interfaces for A/B Test Data
export interface ABTestCampaignMetrics {
  openRate: number;
  clickRate: number;
  conversionRate: number;
  bounceRate?: number;      // Optional as per example
  unsubscribeRate?: number; // Optional as per example
}

export interface ABTestResultDetails {
  testId: string;
  testName: string;
  dateCreated: string;
  campaignA: ABTestCampaignMetrics;
  campaignB: ABTestCampaignMetrics;
  winner: 'A' | 'B' | 'tie'; // Assuming 'tie' could be a possibility
  recommendation: string;
}

export interface ABTestData {
  id: string;
  name: string;
  dateCreated: string;
  campaignAId: number;
  campaignBId: number;
  campaignAName: string;
  campaignBName: string;
  results: ABTestResultDetails;
}

export interface ReportPDFGeneratorRef {
  generatePDF: () => Promise<void>;
}

interface ReportPDFGeneratorProps {
  user: StrapiUser | null;
  reportData: UserCampaignsData | null;
  onProgress: (progress: number) => void;
  onError: (error: string) => void;
  onSuccess: () => void;
  chartRefs: {
    campaignChartRef: React.RefObject<HTMLDivElement | null>;
    contactsChartRef: React.RefObject<HTMLDivElement | null>;
  };
  abTests?: ABTestData[]; // Added prop for A/B test data
}

const ReportPDFGenerator = forwardRef<ReportPDFGeneratorRef, ReportPDFGeneratorProps>(
  ({ user, reportData, onProgress, onError, onSuccess, chartRefs, abTests }, ref) => {
    
    // Generate PDF method exposed via ref
    const generatePDF = async () => {
      if (!user || !reportData) {
        onError('No se encontró información del usuario o no hay datos disponibles');
        return;
      }
      
      onProgress(10);
      
      try {
        // Create PDF document
        const doc = new jsPDF();

        const formatDate = (dateString: string | undefined) => {
          if (!dateString) return 'N/A';
          try {
            return new Date(dateString).toLocaleDateString();
          } catch (error) {
            console.error('Error formatting date for PDF:', dateString, error);
            return 'Fecha inválida';
          }
        };
        
        // Add title
        doc.setFontSize(20);
        doc.setTextColor(40, 42, 91);
        doc.text('Informe de Campañas de Email Marketing', 20, 20);
        
        // Add date
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 20, 30);
        
        // Add user information
        doc.setFontSize(14);
        doc.setTextColor(40, 42, 91);
        doc.text('Información del Usuario', 20, 40);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Nombre: ${user.nombre || ''} ${user.apellido || ''}`, 20, 50);
        doc.text(`Email: ${user.email}`, 20, 55);
        doc.text(`País: ${user.pais || 'No especificado'}`, 20, 60);
        doc.text(`Ciudad: ${user.ciudad || 'No especificada'}`, 20, 65);
        
        onProgress(30);
        
        // Add campaign summary
        doc.setFontSize(14);
        doc.setTextColor(40, 42, 91);
        doc.text('Resumen de Campañas', 20, 75);
        
        // Summary data
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total de campañas: ${reportData.totalCampaigns}`, 20, 85);
        doc.text(`Campañas en borrador: ${reportData.campaignStats.draft}`, 20, 95);
        doc.text(`Campañas programadas: ${reportData.campaignStats.scheduled}`, 20, 105);
        doc.text(`Campañas enviadas: ${reportData.campaignStats.sent}`, 20, 115);
        doc.text(`Campañas canceladas: ${reportData.campaignStats.cancelled}`, 20, 125);
        doc.text(`Total de contactos: ${reportData.totalContacts}`, 20, 135);
        
        // Add campaigns table
        doc.setFontSize(14);
        doc.setTextColor(40, 42, 91);
        doc.text('Listado de Campañas', 20, 150);
        
        // Use autoTable to create a campaigns table
        autoTable(doc, {
          startY: 155, // Adjust startY if necessary due to previous content
          head: [['Nombre', 'Estado', 'Fecha', 'Gasto Total', 'Registró Total', 'Clicks (Int.)', 'Aperturas (Int.)', 'Gasto (Int.)', 'Registros (Int.)', 'Grupos (Campaña)'] ],
          body: reportData.campaigns.map((campaign: CampaignData) => {
            let totalInteractionClicks = 0;
            let totalInteractionOpens = 0;
            let totalInteractionDineroGastado = 0;
            let totalInteractionRegistrations = 0;

            if (campaign.interaccion_destinatario) {
              Object.values(campaign.interaccion_destinatario).forEach(interaction => {
                if (interaction) {
                  totalInteractionClicks += interaction.clicks || 0;
                  totalInteractionOpens += interaction.opens || 0;
                  totalInteractionDineroGastado += interaction.dinero_gastado || 0;
                  if (interaction.se_registro_en_pagina) {
                    totalInteractionRegistrations++;
                  }
                }
              });
            }

            const gruposSummary = campaign.gruposdecontactosJSON?.grupos
              ?.map(g => `${g.nombre || 'Sin nombre'} (${g.contactos?.length || 0}c)`)
              .join('; ') || 'N/A';

            return [
              campaign.nombre || 'N/A',
              campaign.estado || 'N/A',
              formatDate(campaign.Fechas),
              `$${parseFloat(campaign.dinero_gastado || '0').toFixed(2)}`,
              campaign.se_registro_en_pagina ? 'Sí' : 'No',
              totalInteractionClicks.toString(),
              totalInteractionOpens.toString(),
              `$${Number(totalInteractionDineroGastado || 0).toFixed(2)}`, 
              totalInteractionRegistrations.toString(),
              gruposSummary
            ];
          }),
          theme: 'striped',
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [40, 42, 91], fontSize: 8, cellPadding: 2, textColor: [255,255,255] },
          alternateRowStyles: { fontSize: 8, cellPadding: 2 },
          columnStyles: {
            0: { cellWidth: 25 }, // Nombre
            1: { cellWidth: 15 }, // Estado
            2: { cellWidth: 18 }, // Fecha
            3: { cellWidth: 18 }, // Gasto Total
            4: { cellWidth: 15 }, // Registró Total
            5: { cellWidth: 12 }, // Clicks (Int.)
            6: { cellWidth: 12 }, // Aperturas (Int.)
            7: { cellWidth: 18 }, // Gasto (Int.)
            8: { cellWidth: 12 }, // Registros (Int.)
            9: { cellWidth: 'auto' } // Grupos (Campaña)
          },
          // didParseCell: function (data) {
          //   // Example: Optional: Custom styling for specific cells if needed later
          //   // if (data.column.dataKey === 9 && data.cell.section === 'body') { // For 'Grupos (Campaña)' column
          //   //   data.cell.styles.fontSize = 8;
          //   // }
          // }
        });
        
        onProgress(50);
        
        // Capture charts as images
        if (chartRefs.campaignChartRef.current?.querySelector('canvas')) {
          const campaignChartCanvas = chartRefs.campaignChartRef.current.querySelector('canvas') as HTMLCanvasElement;
          const campaignChartImage = campaignChartCanvas.toDataURL('image/png');
          
          // Add campaign status chart
          doc.addPage();
          doc.setFontSize(14);
          doc.setTextColor(40, 42, 91);
          doc.text('Estado de Campañas', 20, 20);
          doc.addImage(campaignChartImage, 'PNG', 60, 30, 90, 90);
          
          onProgress(75);
          
          // Add contact groups chart if available
          if (chartRefs.contactsChartRef.current?.querySelector('canvas')) {
            const contactsChartCanvas = chartRefs.contactsChartRef.current.querySelector('canvas') as HTMLCanvasElement;
            const contactsChartImage = contactsChartCanvas.toDataURL('image/png');
            
            doc.text('Distribución de Contactos por Grupo', 20, 145);
            doc.addImage(contactsChartImage, 'PNG', 60, 155, 90, 90);
          }
        }
        
        // Add contact groups table
        if (reportData.contactGroups.length > 0) {
          doc.addPage();
          doc.setFontSize(14);
          doc.setTextColor(40, 42, 91);
          doc.text('Grupos de Contactos', 20, 20);
          
          autoTable(doc, {
            startY: 30,
            head: [['Nombre del Grupo', 'Cantidad de Contactos']],
            body: reportData.contactGroups.map((group: ContactGroup) => [
              group.name,
              group.contactCount
            ]),
            theme: 'striped',
            headStyles: { fillColor: [40, 42, 91] }
          });
        }

        onProgress(80); // Progress before A/B tests

        // Add A/B Test Results section
        if (abTests && abTests.length > 0) {
          doc.addPage();
          let currentY = 20;
          doc.setFontSize(16);
          doc.setTextColor(40, 42, 91);
          doc.text('Resultados de Pruebas A/B', 20, currentY);
          currentY += 10;

          abTests.forEach((test, index) => {
            if (index > 0) {
              currentY += 15; // More space between tests
            }
            // Check if a new page is needed before drawing the test content
            if (currentY > 250) { // Estimate space needed for a test block
              doc.addPage();
              currentY = 20;
               // Re-draw section title on new page if it's the first item on this new page
              doc.setFontSize(16);
              doc.setTextColor(40, 42, 91);
              doc.text('Resultados de Pruebas A/B (Continuación)', 20, currentY);
              currentY += 10;
            }
            
            doc.setFontSize(12);
            doc.setTextColor(40, 42, 91);
            doc.text(`Prueba: ${test.name}`, 20, currentY);
            currentY += 7;

            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(`Fecha de Creación: ${formatDate(test.dateCreated)}`, 20, currentY);
            currentY += 7;

            const results = test.results;
            const campaignA = results.campaignA;
            const campaignB = results.campaignB;

            const tableData = [
              [
                'Tasa de Apertura',
                formatRateAsPercentage(campaignA.openRate),
                formatRateAsPercentage(campaignB.openRate)
              ],
              [
                'Tasa de Clics',
                formatRateAsPercentage(campaignA.clickRate),
                formatRateAsPercentage(campaignB.clickRate)
              ],
              [
                'Tasa de Conversión',
                formatRateAsPercentage(campaignA.conversionRate),
                formatRateAsPercentage(campaignB.conversionRate)
              ],
            ];
            // Optionally add bounce and unsubscribe if they are guaranteed to exist or handled
            if (typeof campaignA.bounceRate === 'number' && typeof campaignB.bounceRate === 'number') {
              tableData.push([
                'Tasa de Rebote',
                formatRateAsPercentage(campaignA.bounceRate),
                formatRateAsPercentage(campaignB.bounceRate)
              ]);
            }
            if (typeof campaignA.unsubscribeRate === 'number' && typeof campaignB.unsubscribeRate === 'number') {
              tableData.push([
                'Tasa de Desuscripción',
                formatRateAsPercentage(campaignA.unsubscribeRate),
                formatRateAsPercentage(campaignB.unsubscribeRate)
              ]);
            }

            autoTable(doc, {
              startY: currentY,
              head: [['Métrica', `Campaña A: ${test.campaignAName}`, `Campaña B: ${test.campaignBName}`]],
              body: tableData,
              theme: 'striped',
              headStyles: { fillColor: [40, 42, 91] },
              didDrawPage: (data) => {
                currentY = data.cursor?.y ?? currentY;
                if (data.pageNumber > doc.getNumberOfPages()) {
                    // If autotable created a new page, reset Y and add title
                    currentY = 20;
                    doc.setFontSize(16);
                    doc.setTextColor(40, 42, 91);
                    doc.text('Resultados de Pruebas A/B (Continuación)', 20, currentY);
                    currentY +=10;
                }
              },
              // Ensure table doesn't split rows awkwardly if possible, though autoTable handles most of this
            });
            const lastTable = (doc as jsPDFWithAutoTable).lastAutoTable;
            if (lastTable && typeof lastTable.finalY === 'number') {
              currentY = lastTable.finalY + 10;
            } else {
              currentY += 10; // Fallback increment if finalY is not available
            }

            doc.setFontSize(10);
            doc.setTextColor(40, 42, 91);
            doc.text('Ganador:', 20, currentY);
            doc.setTextColor(0, 0, 0);
            doc.text(results.winner === 'A' ? test.campaignAName : (results.winner === 'B' ? test.campaignBName : 'Empate'), 40, currentY);
            currentY += 7;

            doc.setTextColor(40, 42, 91);
            doc.text('Recomendación de Prueba A/B:', 20, currentY);
            currentY += 5;
            doc.setTextColor(0, 0, 0);
            const recommendationLines = doc.splitTextToSize(results.recommendation, 170);
            doc.text(recommendationLines, 20, currentY);
            currentY += (recommendationLines.length * 5) + 5;
          });
          onProgress(90); // Update progress after A/B tests
        } else {
          onProgress(90); // Still update progress to 90 if no A/B tests before recommendations
        }
        
        onProgress(90);
        
        // Save the PDF
        doc.save(`informe_campanas_${user.nombre || 'usuario'}_${new Date().toISOString().slice(0, 10)}.pdf`);
        
        onProgress(100);
        onSuccess();
        
      } catch (err) {
        console.error('Error al generar el PDF:', err);
        onError('Error al generar el PDF. Por favor, inténtelo de nuevo.');
      }
    };
    
    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      generatePDF
    }));
    
    // This component doesn't render anything
    return null;
  }
);

export default ReportPDFGenerator;
