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

  const navigate = useNavigate();
  const { login, checkAuth } = useUserStore();

  // Verificar si el usuario ya está autenticado y redirigir
  useEffect(() => {
    // Cargar email recordado si existe
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    // Si ya está autenticado, redirigir al dashboard
    if (checkAuth()) {
      navigate('/dashboard');
    }
  }, [navigate, checkAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Llamar a la API de Strapi para autenticar
      const response = await axios.post('http://34.238.122.213:1337/api/auth/local', {
        identifier: email,
        password: password
      });

      // 2. Procesar la respuesta
      if (response.data?.jwt && response.data?.user) {
        console.log('Autenticación exitosa');

        // Guardar preferencia de recordar email
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // 3. Iniciar sesión en la aplicación
        const loginSuccess = login({
          user: response.data.user,
          token: response.data.jwt
        });

        // 4. Si el login fue exitoso, redirigir
        if (loginSuccess) {
          // Usar redirección directa para evitar problemas con React Router
          window.location.href = '/dashboard';
        } else {
          setError('Error al inicializar la sesión');
        }
      } else {
        setError('Respuesta de autenticación inválida');
      }
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      }

      setError(errorMessage);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
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
                <div className="alert alert-danger mb-3">{error}</div>
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