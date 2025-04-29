import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import zxcvbn from 'zxcvbn';
import { useAuthStore } from '../store';

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Usar la tienda Zustand para autenticación
  const { register, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const navigate = useNavigate();

  // Efecto para redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setPasswordStrength(result.score); // Score va de 0 a 4

      // Establecer mensaje según la puntuación
      switch (result.score) {
        case 0:
          setPasswordFeedback('Muy débil');
          break;
        case 1:
          setPasswordFeedback('Débil');
          break;
        case 2:
          setPasswordFeedback('Regular');
          break;
        case 3:
          setPasswordFeedback('Buena');
          break;
        case 4:
          setPasswordFeedback('Muy segura');
          break;
        default:
          setPasswordFeedback('');
      }
    } else {
      setPasswordStrength(0);
      setPasswordFeedback('');
    }
  }, [password]);

  const getProgressBarWidth = () => {
    return (passwordStrength + 1) * 20; // Convertir de 0-4 a 20-100%
  };

  const getProgressBarColor = () => {
    switch (passwordStrength) {
      case 0:
        return 'danger'; // Rojo
      case 1:
        return 'danger'; // Rojo
      case 2:
        return 'warning'; // Amarillo
      case 3:
        return 'info'; // Azul
      case 4:
        return 'success'; // Verde
      default:
        return 'danger';
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // Limpiar errores previos
    setPasswordError('');

    // Validar que la contraseña sea lo suficientemente fuerte
    if (passwordStrength < 2) {
      setPasswordError('Por favor, elige una contraseña más segura.');
      return;
    }

    try {
      // Extraer el nombre de usuario del email (antes del @)
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);

      // Llamar al servicio de registro desde Zustand
      await register({
        username: username,
        email: email,
        password: password
      });
      
      // La redirección se maneja en el useEffect
    } catch (error) {
      // Los errores se manejan en la tienda Zustand
      console.error('Error al registrar usuario:', error);
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
            <h2 className="text-center mb-4">Registro</h2>

            <form onSubmit={handleRegister}>
              {/* Nombre completo */}
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  placeholder="Nombre"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

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

                {/* Barra de progreso para fortaleza de contraseña */}
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Fortaleza:</small>
                      <small className={`text-${getProgressBarColor()}`}>{passwordFeedback}</small>
                    </div>
                    <div className="progress" style={{ height: '5px' }}>
                      <div
                        className={`progress-bar bg-${getProgressBarColor()}`}
                        role="progressbar"
                        style={{ width: `${getProgressBarWidth()}%` }}
                        aria-valuenow={getProgressBarWidth()}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Términos y condiciones */}
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="termsCheckbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  required
                />
                <label className="form-check-label" htmlFor="termsCheckbox">
                  He leído y acepto totalmente la política de privacidad y las condiciones generales.
                </label>
              </div>

              {/* Marketing */}
              <div className="form-check mb-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="marketingCheckbox"
                  checked={marketingAccepted}
                  onChange={() => setMarketingAccepted(!marketingAccepted)}
                />
                <label className="form-check-label" htmlFor="marketingCheckbox">
                  Acepto de modo inequívoco recibir boletines, newsletter o comunicaciones comerciales de esta entidad.
                </label>
              </div>

              {/* Errores */}
              {passwordError && (
                <div className="text-danger mb-3">{passwordError}</div>
              )}
              {error && (
                <div className="text-danger mb-3">{error}</div>
              )}

              {/* Register button */}
              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-danger py-2"
                  disabled={isLoading || !termsAccepted}
                >
                  {isLoading ? 'Registrando...' : 'Registrarse'}
                </button>
              </div>
            </form>

            {/* Login link */}
            <div className="text-center mt-4">
              <span>¿Ya tienes cuenta? </span>
              <Link to="/login" className="text-decoration-none">Inicia sesión</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 