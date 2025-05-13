import React, { useEffect, useRef, useMemo } from 'react';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TooltipItem, ChartOptions } from 'chart.js';

// Registrar los componentes de Chart.js que necesitamos
Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SentimentAnalysisView: React.FC = () => {
  // Referencias para los canvas de los gráficos
  const topChartRef = useRef<HTMLCanvasElement>(null);
  const bottomChartRef = useRef<HTMLCanvasElement>(null);

  // Datos de ejemplo para los gráficos
  const chartData = useMemo(() => ({
    labels: ['000', '000', '000', '000', '000', '000'],
    datasets: [
      {
        label: 'Rendimiento',
        data: [30, 40, 50, 40, 60, 80],
        backgroundColor: '#F21A2B',
        borderColor: '#F21A2B',
        borderWidth: 0,
        borderRadius: 2,
        barPercentage: 0.7,
        categoryPercentage: 0.7
      }
    ]
  }), []);

  // Usar type assertion para simplificar la configuración de ChartJS
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'bar'>) {
            return `Valor: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 80,
        ticks: {
          stepSize: 20
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }), []) as ChartOptions<'bar'>; // Usar type assertion con tipo correcto

  useEffect(() => {
    // Destruir gráficos anteriores si existen
    let topChartInstance: Chart | null = null;
    let bottomChartInstance: Chart | null = null;

    // Crear el gráfico superior
    if (topChartRef.current) {
      topChartInstance = new Chart(topChartRef.current, {
        type: 'bar',
        data: chartData,
        options: chartOptions
      });
    }

    // Crear el gráfico inferior con los mismos datos
    if (bottomChartRef.current) {
      bottomChartInstance = new Chart(bottomChartRef.current, {
        type: 'bar',
        data: chartData,
        options: chartOptions
      });
    }

    // Limpiar al desmontar
    return () => {
      if (topChartInstance) {
        topChartInstance.destroy();
      }
      if (bottomChartInstance) {
        bottomChartInstance.destroy();
      }
    };
  }, [chartData, chartOptions]);

  // Estilos
  const viewStyle: React.CSSProperties = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '100%',
    margin: '0 auto',
    maxHeight: 'calc(100vh - 120px)',
    overflowY: 'auto'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 10px 0'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 20px 0',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px'
  };

  const chartContainerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    padding: '20px',
    marginBottom: '20px',
    height: '200px'
  };

  return (
    <div style={viewStyle}>
      <h1 style={titleStyle}>Análisis de datos</h1>
      <p style={subtitleStyle}>Gráfico de rendimiento a lo largo del tiempo.</p>

      {/* Contenedor para el primer gráfico */}
      <div style={chartContainerStyle}>
        <canvas ref={topChartRef}></canvas>
      </div>

      {/* Contenedor para el segundo gráfico */}
      <div style={chartContainerStyle}>
        <canvas ref={bottomChartRef}></canvas>
      </div>
    </div>
  );
};

export default SentimentAnalysisView;
