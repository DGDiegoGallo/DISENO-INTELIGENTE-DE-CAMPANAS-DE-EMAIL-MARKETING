import React from 'react';

interface EmailHtmlPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  title?: string;
}

const EmailHtmlPreviewModal: React.FC<EmailHtmlPreviewModalProps> = ({ isOpen, onClose, htmlContent, title = 'Vista Previa del Email' }) => {
  if (!isOpen) {
    return null;
  }

  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '0',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    width: '90%',
    maxWidth: '700px', // Typical email width
    height: '80vh', // Fixed height for the modal body
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const modalHeaderStyle: React.CSSProperties = {
    padding: '15px 20px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  };

  const modalTitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#888',
    lineHeight: '1',
  };

  const iframeContainerStyle: React.CSSProperties = {
    flexGrow: 1,
    overflow: 'auto', // Scroll within the iframe container if needed
  };

  const iframeStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: 'none',
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>{title}</h3>
          <button style={closeButtonStyle} onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </div>
        <div style={iframeContainerStyle}>
          <iframe
            title="Email Preview"
            srcDoc={htmlContent} // Use srcDoc to render HTML string
            style={iframeStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailHtmlPreviewModal;
