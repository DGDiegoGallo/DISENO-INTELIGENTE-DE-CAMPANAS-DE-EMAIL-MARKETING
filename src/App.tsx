import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/dashboard';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Footer from './components/Footer/Footer';
import UserInitializer from './components/UserInitializer';

function App() {
  const location = useLocation();
  const showFooter = location.pathname === '/'; // Solo mostrar el footer en la landing page
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Componente para inicializar datos de usuario */}
      <UserInitializer />
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
