import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  maxPagesToShow?: number;
  primaryColor?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxPagesToShow = 5,
  primaryColor = '#F21A2B'
}) => {
  // Calcular el número total de páginas
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Si solo hay una página o ninguna, no mostrar paginación
  if (totalPages <= 1) {
    return null;
  }
  
  // Función para generar el array de páginas a mostrar
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    // Si hay pocas páginas, mostrarlas todas
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }
    
    // Siempre mostrar la primera página
    pageNumbers.push(1);
    
    // Calcular el rango de páginas a mostrar alrededor de la página actual
    const leftSide = Math.floor(maxPagesToShow / 2);
    const rightSide = maxPagesToShow - leftSide - 1;
    
    // Si la página actual está cerca del inicio
    if (currentPage <= leftSide + 1) {
      for (let i = 2; i <= maxPagesToShow - 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
      return pageNumbers;
    }
    
    // Si la página actual está cerca del final
    if (currentPage >= totalPages - rightSide) {
      pageNumbers.push('...');
      for (let i = totalPages - maxPagesToShow + 2; i < totalPages; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push(totalPages);
      return pageNumbers;
    }
    
    // Si la página actual está en el medio
    pageNumbers.push('...');
    for (let i = currentPage - leftSide + 1; i <= currentPage + rightSide - 1; i++) {
      pageNumbers.push(i);
    }
    pageNumbers.push('...');
    pageNumbers.push(totalPages);
    
    return pageNumbers;
  };
  
  // Obtener el array de páginas a mostrar
  const pageNumbers = getPageNumbers();
  
  // Estilos para los botones
  const buttonStyle = (isActive: boolean) => ({
    border: '1px solid #ccc',
    background: isActive ? primaryColor : 'white',
    color: isActive ? 'white' : '#333',
    padding: '5px 10px',
    margin: '0 2px',
    cursor: 'pointer',
    borderRadius: '4px',
    minWidth: '32px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: isActive ? 'bold' : 'normal'
  });
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
      <span style={{ color: '#666', fontSize: '13px' }}>
        Mostrando {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} datos
      </span>
      
      <div>
        {/* Botón Anterior */}
        <button 
          style={buttonStyle(false)}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Página anterior"
        >
          &lt;
        </button>
        
        {/* Números de página */}
        {pageNumbers.map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              style={buttonStyle(page === currentPage)}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ) : (
            <span key={index} style={{ margin: '0 5px' }}>...</span>
          )
        ))}
        
        {/* Botón Siguiente */}
        <button 
          style={buttonStyle(false)}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Página siguiente"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
