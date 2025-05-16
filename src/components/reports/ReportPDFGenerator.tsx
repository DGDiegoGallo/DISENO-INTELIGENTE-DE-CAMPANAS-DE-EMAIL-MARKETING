import React, { forwardRef, useImperativeHandle } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UserCampaignsData, CampaignData, ContactGroup } from '@/services/reportService';
import type { StrapiUser } from '@/interfaces/user';


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
}

const ReportPDFGenerator = forwardRef<ReportPDFGeneratorRef, ReportPDFGeneratorProps>(
  ({ user, reportData, onProgress, onError, onSuccess, chartRefs }, ref) => {
    
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
              `$${totalInteractionDineroGastado.toFixed(2)}`,
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
        
        // Add recommendations
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
