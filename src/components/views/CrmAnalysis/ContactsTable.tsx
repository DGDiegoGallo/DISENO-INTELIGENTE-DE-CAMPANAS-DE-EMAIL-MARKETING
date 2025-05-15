import React, { useState, useEffect } from 'react';
import { 
  tableContainerStyle, 
  tableTitleStyle, 
  tableStyle, 
  tableHeaderStyle, 
  tableHeaderCellStyle, 
  tableCellStyle,
  badgeStyle,
  scoreContainerStyle
} from './styles';
import { CrmAnalysisContact, DestinationInteraction } from '../../../interfaces/crm';

// Definir interfaz para datos de interacción extendidos (incluye clicks/opens)
interface ExtendedInteractionData extends DestinationInteraction {
  clicks?: number;
  opens?: number;
  email_destinatario?: string;
}

// Declarar tipos para los datos procesados
interface ProcessedContactData {
  nombre?: string; 
  email: string;
  campaignName?: string;
  leadStatus: string;
  dinero_gastado: number;
  interactionScore: number;
  clicksOpens?: {
    clicks: number;
    opens: number;
  };
}

interface ContactsTableProps {
  contacts: CrmAnalysisContact[];
}

const ContactsTable: React.FC<ContactsTableProps> = ({ contacts }) => {
  // Estado para los datos procesados de contactos
  const [processedContacts, setProcessedContacts] = useState<ProcessedContactData[]>([]);
  
  // Procesar datos reales desde Strapi
  useEffect(() => {
    if (!contacts || contacts.length === 0) return;
    
    console.log('Procesando contactos:', contacts.length);
    
    // Mapear y procesar los datos reales de cada contacto
    const processed = contacts.map(contact => {
      // Verificar que exista email e información básica
      if (!contact.email) {
        console.log('Contacto sin email:', contact);
        return null;
      }
      
      // Usar los datos de interacción desde el contacto si están disponibles
      const interactionData = contact.interactionData || {};
      
      // Usar datos calculados enviados desde el servicio
      let leadStatus = contact.leadStatus || 'Prospecto';
      const interactionScore = contact.interactionScore || 3;
      
      // Obtener dinero gastado
      const gastado = contact.totalSpent || 0;
      
      // Si hay datos específicos de interacción, procesarlos adicionalmente
      if (interactionData) {
        // Determinar estado basado en lógica de negocio (registro + dinero gastado)
        const registrado = interactionData.se_registro_en_pagina;
        const gasto = typeof interactionData.dinero_gastado === 'string' ?
          parseFloat(interactionData.dinero_gastado) :
          Number(interactionData.dinero_gastado) || 0;
          
        if (registrado) {
          if (gasto > 0) {
            leadStatus = 'Ganado';
          } else {
            leadStatus = 'Contactado';
          }
        } else {
          leadStatus = 'Prospecto';
        }
      }
      
      // Crear objeto de datos procesados
      return {
        nombre: contact.name,
        email: contact.email,
        campaignName: contact.campaign?.name || 'Sin campaña',
        leadStatus,
        dinero_gastado: gastado,
        interactionScore,
        clicksOpens: {
          clicks: (interactionData as ExtendedInteractionData)?.clicks || 0,
          opens: (interactionData as ExtendedInteractionData)?.opens || 0
        }
      } as ProcessedContactData;
    }).filter(Boolean) as ProcessedContactData[];
    
    console.log('Contactos procesados:', processed.length);
    setProcessedContacts(processed);
  }, [contacts]);

  // Función para determinar el color de fondo del badge de estado
  const getStatusBgColor = (status: string): string => {
    switch (status) {
      case 'Ganado': return '#e6ffe6';
      case 'Calificado': return '#e6f7ff';
      case 'Contactado': return '#fff9e6';
      case 'Perdido': return '#ffe6e6';
      default: return '#f0f0f0';
    }
  };

  // Función para determinar el color del texto del badge de estado
  const getStatusTextColor = (status: string): string => {
    switch (status) {
      case 'Ganado': return '#00a300';
      case 'Calificado': return '#0066cc';
      case 'Contactado': return '#cc8800';
      case 'Perdido': return '#cc0000';
      default: return '#666';
    }
  };

  // Función para determinar el color de fondo de la puntuación de interacción
  const getScoreBgColor = (score: number): string => {
    if (score > 7) return '#F21A2B';
    if (score > 4) return '#ff9966';
    return '#dddddd';
  };
  
  return (
    <div style={tableContainerStyle}>
      <h3 style={tableTitleStyle}>Contactos en CRM</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={tableHeaderCellStyle}>Nombre</th>
              <th style={tableHeaderCellStyle}>Email</th>
              <th style={tableHeaderCellStyle}>Campaña</th>
              <th style={tableHeaderCellStyle}>Estado</th>
              <th style={{ ...tableHeaderCellStyle, textAlign: 'right' }}>Ingresos</th>
              <th style={{ ...tableHeaderCellStyle, textAlign: 'center' }}>Interacción</th>
            </tr>
          </thead>
          <tbody>
            {/* Usar los datos procesados en lugar de los datos simulados */}
          {processedContacts.map((contact, index) => (
              <tr 
                key={contact.email} 
                style={{ 
                  borderBottom: index === processedContacts.length - 1 ? 'none' : '1px solid #eee',
                  backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9'
                }}
              >
                <td style={tableCellStyle}>
                  {contact.nombre || 'Desconocido'}
                </td>
                <td style={tableCellStyle}>{contact.email}</td>
                <td style={tableCellStyle}>
                  {contact.campaignName ? (
                    <span style={{
                      ...badgeStyle,
                      backgroundColor: '#f0f7ff',
                      color: '#0066cc'
                    }}>
                      {contact.campaignName}
                    </span>
                  ) : (
                    <span style={{
                      ...badgeStyle,
                      backgroundColor: '#f0f0f0',
                      color: '#666'
                    }}>
                      Sin campaña
                    </span>
                  )}
                </td>
                <td style={tableCellStyle}>
                  <span style={{
                    ...badgeStyle,
                    backgroundColor: getStatusBgColor(contact.leadStatus),
                    color: getStatusTextColor(contact.leadStatus)
                  }}>
                    {contact.leadStatus}
                  </span>
                </td>
                <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                  <span>
                    ${contact.dinero_gastado.toFixed(2)}
                  </span>
                </td>
                <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                  <div style={{ 
                    ...scoreContainerStyle,
                    position: 'relative',
                    backgroundColor: getScoreBgColor(contact.interactionScore)
                  }}>
                    {contact.interactionScore}
                    {contact.clicksOpens && contact.clicksOpens.clicks > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        fontSize: '10px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '50%',
                        padding: '2px',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 3px rgba(0,0,0,0.2)',
                        color: '#333'
                      }}>
                        {contact.clicksOpens.clicks}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactsTable;
