import React from 'react';
import { statsContainerStyle, statCardStyle, statLabelStyle, statValueStyle } from './styles';

interface StatsCardsProps {
  stats: {
    totalContacts: number;
    totalRevenue: number;
    avgInteractionScore: number;
    dealsWon: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div style={statsContainerStyle}>
      <div style={statCardStyle}>
        <div style={statLabelStyle}>Contactos</div>
        <div style={statValueStyle}>{stats.totalContacts}</div>
      </div>
      
      <div style={statCardStyle}>
        <div style={statLabelStyle}>Ingresos totales</div>
        <div style={statValueStyle}>${stats.totalRevenue.toFixed(2)}</div>
      </div>
      
      <div style={statCardStyle}>
        <div style={statLabelStyle}>Promedio de interacción</div>
        <div style={statValueStyle}>{stats.avgInteractionScore.toFixed(1)}</div>
      </div>
      
      <div style={statCardStyle}>
        <div style={statLabelStyle}>Acuerdos ganados</div>
        <div style={statValueStyle}>{stats.dealsWon}</div>
      </div>
    </div>
  );
};

export default StatsCards;
