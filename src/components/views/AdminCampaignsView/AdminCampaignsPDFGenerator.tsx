import { jsPDF } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { CampaignWithUser } from '../../../interfaces/admin';

interface AdminCampaignsPDFGeneratorProps {
  campaigns: CampaignWithUser[];
  stats: {
    totalCampaigns: number;
    totalUsers: number;
    totalOpens: number;
    totalClicks: number;
    totalRegistrations: number;
    totalRevenue: number;
  };
  selectedUserName: string | null;
}

// Extend jsPDF with autoTable plugin
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    } | undefined;
    autoTable: (options: UserOptions) => jsPDF;
  }
}

// Format currency for display in the PDF
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(amount);
};

// Helper function to safely format date
const safeFormatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'N/A';
  }
};

export const generateAdminCampaignsPDF = ({
  campaigns,
  stats,
  selectedUserName
}: AdminCampaignsPDFGeneratorProps): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Validate inputs
    if (!campaigns || !Array.isArray(campaigns)) {
      return reject(new Error('Datos de campañas no válidos'));
    }

    if (!stats || typeof stats !== 'object') {
      return reject(new Error('Estadísticas no válidas'));
    }

    try {
      // Create PDF document with error handling
      let doc: jsPDF;
      try {
        doc = new jsPDF();
      } catch {
        throw new Error('No se pudo inicializar el generador de PDF. Por favor, intente nuevamente.');
      }
      
      // Set document properties with error handling
      try {
        doc.setProperties({
          title: `Reporte Administrativo de Campañas - ${new Date().toLocaleDateString()}`,
          subject: 'Reporte de Campañas de Email Marketing',
          author: 'Sistema de Email Marketing',
          keywords: 'reporte, campañas, email marketing, administración',
          creator: 'Sistema de Email Marketing'
        });
      } catch (propError) {
        console.warn('No se pudieron establecer las propiedades del documento PDF:', propError);
      }

      const TOP_MARGIN = 15;
      const LEFT_MARGIN = 15;
      const SECTION_PADDING = 10; // Space between major sections
      const ELEMENT_SPACING = 8; // Space after a title before a table, or between text lines
      const LINE_SPACING = 4; // Smaller space for consecutive text lines like date/filter

      let currentY = TOP_MARGIN;

      // Add title with error handling
      try {
        doc.setFontSize(20);
        doc.setTextColor(40, 42, 91); // Navy blue color
        doc.text('Reporte Administrativo de Campañas', LEFT_MARGIN, currentY);
        currentY += ELEMENT_SPACING;

        // Add date and filter info
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generado el: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, LEFT_MARGIN, currentY);
        currentY += LINE_SPACING;

        if (selectedUserName) {
          doc.text(`Filtrado por: ${selectedUserName}`, LEFT_MARGIN, currentY);
          currentY += LINE_SPACING;
        }
        // Adjust currentY to account for the full section padding before the next element
        currentY += SECTION_PADDING - (selectedUserName ? LINE_SPACING : 0) - LINE_SPACING; 
      } catch (titleError) {
        console.error('Error al agregar el título al PDF:', titleError);
        // Continue with PDF generation even if title fails
      }
      
      // Add stats section with error handling
      try {
        doc.setFontSize(14);
        doc.setTextColor(40, 42, 91);
        doc.text('Resumen General', LEFT_MARGIN, currentY);
        currentY += ELEMENT_SPACING;
      } catch (sectionError) {
        console.error('Error al agregar la sección de resumen:', sectionError);
        currentY += ELEMENT_SPACING; // Ensure currentY advances even if text fails
      }
      
      // Stats table with error handling
      try {
        autoTable(doc, {
          startY: currentY,
          head: [['Métrica', 'Valor']],
          body: [
            ['Total de Campañas', stats.totalCampaigns.toString()],
            ['Total de Usuarios', stats.totalUsers.toString()],
            ['Total de Aperturas', stats.totalOpens.toString()],
            ['Total de Clics', stats.totalClicks.toString()],
            ['Total de Registros', stats.totalRegistrations.toString()],
            ['Ingresos Totales', formatCurrency(stats.totalRevenue)]
          ],
          theme: 'grid',
          headStyles: { 
            fillColor: [40, 42, 91],
            textColor: 255,
            fontStyle: 'bold'
          },
          styles: {
            cellPadding: 5,
            fontSize: 10
          },
          columnStyles: {
            0: { cellWidth: 60, fontStyle: 'bold' },
            1: { cellWidth: 'auto' }
          }
        });
        currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + SECTION_PADDING : currentY + 60; // Estimate space + padding if table fails to set finalY
      } catch (statsTableError) {
        console.error('Error al generar la tabla de estadísticas:', statsTableError);
        currentY += SECTION_PADDING + 60; // Estimate space if table fails
      }
      
      // Prepare campaigns data for the table with safe defaults
      interface CampaignData {
        id: string;
        nombre: string;
        userId: string;
        usuario: string;
        fecha: string;
        estado: string;
        aperturas: number;
        clics: number;
        registros: number;
        ingresos: number;
        contactos: string;
        asunto: string;
      }

      const campaignsData: CampaignData[] = campaigns.map((campaign: CampaignWithUser) => {
        try {
          return {
            id: campaign.id || 'N/A',
            nombre: campaign.nombre || 'Sin nombre',
            userId: campaign.usuario?.id || 'unknown',
            usuario: campaign.usuario?.nombre && campaign.usuario?.apellido 
              ? `${campaign.usuario.nombre} ${campaign.usuario.apellido}`.trim()
              : campaign.usuario?.username || 'Usuario desconocido',
            fecha: safeFormatDate(campaign.Fechas || campaign.createdAt),
            estado: campaign.estado || 'Desconocido',
            aperturas: campaign.metrics?.opens || 0,
            clics: campaign.metrics?.clicks || 0,
            registros: campaign.metrics?.registrations || 0,
            ingresos: campaign.metrics?.revenue || 0,
            contactos: campaign.contactos || '',
            asunto: campaign.asunto || 'Sin asunto'
          };
        } catch (dataError) {
          console.error('Error al procesar los datos de la campaña:', dataError, campaign);
          // Devolver un objeto con valores predeterminados en lugar de null
          return {
            id: 'error',
            nombre: 'Error en datos',
            userId: 'unknown',
            usuario: 'Error',
            fecha: '-',
            estado: 'Error',
            aperturas: 0,
            clics: 0,
            registros: 0,
            ingresos: 0,
            contactos: '',
            asunto: 'Error'
          };
        }
      }).filter(Boolean) as CampaignData[];
      
      if (campaignsData.length === 0) {
        throw new Error('No hay datos de campañas válidos para mostrar');
      }
      
      // Group campaigns by user
      const campaignsByUser: Record<string, typeof campaignsData> = {};
      
      campaignsData.forEach(campaign => {
        const userId = campaign.userId;
        if (!campaignsByUser[userId]) {
          campaignsByUser[userId] = [];
        }
        campaignsByUser[userId].push(campaign);
      });
      
      // Get all unique users
      const userIds = Object.keys(campaignsByUser);
      
      // For each user, create a section with their campaigns
      let isFirstUser = true;
      
      userIds.forEach(userId => {
        let userNameForErrorHandling = `ID de Usuario: ${userId}`;
        try {
          const userCampaigns = campaignsByUser[userId];
          if (!userCampaigns || userCampaigns.length === 0) return;

          const userName = userCampaigns[0].usuario;
          userNameForErrorHandling = userName; // Update with actual name if available

          if (!isFirstUser) {
            doc.addPage();
            currentY = TOP_MARGIN;
          } else {
            isFirstUser = false;
            if (doc.internal.pageSize.height - currentY < 80) { // Increased check for more safety margin
              doc.addPage();
              currentY = TOP_MARGIN;
            }
          }

          doc.setFontSize(16);
          doc.setTextColor(40, 42, 91);
          doc.text(`Campañas de: ${userName}`, LEFT_MARGIN, currentY);
          currentY += ELEMENT_SPACING;

          // Calcular totales para el usuario actual
          const userTotals = {
            opens: userCampaigns.reduce((sum, c) => sum + (c.aperturas || 0), 0),
            clicks: userCampaigns.reduce((sum, c) => sum + (c.clics || 0), 0),
            registrations: userCampaigns.reduce((sum, c) => sum + (c.registros || 0), 0),
            revenue: userCampaigns.reduce((sum, c) => sum + (c.ingresos || 0), 0),
            campaigns: userCampaigns.length
          };

          // Cuadro de resumen de métricas del usuario
          autoTable(doc, {
            startY: currentY,
            head: [['Métrica', 'Valor']],
            body: [
              ['Total de Campañas', userTotals.campaigns.toString()],
              ['Total de Aperturas', userTotals.opens.toString()],
              ['Total de Clics', userTotals.clicks.toString()],
              ['Total de Registros', userTotals.registrations.toString()],
              ['Ingresos Totales', formatCurrency(userTotals.revenue)]
            ],
            theme: 'grid',
            headStyles: { 
              fillColor: [40, 42, 91],
              textColor: 255,
              fontStyle: 'bold'
            },
            styles: {
              cellPadding: 5,
              fontSize: 10
            },
            columnStyles: {
              0: { cellWidth: 60, fontStyle: 'bold' },
              1: { cellWidth: 'auto' }
            }
          });
          currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + ELEMENT_SPACING : currentY + 40;

          // Agregar información detallada de cada campaña en páginas individuales
          userCampaigns.forEach((campaign) => {
            // Agregar una nueva página para cada campaña
            doc.addPage();
            currentY = TOP_MARGIN;
            
            // Título de la campaña
            doc.setFontSize(16);
            doc.setTextColor(40, 42, 91);
            doc.text(`Campaña: ${campaign.nombre}`, LEFT_MARGIN, currentY);
            currentY += ELEMENT_SPACING;
            
            // Información general de la campaña
            doc.setFontSize(12);
            doc.setTextColor(82, 86, 91);
            doc.text('Información General', LEFT_MARGIN, currentY);
            currentY += ELEMENT_SPACING;
            
            // Tabla con información general
            autoTable(doc, {
              startY: currentY,
              head: [['Campo', 'Valor']],
              body: [
                ['ID:', campaign.id.toString()],
                ['Nombre:', campaign.nombre],
                ['Asunto:', campaign.asunto],
                ['Fecha:', campaign.fecha],
                ['Estado:', campaign.estado]
              ],
              headStyles: { 
                fillColor: [40, 42, 91], 
                textColor: [255, 255, 255], 
                fontSize: 10,
                cellPadding: 4
              },
              bodyStyles: { 
                fontSize: 10,
                cellPadding: 4
              },
              columnStyles: {
                0: { cellWidth: 40, fontStyle: 'bold' },
                1: { cellWidth: 'auto' }
              }
            });
            
            currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + ELEMENT_SPACING : currentY + 60;
            
            // Métricas de la campaña
            doc.setFontSize(12);
            doc.setTextColor(82, 86, 91);
            doc.text('Métricas', LEFT_MARGIN, currentY);
            currentY += ELEMENT_SPACING;
            
            // Tabla con métricas
            autoTable(doc, {
              startY: currentY,
              head: [['Métrica', 'Valor']],
              body: [
                ['Aperturas:', campaign.aperturas.toString()],
                ['Clics:', campaign.clics.toString()],
                ['Registros:', campaign.registros.toString()],
                ['Ingresos:', formatCurrency(campaign.ingresos)]
              ],
              headStyles: { 
                fillColor: [40, 42, 91], 
                textColor: [255, 255, 255], 
                fontSize: 10,
                cellPadding: 4
              },
              bodyStyles: { 
                fontSize: 10,
                cellPadding: 4
              },
              columnStyles: {
                0: { cellWidth: 40, fontStyle: 'bold' },
                1: { cellWidth: 'auto' }
              }
            });
            
            currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + ELEMENT_SPACING : currentY + 60;
            
            // Destinatarios de la campaña
            doc.setFontSize(12);
            doc.setTextColor(82, 86, 91);
            doc.text('Destinatarios', LEFT_MARGIN, currentY);
            currentY += ELEMENT_SPACING;
            
            // Procesar la lista de destinatarios
            const destinatarios = campaign.contactos ? campaign.contactos.split(',').map(email => email.trim()).filter(Boolean) : [];
            
            if (destinatarios.length > 0) {
              // Mostrar el número total de destinatarios
              doc.setFontSize(10);
              doc.setTextColor(100, 100, 100);
              doc.text(`Total de destinatarios: ${destinatarios.length}`, LEFT_MARGIN, currentY);
              currentY += LINE_SPACING;
              
              // Crear una tabla con los destinatarios
              const destinatariosRows = [];
              
              // Agrupar destinatarios en filas de 3 para optimizar espacio
              for (let i = 0; i < destinatarios.length; i += 3) {
                const row = [];
                for (let j = 0; j < 3; j++) {
                  if (i + j < destinatarios.length) {
                    row.push(destinatarios[i + j]);
                  } else {
                    row.push('');
                  }
                }
                destinatariosRows.push(row);
              }
              
              autoTable(doc, {
                startY: currentY,
                head: [['Correo 1', 'Correo 2', 'Correo 3']],
                body: destinatariosRows,
                headStyles: { 
                  fillColor: [40, 42, 91], 
                  textColor: [255, 255, 255], 
                  fontSize: 9,
                  cellPadding: 3
                },
                bodyStyles: { 
                  fontSize: 8,
                  cellPadding: 3
                },
                columnStyles: {
                  0: { cellWidth: 'auto' },
                  1: { cellWidth: 'auto' },
                  2: { cellWidth: 'auto' }
                }
              });
            } else {
              // Si no hay destinatarios, mostrar un mensaje
              autoTable(doc, {
                startY: currentY,
                body: [['No hay destinatarios registrados para esta campaña']],
                bodyStyles: { 
                  fontSize: 10,
                  cellPadding: 4,
                  fontStyle: 'italic',
                  textColor: [150, 150, 150]
                }
              });
            }
          });
          
          // No generamos una página de resumen adicional ya que tenemos el cuadro de resumen al principio
        } catch (userSpecificError) {
          console.error(`Error al generar la sección PDF para ${userNameForErrorHandling}:`, userSpecificError);
          // Optionally, add a note to the PDF about the error for this user's section
          if (doc.internal.pageSize.height - currentY < 30) { // Check space before adding error text
            doc.addPage();
            currentY = TOP_MARGIN;
          }
          doc.setTextColor(255, 0, 0); // Red color for error
          doc.setFontSize(10);
          doc.text(`Error al generar datos para ${userNameForErrorHandling}. Consulte la consola.`, LEFT_MARGIN, currentY);
          currentY += ELEMENT_SPACING;
          doc.setTextColor(100,100,100); // Reset to default text color for subsequent content
        }
      });
      
      // No need for explicit cleanup as we're using autoTable correctly now

      // Generate a safe filename
      const safeUserName = selectedUserName 
        ? `_${selectedUserName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`
        : '';
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `reporte_administrativo${safeUserName}_${dateStr}.pdf`;

      // Save the PDF
      try {
        doc.save(fileName);
      } catch (saveError) {
        console.error('Error al guardar el PDF:', saveError);
        throw new Error('No se pudo guardar el archivo PDF. Por favor, intente nuevamente.');
      }
      
      // Clean up references
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (doc as any).lastAutoTable = undefined;
      } catch (cleanupError) {
        console.warn('Error al limpiar referencias del PDF:', cleanupError);
      }
      
      resolve();
    } catch (error) {
      console.error('Error in PDF generation:', error);
      reject(new Error('Error al generar el PDF. Por favor, intente nuevamente.'));
    }
  });
};

export default generateAdminCampaignsPDF;
