import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useUserStore from '../store/useUserStore';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Usar el store unificado para autenticación
  const { login, isAuthenticated } = useUserStore();
  const navigate = useNavigate();
  
  // Efecto para cargar email recordado
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);
  
  // Efecto para redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos
    setIsLoading(true);
    
    try {
      // Realizar la llamada a la API de Strapi directamente
      const response = await axios.post('http://34.238.122.213:1337/api/auth/local', {
        identifier: email, // Strapi acepta email como identifier
        password: password
      });
      
      // Si el login es exitoso, actualizar el store de Zustand usando el store unificado
      if (response.data?.jwt && response.data?.user) {
        login({
          user: response.data.user,
          token: response.data.jwt
        });
        
        // La redirección se maneja en el useEffect
      }
    } catch (error) {
      // Manejar errores
      let errorMessage = 'Error al iniciar sesión';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      }
      
      setError(errorMessage);
      console.error('Error al iniciar sesión:', error);
    } finally {
      setIsLoading(false);
      
      // Si rememberMe está activado, guardar email en localStorage
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      
      <div className="container flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="card shadow-sm border-0 rounded-3 p-4" style={{ maxWidth: '450px', width: '100%' }}>
          <div className="card-body">
            <h2 className="text-center mb-4">Iniciar sesión</h2>
            
            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo electrónico</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="email" 
                  placeholder="ejemplo@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <div className="input-group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-control" 
                    id="password" 
                    placeholder="••••••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              {/* Error de login */}
              {error && (
                <div className="text-danger mb-3">{error}</div>
              )}
              
              {/* Remember me & Forgot password */}
              <div className="d-flex justify-content-between mb-4">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Recordarme
                  </label>
                </div>
                
                <a href="#" className="text-decoration-none">¿Olvidé mi contraseña?</a>
              </div>
              
              {/* Login button */}
              <div className="d-grid gap-2">
                <button 
                  type="submit" 
                  className="btn btn-danger py-2" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </div>
            </form>
            
            {/* Register link */}
            <div className="text-center mt-4">
              <span>¿No tienes cuenta? </span>
              <Link to="/register" className="text-decoration-none">Regístrate</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 