import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/dashboard';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Footer from './components/Footer/Footer';
import UserInitializer from './components/UserInitializer';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';
import useUserStore from './store/useUserStore';

function App() {
  const location = useLocation();
  const showFooter = location.pathname === '/'; // Solo mostrar el footer en la landing page
  const { isAuthenticated, logout } = useUserStore();
  
  // Verificar si se ha solicitado un cierre de sesión forzado
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('forceLogout') === 'true') {
      console.log('Forzando cierre de sesión desde la URL');
      logout();
      localStorage.removeItem('session_closed'); // Limpiar para permitir futuros inicios de sesión
    }
    
    // Verificar si hay sesión cerrada para depuración
    const sessionClosed = localStorage.getItem('session_closed');
    console.log('Estado de sesión al cargar App:', {
      isAuthenticated,
      sessionClosed,
      pathname: location.pathname
    });
  }, [location, logout, isAuthenticated]);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Componente para inicializar datos de usuario */}
      <UserInitializer />
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
