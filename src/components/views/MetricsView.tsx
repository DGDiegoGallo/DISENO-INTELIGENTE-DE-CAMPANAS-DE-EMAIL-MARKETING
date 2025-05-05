import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Modal from 'react-modal';
import { FaCheckCircle } from 'react-icons/fa';

const MetricsView: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // --- Estados para los Modales ---
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('');

  // --- Funciones para manejar Modales ---
  const openFormatModal = () => {
    setSelectedFormat(''); // Reset format on open
    setIsFormatModalOpen(true);
  };
  const closeFormatModal = () => setIsFormatModalOpen(false);

  const handleExport = () => {
    if (!selectedFormat) {
      alert('Por favor, selecciona un formato.'); // Simple validation
      return;
    }
    
    // --- Simulación de Descarga ---
    let blobContent = '';
    let fileExtension = '';
    let mimeType = '';

    if (selectedFormat === 'PDF') {
      blobContent = 'Simulación de Reporte PDF - Métricas de Rendimiento\n\nDatos:\n- Métrica A: ...\n- Métrica B: ...';
      fileExtension = 'pdf';
      mimeType = 'application/pdf';
    } else if (selectedFormat === 'JPG') {
      blobContent = 'Simulación de Reporte JPG (visualización de métricas)'; // No será una imagen real
      fileExtension = 'jpg';
      mimeType = 'image/jpeg';
    }

    // Crear Blob
    const blob = new Blob([blobContent], { type: mimeType });

    // Crear URL temporal
    const url = window.URL.createObjectURL(blob);

    // Crear enlace invisible y simular clic
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_metricas.${fileExtension}`); 
    document.body.appendChild(link);
    link.click();

    // Limpiar
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
    // --- Fin Simulación ---

    // Cerrar modal de formato y abrir modal de éxito
    closeFormatModal();
    setIsSuccessModalOpen(true); 
  };

  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  // --- Estilos --- 
  const viewStyle: React.CSSProperties = {
    padding: '25px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    maxHeight: 'calc(100vh - 120px)', // Limit height relative to viewport
    overflowY: 'auto' // Add vertical scroll if content overflows
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    color: '#333',
    fontSize: '22px',
    fontWeight: 'bold',
  };

  const reportButtonStyle: React.CSSProperties = {
    backgroundColor: '#F21A2B',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  };

  const chartContainerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  };

  // --- Estilos para Modales (Basados en la imagen) ---
  // Separar estilos de content y overlay
  const modalContentStyle: React.CSSProperties = {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    padding: '30px',
    border: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    maxWidth: '450px',
    width: '90%',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff', // Fondo blanco para el contenido
  };

  const modalOverlayStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1000,
  };

  // Combinar en el formato esperado por react-modal
  const customModalStyles = {
    content: modalContentStyle,
    overlay: modalOverlayStyle,
  };

  const modalTitleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
    marginBottom: '25px',
    color: '#333',
  };

  const modalLabelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#555',
  };

  const modalSelectStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    marginBottom: '25px',
    boxSizing: 'border-box',
  };

  const modalButtonStyle: React.CSSProperties = {
    padding: '10px 25px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    border: 'none',
    margin: '0 5px',
  };

  const modalPrimaryButtonStyle: React.CSSProperties = {
    ...modalButtonStyle,
    backgroundColor: '#F21A2B', // Rojo
    color: 'white',
  };

  const modalSecondaryButtonStyle: React.CSSProperties = {
    ...modalButtonStyle,
    backgroundColor: 'white',
    color: '#F21A2B', // Rojo
    border: '1px solid #F21A2B',
  };

  const modalButtonContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  };

  const successIconStyle: React.CSSProperties = {
    color: '#28a745', // Verde éxito
    fontSize: '50px',
    marginBottom: '20px',
  };

  const successTextStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#333',
    marginBottom: '25px',
  };

  const successModalContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  };

  // --- Datos y Configuración del Gráfico --- 
  useEffect(() => {
    if (chartRef.current) {
      // Destruir instancia anterior si existe
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k'],
            datasets: [
              {
                label: 'Métrica A',
                data: [40, 55, 48, 65, 90, 75, 60, 50, 35, 55, 65, 75], // Datos de ejemplo línea azul/gris
                borderColor: 'rgba(108, 117, 125, 0.8)', // Gris azulado
                backgroundColor: 'rgba(108, 117, 125, 0.1)', // Relleno sutil
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointRadius: 0, // Ocultar puntos
              },
              {
                label: 'Métrica B',
                data: [20, 30, 45, 80, 60, 55, 40, 25, 60, 70, 80, 60], // Datos de ejemplo línea roja/rosa
                borderColor: 'rgba(242, 26, 43, 0.7)', // Rojo 
                backgroundColor: 'rgba(242, 26, 43, 0.1)', // Relleno sutil
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointRadius: 0, // Ocultar puntos
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: false // Ocultar leyenda como en la imagen
              }
            },
            scales: {
              y: {
                beginAtZero: false,
                min: 0, // Empezar en 0%
                max: 100, // Terminar en 100%
                ticks: {
                  callback: function(value) {
                    return value + '%'; // Añadir símbolo de porcentaje
                  }
                }
              },
              x: {
                grid: {
                  display: false // Ocultar líneas de cuadrícula vertical
                }
              }
            }
          }
        });
      }
    }
    // Cleanup al desmontar
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div style={viewStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Métricas de rendimiento</h2>
        {/* Actualizar onClick del botón */}
        <button style={reportButtonStyle} onClick={openFormatModal}>
          Generar informe
        </button>
      </div>
      <div style={chartContainerStyle}>
        <canvas ref={chartRef}></canvas>
      </div>

      {/* --- Modales --- */}

      {/* Modal Selección de Formato */}
      <Modal
        isOpen={isFormatModalOpen}
        onRequestClose={closeFormatModal}
        // Aplicar estilos corregidos
        style={customModalStyles}
        contentLabel="Descargar reporte"
        // appElement={'#root'} // Se configurará globalmente en main.tsx
      >
        <h3 style={modalTitleStyle}>Descargar reporte</h3>
        <label style={modalLabelStyle} htmlFor="format-select">Formato</label>
        <select 
          id="format-select" 
          style={modalSelectStyle} 
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
        >
          <option value="" disabled>Seleccionar formato</option>
          <option value="PDF">PDF</option>
          <option value="JPG">JPG</option>
        </select>
        <div style={modalButtonContainerStyle}>
          <button style={modalSecondaryButtonStyle} onClick={closeFormatModal}>Cancelar</button>
          <button style={modalPrimaryButtonStyle} onClick={handleExport}>Exportar</button>
        </div>
      </Modal>

      {/* Modal de Éxito */}
      <Modal
        isOpen={isSuccessModalOpen}
        onRequestClose={closeSuccessModal}
        // Aplicar estilos corregidos
        style={customModalStyles}
        contentLabel="Informe descargado"
      >
        <div style={successModalContentStyle}>
          <FaCheckCircle style={successIconStyle} />
          <p style={successTextStyle}>Tu informe se ha descargado exitosamente</p>
          <button style={modalPrimaryButtonStyle} onClick={closeSuccessModal}>Aceptar</button>
        </div>
      </Modal>

    </div>
  );
};

export default MetricsView;
