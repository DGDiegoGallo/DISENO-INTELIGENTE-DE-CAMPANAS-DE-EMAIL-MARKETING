import React from 'react';
import footerImage1 from '../../assets/images/img_Footer 1.png';
import footerImage2 from '../../assets/images/img_Footer 2.png';

interface CallToActionProps {
  title: string;
  buttonText: string;
  onButtonClick?: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title = "Automatiza, personaliza y\nconquista: tu nueva manera de\nhacer email marketing",
  buttonText = "Comenzar",
  onButtonClick = () => {}
}) => {
  return (
    <div className="py-5" 
         style={{ 
           background: 'linear-gradient(to bottom, rgba(114, 32, 10, 0.5), #282A5B)',
           minHeight: '250px'
         }}>
      <div className="container">
        <div className="row align-items-center">
          {/* Imagen izquierda */}
          <div className="col-3 d-none d-md-flex justify-content-center align-items-center">
            <img src={footerImage1} alt="Email Marketing" className="img-fluid" style={{ maxWidth: '120px' }} />
          </div>
          
          {/* Contenido central */}
          <div className="col-md-6 text-center text-white">
            <h2 className="fw-bold mb-4">
              {title.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < title.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <button 
              className="btn btn-lg px-5 py-3" 
              style={{ backgroundColor: '#E84C24', color: 'white' }}
              onClick={onButtonClick}
            >
              {buttonText}
            </button>
          </div>
          
          {/* Imagen derecha */}
          <div className="col-3 d-none d-md-flex justify-content-center align-items-center">
            <img src={footerImage2} alt="Analytics Dashboard" className="img-fluid" style={{ maxWidth: '120px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction; 