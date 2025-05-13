import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { 
  chartsContainerStyle, 
  cardStyle, 
  cardTitleStyle, 
  chartContainerStyle,
  barChartOptions,
  doughnutChartOptions,
  lineChartOptions
} from './styles';

interface AnalyticsChartsProps {
  barData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
  doughnutData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
    }[];
  };
  lineData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
      fill: boolean;
    }[];
  };
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ 
  barData, 
  doughnutData, 
  lineData 
}) => {
  return (
    <div style={chartsContainerStyle}>
      {/* Card Ingresos */} 
      <div style={cardStyle}>
        <span style={cardTitleStyle}>Ingresos totales</span>
        <div style={chartContainerStyle}>
          <Bar options={barChartOptions} data={barData} />
        </div>
      </div>
      
      {/* Card Acuerdos */} 
      <div style={cardStyle}>
        <span style={cardTitleStyle}>Acuerdos cerrados</span>
        <div style={chartContainerStyle}>
          <Doughnut options={doughnutChartOptions} data={doughnutData} />
        </div>
      </div>
      
      {/* Card Retorno */} 
      <div style={cardStyle}>
        <span style={cardTitleStyle}>Puntuación de interacción</span>
        <div style={chartContainerStyle}>
          <Line options={lineChartOptions} data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
