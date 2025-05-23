import React from 'react';

interface RatingCardProps {
  title: string;
  value: number;
  type: 'clicks' | 'opens' | 'economic';
}

interface Grade {
  letter: 'S' | 'A' | 'B' | 'C' | 'F';
  color: string;
}

const getGrade = (value: number, type: 'clicks' | 'opens' | 'economic'): Grade => {
  const S_COLOR = '#4CAF50'; // Green
  const A_COLOR = '#8BC34A'; // Light Green
  const B_COLOR = '#FFC107'; // Amber
  const C_COLOR = '#FF9800'; // Orange
  const F_COLOR = '#F44336'; // Red

  if (type === 'economic') {
    if (value > 5000) return { letter: 'S', color: S_COLOR };
    if (value > 3000) return { letter: 'A', color: A_COLOR };
    if (value > 1000) return { letter: 'B', color: B_COLOR };
    if (value > 0) return { letter: 'C', color: C_COLOR };
    return { letter: 'F', color: F_COLOR };
  }

  if (type === 'clicks') {
    if (value > 1000) return { letter: 'S', color: S_COLOR };
    if (value > 500) return { letter: 'A', color: A_COLOR };
    if (value > 100) return { letter: 'B', color: B_COLOR };
    if (value > 0) return { letter: 'C', color: C_COLOR };
    return { letter: 'F', color: F_COLOR };
  }

  if (type === 'opens') {
    if (value > 2000) return { letter: 'S', color: S_COLOR };
    if (value > 1000) return { letter: 'A', color: A_COLOR };
    if (value > 200) return { letter: 'B', color: B_COLOR };
    if (value > 0) return { letter: 'C', color: C_COLOR };
    return { letter: 'F', color: F_COLOR };
  }
  return { letter: 'F', color: F_COLOR }; // Default
};

const RatingCard: React.FC<RatingCardProps> = ({ title, value, type }) => {
  const { letter, color } = getGrade(value, type);

  const cardStyle: React.CSSProperties = {
    backgroundColor: color,
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    minHeight: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  const gradeStyle: React.CSSProperties = {
    fontSize: '3rem',
    fontWeight: 'bold',
  };

  const titleStyleInternal: React.CSSProperties = {
    fontSize: '1rem',
    marginTop: '10px',
  };
  
  const valueStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    marginTop: '5px',
    opacity: 0.8,
  };

  return (
    <div style={cardStyle}>
      <div style={gradeStyle}>{letter}</div>
      <div style={titleStyleInternal}>{title}</div>
      <div style={valueStyle}>
        {type === 'economic' ? `$${value.toFixed(2)}` : value.toLocaleString()}
      </div>
    </div>
  );
};

interface IniciochartsProps {
  totalClicks: number;
  totalOpens: number;
  totalDineroGastado: number;
}

const Iniciocharts: React.FC<IniciochartsProps> = ({ totalClicks, totalOpens, totalDineroGastado }) => {
  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  };

  return (
    <div style={containerStyle}>
      <RatingCard title="Rendimiento de Clics" value={totalClicks} type="clicks" />
      <RatingCard title="Rendimiento de Aperturas" value={totalOpens} type="opens" />
      <RatingCard title="Resultado Económico" value={totalDineroGastado} type="economic" />
    </div>
  );
};

export default Iniciocharts;