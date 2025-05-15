import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  
  // Obtener la función de verificación de autenticación
  const { checkAuth } = useUserStore();
  
  useEffect(() => {
    // Verificar si el usuario está autenticado
    const authResult = checkAuth();
    setIsAllowed(authResult);
    setIsChecking(false);
    
    // Log para diagnóstico
    console.log('Estado de autenticación:', { 
      isAuthenticated: useUserStore.getState().isAuthenticated,
      hasUser: !!useUserStore.getState().user,
      authResult
    });
  }, [checkAuth]);
  
  // Mientras se verifica la autenticación, no mostrar nada
  if (isChecking) {
    return null; // O un spinner de carga
  }
  
  // Si no está autenticado, redirigir al login
  if (!isAllowed) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute;
