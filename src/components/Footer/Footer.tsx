import React from 'react';
import { FaInstagram, FaTelegram, FaLinkedin } from 'react-icons/fa';
import logoTisyiki from '../../assets/images/Horiz.Negativo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#282A5B] text-white py-12 px-16">
      <div className="container mx-auto">
        {/* Sección principal de tres columnas */}
        <div className="flex flex-row justify-between mb-10">
          {/* Primera columna */}
          <div>
            <h3 className="text-xl font-bold mb-6">Plataforma</h3>
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-white no-underline hover:underline">Inicio</a>
              <a href="#" className="text-white no-underline hover:underline">Campaña</a>
              <a href="#" className="text-white no-underline hover:underline">Capacitación</a>
              <a href="#" className="text-white no-underline hover:underline">Soporte</a>
            </div>
          </div>

          {/* Segunda columna */}
          <div>
            <h3 className="text-xl font-bold mb-6">Compañía</h3>
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-white no-underline hover:underline">Sobre nosotros</a>
              <a href="#" className="text-white no-underline hover:underline">Contacto</a>
            </div>
          </div>

          {/* Tercera columna */}
          <div>
            <h3 className="text-xl font-bold mb-6">Legales</h3>
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-white no-underline hover:underline">Términos y condiciones</a>
              <a href="#" className="text-white no-underline hover:underline">Política de privacidad</a>
            </div>
          </div>
        </div>

        {/* Sección del logo y copyright */}
        <div className="flex flex-col items-center text-center">
          <img src={logoTisyiki} alt="TISYIKI" className="h-10 mb-4" />
          <p className="mb-4 text-sm text-gray-400">© 2024 Lift Media. All rights reserved.</p>
          
          {/* Iconos de redes sociales con más espacio inferior usando Bootstrap */}
          <div className="pb-5 mb-4" style={{backgroundColor: '#282A5B'}}>
            <div className="flex flex-row gap-4">
              <a href="#" className="text-white hover:text-gray-300">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <FaTelegram size={24} />
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 