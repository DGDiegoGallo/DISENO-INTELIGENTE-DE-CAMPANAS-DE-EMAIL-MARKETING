import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';
import zxcvbn from 'zxcvbn';
import { useAuthStore } from '../../store';
import { RegisterUserData } from '../../interfaces/user';

// Componente de formulario de registro por pasos
const RegisterForm: React.FC = () => {
  // Datos básicos obligatorios
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Información personal
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [sexo, setSexo] = useState('');
  const [edad, setEdad] = useState<number | undefined>();
  const [fechaDeNacimiento, setFechaDeNacimiento] = useState('');
  
  // Información de ubicación y contacto
  const [pais, setPais] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [telefono, setTelefono] = useState('');
  
  // Otros datos
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  
  // Validación y feedback
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Control de validación del paso 2
  const [step2Submitted, setStep2Submitted] = useState(false);
  
  // Obtener estado y funciones de Zustand
  const { 
    register, 
    isLoading, 
    error, 
    isAuthenticated,
    registrationStep,
    setRegistrationStep,
    clearError 
  } = useAuthStore();
  
  const navigate = useNavigate();

  // Efecto para redireccionar solo si el usuario inicia sesión (no después del registro)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Efecto para resetear la validación al cambiar entre pasos
  useEffect(() => {
    if (registrationStep === 2) {
      // Cuando cambiamos al paso 2, reseteamos la validación y estados
      setStep2Submitted(false);
      
      // Permitir que el DOM se actualice antes de acceder a los elementos
      setTimeout(() => {
        try {
          // Ocultar mensajes de error existentes mediante manipulación directa del DOM
          const invalidFeedbacks = document.querySelectorAll('.invalid-feedback');
          invalidFeedbacks.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.display = 'none';
            }
          });
          
          // Quitar clases is-invalid
          const invalidInputs = document.querySelectorAll('.is-invalid');
          invalidInputs.forEach(el => {
            el.classList.remove('is-invalid');
          });
        } catch (e) {
          console.error('Error manipulando el DOM:', e);
        }
      }, 0);
    }
  }, [registrationStep]);

  // Calcular la fortaleza de la contraseña
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

  // Alternar visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Calcular ancho de la barra de progreso
  const getProgressBarWidth = () => {
    return (passwordStrength + 1) * 20; // Convertir de 0-4 a 20-100%
  };

  // Obtener el color de la barra de progreso
  const getProgressBarColor = () => {
    switch (passwordStrength) {
      case 0: return 'danger'; // Rojo
      case 1: return 'danger'; // Rojo
      case 2: return 'warning'; // Amarillo
      case 3: return 'info'; // Azul
      case 4: return 'success'; // Verde
      default: return 'danger';
    }
  };
  
  // Validar paso 1 del formulario
  const validateStep1 = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Validación de credenciales básicas
    if (!username.trim()) newErrors.username = 'El nombre de usuario es obligatorio';
    if (username.length < 3) newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    
    if (!email.trim()) newErrors.email = 'El correo electrónico es obligatorio';
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'El formato del correo electrónico no es válido';
    
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    if (password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (passwordStrength < 2) newErrors.password = 'La contraseña no es lo suficientemente segura';
    
    if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    
    if (!termsAccepted) newErrors.terms = 'Debes aceptar los términos y condiciones';
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Verificar si los campos obligatorios del paso 2 cumplen las validaciones
  const validateStep2 = (): boolean => {
    // Todos los campos son obligatorios ahora
    if (nombre.trim() === '' || 
        apellido.trim() === '' || 
        pais.trim() === '' || 
        ciudad.trim() === '' || 
        domicilio.trim() === '' || 
        telefono.trim() === '') {
      return false;
    }
    
    // Adicionalmente validamos formato
    if (pais.trim().length < 3) {
      return false;
    }
    
    if (ciudad.trim().length < 3) {
      return false;
    }
    
    if (!/^\+?[0-9]{6,15}$/.test(telefono.trim())) {
      return false;
    }
    
    return true;
  };

  // Avanzar al siguiente paso
  const handleNext = () => {
    // Validar paso 1
    if (validateStep1()) {
      clearError();
      
      // Eliminar cualquier clase is-invalid en el paso 2 antes de avanzar
      setStep2Submitted(false);
      
      // Avanzar al paso 2 con un pequeño retraso para permitir la limpieza
      setTimeout(() => {
        setRegistrationStep(2);
      }, 10);
    }
  };

  // Retroceder al paso anterior
  const handleBack = () => {
    setRegistrationStep(registrationStep - 1);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Marcar el paso 2 como enviado para mostrar errores
    setStep2Submitted(true);
    
    // Validar paso 2
    if (!validateStep2()) {
      return;
    }
    
    // Limpiar cualquier error previo
    clearError();
    
    // Preparar datos del usuario
    const userData: RegisterUserData = {
      username,
      email,
      password,
      nombre,
      apellido,
      sexo: sexo || undefined,
      edad: edad || undefined,
      fechaDeNacimiento: fechaDeNacimiento || undefined,
      pais: pais || undefined,
      ciudad: ciudad || undefined,
      domicilio: domicilio || undefined,
      telefono: telefono || undefined,
      confirmed: false,
      blocked: false
    };
    
    try {
      // Registrar usuario usando zustand
      await register(userData);
      // Redirigir al login después de un registro exitoso
      navigate('/login');
      // Mostrar mensaje de éxito o alguna notificación si se desea
    } catch (err) {
      // Los errores se manejan en la tienda Zustand
      console.error('Error al registrar usuario:', err);
    }
  };

  // Renderizar paso 1: Credenciales básicas
  const renderStep1 = () => (
    <>
      <h2 className="text-center mb-4">Crear Cuenta</h2>
      
      {/* Nombre de usuario */}
      <div className="mb-3">
        <label htmlFor="username" className="form-label">Nombre de usuario<span className="text-danger">*</span></label>
        <input
          type="text"
          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          id="username"
          placeholder="Ingrese un nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
        />
        {errors.username && <div className="invalid-feedback">{errors.username}</div>}
        <small className="text-muted">Mínimo 3 caracteres</small>
      </div>

      {/* Email */}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Correo electrónico<span className="text-danger">*</span></label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          id="email"
          placeholder="ejemplo@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        <small className="text-muted">Mínimo 6 caracteres</small>
      </div>

      {/* Contraseña */}
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Contraseña<span className="text-danger">*</span></label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            placeholder="••••••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
        
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
        <small className="text-muted">Mínimo 6 caracteres</small>
      </div>

      {/* Confirmar contraseña */}
      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña<span className="text-danger">*</span></label>
        <input
          type={showPassword ? "text" : "password"}
          className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
          id="confirmPassword"
          placeholder="••••••••••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
      </div>

      {/* Términos y condiciones */}
      <div className="form-check mb-3">
        <input
          type="checkbox"
          className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
          id="termsCheckbox"
          checked={termsAccepted}
          onChange={() => setTermsAccepted(!termsAccepted)}
          required
        />
        <label className="form-check-label" htmlFor="termsCheckbox">
          He leído y acepto totalmente la política de privacidad y las condiciones generales.<span className="text-danger">*</span>
        </label>
        {errors.terms && <div className="invalid-feedback">{errors.terms}</div>}
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
          Acepto de modo inequívoco recibir boletines, newsletter o comunicaciones comerciales.
        </label>
      </div>
    </>
  );

  // Renderizar paso 2: Información personal y contacto
  const renderStep2 = () => (
    <>
      <h2 className="text-center mb-4">Información Personal y Contacto</h2>
      
      {/* Nombre */}
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre<span className="text-danger">*</span></label>
        <input
          type="text"
          className={`form-control ${step2Submitted && !nombre.trim() ? 'is-invalid' : ''}`}
          id="nombre"
          placeholder="Ingrese su nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoComplete="off"
        />
        {/* Div oculto inicialmente, solo se muestra cuando el formulario se envía */}
        <div className="invalid-feedback" style={{ display: step2Submitted && !nombre.trim() ? 'block' : 'none' }}>
          El nombre es obligatorio
        </div>
      </div>

      {/* Apellido */}
      <div className="mb-3">
        <label htmlFor="apellido" className="form-label">Apellido<span className="text-danger">*</span></label>
        <input
          type="text"
          className={`form-control ${step2Submitted && !apellido.trim() ? 'is-invalid' : ''}`}
          id="apellido"
          placeholder="Ingrese su apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          autoComplete="off"
        />
        {/* Div oculto inicialmente, solo se muestra cuando el formulario se envía */}
        <div className="invalid-feedback" style={{ display: step2Submitted && !apellido.trim() ? 'block' : 'none' }}>
          El apellido es obligatorio
        </div>
      </div>

      {/* Sexo */}
      <div className="mb-3">
        <label htmlFor="sexo" className="form-label">Sexo</label>
        <select 
          className="form-select" 
          id="sexo"
          value={sexo}
          onChange={(e) => setSexo(e.target.value)}
        >
          <option value="">Seleccionar</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
          <option value="no_especificado">Prefiero no decirlo</option>
        </select>
      </div>

      {/* Edad */}
      <div className="mb-3">
        <label htmlFor="edad" className="form-label">Edad</label>
        <input
          type="number"
          className="form-select"
          id="edad"
          min={1}
          max={120}
          placeholder="Ingrese su edad"
          value={edad || ''}
          onChange={(e) => setEdad(e.target.value ? parseInt(e.target.value) : undefined)}
        />
      </div>

      {/* Fecha de nacimiento */}
      <div className="mb-3">
        <label htmlFor="fechaDeNacimiento" className="form-label">Fecha de Nacimiento</label>
        <input
          type="date"
          className="form-control"
          id="fechaDeNacimiento"
          value={fechaDeNacimiento}
          onChange={(e) => setFechaDeNacimiento(e.target.value)}
        />
      </div>
      <h2 className="text-center mb-4">Información de Contacto</h2>
      
      {/* País */}
      <div className="mb-3">
        <label htmlFor="pais" className="form-label">País<span className="text-danger">*</span></label>
        <input
          type="text"
          className={`form-control ${step2Submitted && (pais.trim() === '' || pais.trim().length < 3) ? 'is-invalid' : ''}`}
          id="pais"
          placeholder="Ingrese su país"
          value={pais}
          onChange={(e) => setPais(e.target.value)}
          autoComplete="off"
        />
        {step2Submitted && pais.trim() === '' && (
          <div className="invalid-feedback">El país es obligatorio</div>
        )}
        {step2Submitted && pais.trim() !== '' && pais.trim().length < 3 && (
          <div className="invalid-feedback">El país debe tener al menos 3 caracteres</div>
        )}
      </div>

      {/* Ciudad */}
      <div className="mb-3">
        <label htmlFor="ciudad" className="form-label">Ciudad<span className="text-danger">*</span></label>
        <input
          type="text"
          className={`form-control ${step2Submitted && (ciudad.trim() === '' || ciudad.trim().length < 3) ? 'is-invalid' : ''}`}
          id="ciudad"
          placeholder="Ingrese su ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          autoComplete="off"
        />
        {step2Submitted && ciudad.trim() === '' && (
          <div className="invalid-feedback">La ciudad es obligatoria</div>
        )}
        {step2Submitted && ciudad.trim() !== '' && ciudad.trim().length < 3 && (
          <div className="invalid-feedback">La ciudad debe tener al menos 3 caracteres</div>
        )}
      </div>

      {/* Domicilio */}
      <div className="mb-3">
        <label htmlFor="domicilio" className="form-label">Domicilio<span className="text-danger">*</span></label>
        <input
          type="text"
          className={`form-control ${step2Submitted && domicilio.trim() === '' ? 'is-invalid' : ''}`}
          id="domicilio"
          placeholder="Ingrese su domicilio"
          value={domicilio}
          onChange={(e) => setDomicilio(e.target.value)}
          autoComplete="off"
        />
        {step2Submitted && domicilio.trim() === '' && (
          <div className="invalid-feedback">El domicilio es obligatorio</div>
        )}
      </div>

      {/* Teléfono */}
      <div className="mb-3">
        <label htmlFor="telefono" className="form-label">Teléfono<span className="text-danger">*</span></label>
        <input
          type="tel"
          className={`form-control ${step2Submitted && (telefono.trim() === '' || !/^\+?[0-9]{6,15}$/.test(telefono.trim())) ? 'is-invalid' : ''}`}
          id="telefono"
          placeholder="Ingrese su teléfono (ej: +56912345678)"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          autoComplete="off"
        />
        {step2Submitted && telefono.trim() === '' && (
          <div className="invalid-feedback">El teléfono es obligatorio</div>
        )}
        {step2Submitted && telefono.trim() !== '' && !/^\+?[0-9]{6,15}$/.test(telefono.trim()) && (
          <div className="invalid-feedback">Ingrese un número de teléfono válido (6-15 dígitos)</div>
        )}
        <small className="text-muted">Formato: código de país opcional (+56) seguido de 6-15 dígitos</small>
      </div>


    </>
  );

  // Renderizar paso actual
  const renderCurrentStep = () => {
    switch (registrationStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      default: return renderStep1();
    }
  };

  // Renderizar botones de navegación
  const renderNavButtons = () => (
    <div className="d-flex justify-content-between mt-4">
      {registrationStep > 1 && (
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleBack}
        >
          <FaArrowLeft className="me-2" /> Anterior
        </button>
      )}
      
      {registrationStep < 2 ? (
        <button
          type="button"
          className="btn btn-danger ms-auto"
          onClick={handleNext}
        >
          Siguiente <FaArrowRight className="ms-2" />
        </button>
      ) : (
        <button
          type="submit"
          className="btn btn-success ms-auto"
          disabled={isLoading}
        >
          {isLoading ? 'Registrando...' : (
            <>
              Completar Registro <FaCheck className="ms-2" />
            </>
          )}
        </button>
      )}
    </div>
  );

  // Renderizar indicador de pasos
  const renderStepIndicator = () => (
    <div className="mb-4">
      <div className="d-flex justify-content-between">
        {[1, 2].map((step) => (
          <div key={step} className="text-center" style={{ flex: 1 }}>
            <div 
              className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${
                registrationStep >= step 
                  ? 'bg-danger text-white' 
                  : 'bg-light text-muted border'
              }`}
              style={{ width: '40px', height: '40px', cursor: 'pointer' }}
              onClick={() => {
                if (registrationStep > step) {
                  setRegistrationStep(step);
                }
              }}
            >
              {step}
            </div>
            <small className={registrationStep >= step ? 'text-dark' : 'text-muted'}>
              {step === 1 ? 'Credenciales' : 'Personal'}
            </small>
          </div>
        ))}
      </div>
      <div className="progress mt-2" style={{ height: '4px' }}>
        <div
          className="progress-bar bg-danger"
          role="progressbar"
          style={{ width: `${((registrationStep - 1) / 1) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      {renderStepIndicator()}
      {renderCurrentStep()}
      
      {/* Mostrar error general si existe */}
      {error && (
        <div className="alert alert-danger mt-3 mb-3" role="alert">
          {error}
        </div>
      )}
      
      {renderNavButtons()}
    </form>
  );
};

export default RegisterForm;
