import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar los componentes necesarios
ChartJS.register(ArcElement, Tooltip, Legend);

interface CircularChartProps {
  percentage: number;
  label?: string;
}

const CircularChart: React.FC<CircularChartProps> = ({ percentage, label }) => {
  // Datos para el gráfico
  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage], // [valor, restante]
        backgroundColor: ['#282A5B', '#E8E8E8'], // Color principal y color de fondo
        borderWidth: 0,
        cutout: '80%', // Hace que el gráfico sea delgado
      },
    ],
  };

  // Opciones del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Ocultar leyenda
      },
      tooltip: {
        enabled: false, // Deshabilitar tooltips
      },
    },
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '150px', width: '150px' }}>
        <Doughnut data={data} options={options} />
        <div className="position-absolute d-flex align-items-center">
          <span className="fs-3 fw-bold">{percentage}</span>
          <span className="ms-1 fw-bold">%</span>
        </div>
      </div>
      {label && <div className="text-center mt-2">{label}</div>}
    </div>
  );
};

export default CircularChart; 