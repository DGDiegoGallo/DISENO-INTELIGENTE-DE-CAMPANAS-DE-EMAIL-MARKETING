import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  PointElement, 
  LineElement, 
  Filler, 
  TooltipItem 
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { FaArrowLeft } from 'react-icons/fa'; // Icono para la flecha de retroceso

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Registrar Filler para el área bajo la línea
);

// --- Datos Placeholder --- 
const barData = {
  labels: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN'],
  datasets: [
    {
      label: 'Ingresos',
      data: [20, 35, 45, 30, 55, 70],
      backgroundColor: '#F21A2B', // Rojo
      borderRadius: 5,
    },
  ],
};

const doughnutData = {
  labels: ['Cerrados', 'Abiertos'],
  datasets: [
    {
      data: [70, 30],
      backgroundColor: ['#F21A2B', '#F21A2B'], // Cambiado de azul a rojo para mantener consistencia
      borderColor: ['#FFFFFF'],
      borderWidth: 2,
      cutout: '60%', // Ajustar grosor (era 70%)
    },
  ],
};

const lineData = {
  labels: ['5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k'],
  datasets: [
    {
      label: 'Tiempo (min)',
      data: [30, 40, 55, 80, 65, 50, 60, 45, 70, 65, 75, 60],
      fill: true,
      backgroundColor: 'rgba(242, 26, 43, 0.1)', // Relleno rojo claro
      borderColor: '#F21A2B', // Línea roja
      pointBackgroundColor: '#F21A2B', // Cambiado a rojo para mantener consistencia
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#F21A2B', // Cambiado a rojo para mantener consistencia
      tension: 0.4, // Suavizar la línea
    },
  ],
};

// --- Opciones de Gráficos --- 
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { display: false }, // Ocultar rejilla Y
      ticks: { font: { size: 10 } }
    },
    x: {
      grid: { display: false }, // Ocultar rejilla X
      ticks: { font: { size: 10 } }
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, // Ocultar leyenda
    title: { display: false },
  },
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, // Ocultar leyenda
    title: { display: false },
    tooltip: { // Personalizar tooltip (opcional)
      callbacks: {
          label: function(context: TooltipItem<'line'>) {
              let label = context.dataset.label || '';
              if (label) {
                  label += ': ';
              }
              if (context.parsed.y !== null) {
                  label += context.parsed.y + '%'; // Asumiendo que son porcentajes
              }
              // Añadir tooltip especial en un punto específico (simulado)
              if (context.dataIndex === 3) { // Índice del punto '20k'
                // No se puede añadir el tooltip '2 minutos' directamente aquí fácilmente
                // Se requeriría un plugin personalizado o renderizado sobre el canvas
              }
              return label;
          }
      }
    }
  },
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 20,
        callback: function(value: string | number) {
          // El valor puede ser número o string dependiendo de la configuración
          return typeof value === 'number' ? value + '%' : value;
        },
        font: { size: 10 }
      },
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 10 } }
    },
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
    }
  }
};

// --- Estilos de Componentes --- 
const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '10px', // Reducir padding (era 15px)
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  // Eliminar la altura fija para que se ajuste al contenido
  // height: '180px', 
};

const chartContainerStyle: React.CSSProperties = {
  flexGrow: 1, 
  position: 'relative',
  marginTop: '5px', // Añadir pequeño margen superior
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#555',
  marginBottom: '5px', // Reducir margen inferior (era 10px)
  fontWeight: 'bold',
  textAlign: 'center', // Centrar título de la tarjeta
};

const CrmDataView: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
      {/* Título con Flecha */} 
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
        <FaArrowLeft style={{ marginRight: '15px', cursor: 'pointer', color: '#555', fontSize: '18px' }} />
        <h2 style={{ margin: 0, color: '#333', fontSize: '20px' }}>Análisis CRM</h2> 
      </div>

      {/* Fila Superior de Tarjetas */} 
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Card Ingresos */} 
        <div style={cardStyle}>
          <span style={cardTitleStyle}>Ingresos totales</span>
          <div style={chartContainerStyle}>
            <Bar options={barOptions} data={barData} />
          </div>
        </div>
        {/* Card Acuerdos */} 
        <div style={cardStyle}>
          <span style={cardTitleStyle}>Acuerdos cerrados</span>
          <div style={chartContainerStyle}>
            <Doughnut options={doughnutOptions} data={doughnutData} />
          </div>
        </div>
        {/* Card Retorno */} 
        <div style={cardStyle}>
          <span style={cardTitleStyle}>Retorno de la inversión</span>
          <div style={chartContainerStyle}>
            {/* Reutilizamos datos/opciones, idealmente serían diferentes */} 
            <Doughnut options={doughnutOptions} data={doughnutData} /> 
          </div>
        </div>
      </div>

      {/* Título para el Gráfico Inferior (movido fuera de la tarjeta) */}
      <h3 style={{ 
          marginBottom: '10px', // Espacio antes de la tarjeta
          color: '#333', 
          fontSize: '16px', // Tamaño similar al título de las tarjetas
          fontWeight: 'bold'  // <-- Poner en negrita
        }}>
        Tiempo promedio de respuesta
      </h3>

      {/* Gráfico Inferior (tarjeta ya no necesita ser flex container) */} 
      <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
          height: '300px' // Mantener altura
        }}>
        {/* Contenedor del gráfico (ocupa toda la tarjeta ahora) */}
        <div style={{ ...chartContainerStyle, height: '100%', marginTop: 0 }}> {/* Ajustar estilo para ocupar toda la altura */} 
          <Line options={lineOptions} data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default CrmDataView;
