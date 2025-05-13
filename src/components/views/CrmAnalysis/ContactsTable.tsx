import React from 'react';
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
import { HubSpotContact } from '../../../services/hubspotService';

interface ContactsTableProps {
  contacts: HubSpotContact[];
}

const ContactsTable: React.FC<ContactsTableProps> = ({ contacts }) => {
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
      <h3 style={tableTitleStyle}>Contactos en HubSpot</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={tableHeaderCellStyle}>Nombre</th>
              <th style={tableHeaderCellStyle}>Email</th>
              <th style={tableHeaderCellStyle}>Estado</th>
              <th style={{ ...tableHeaderCellStyle, textAlign: 'right' }}>Ingresos</th>
              <th style={{ ...tableHeaderCellStyle, textAlign: 'center' }}>Interacción</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr 
                key={contact.id} 
                style={{ 
                  borderBottom: index === contacts.length - 1 ? 'none' : '1px solid #eee',
                  backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9'
                }}
              >
                <td style={tableCellStyle}>
                  {`${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`}
                </td>
                <td style={tableCellStyle}>{contact.properties.email}</td>
                <td style={tableCellStyle}>
                  <span style={{
                    ...badgeStyle,
                    backgroundColor: getStatusBgColor(contact.properties.hs_lead_status || 'Desconocido'),
                    color: getStatusTextColor(contact.properties.hs_lead_status || 'Desconocido')
                  }}>
                    {contact.properties.hs_lead_status || 'Desconocido'}
                  </span>
                </td>
                <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                  ${parseFloat(contact.properties.total_revenue || '0').toFixed(2)}
                </td>
                <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                  <div style={{ 
                    ...scoreContainerStyle,
                    backgroundColor: getScoreBgColor(parseInt(contact.properties.interaction_score || '0'))
                  }}>
                    {contact.properties.interaction_score || '0'}
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
