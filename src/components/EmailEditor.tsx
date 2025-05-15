import React, { useRef, useState } from 'react';
import EmailEditor from 'react-email-editor';
import { Design } from '../interfaces/emailEditor';

interface EmailEditorComponentProps {
  onSave: (design: Design, html: string) => void;
  onClose: () => void;
  initialDesign?: Design;
}

const EmailEditorComponent: React.FC<EmailEditorComponentProps> = ({ 
  onSave, 
  onClose,
  initialDesign 
}) => {
  // Desactivamos las reglas de eslint para permitir el uso de any en este componente
  // ya que la biblioteca react-email-editor no proporciona tipos adecuados
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emailEditorRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const saveDesign = () => {
    try {
      if (emailEditorRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        emailEditorRef.current.saveDesign((design: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          emailEditorRef.current.exportHtml((data: any) => {
            const { html } = data;
            // Hacemos un cast seguro a Design
            onSave(design as Design, html);
          });
        });
      } else {
        console.error('Editor reference not available');
        // Crear un diseño vacío para evitar errores
        const emptyDesign: Design = {
          body: {
            rows: [],
            values: {}
          },
          counters: {},
          schemaVersion: 1
        };
        onSave(emptyDesign, '<p>No se pudo generar el HTML</p>');
      }
    } catch (error) {
      console.error('Error al guardar el diseño:', error);
      alert('Hubo un error al guardar el diseño. Por favor, intenta de nuevo.');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onReady = (editor: any) => {
    setIsLoaded(true);
    emailEditorRef.current = editor;
    
    // Si hay un diseño inicial, cargarlo en el editor
    if (initialDesign && emailEditorRef.current) {
      emailEditorRef.current.loadDesign(initialDesign);
    } else if (emailEditorRef.current) {
      // Inicializar con un diseño vacío para evitar errores
      emailEditorRef.current.loadDesign({
        body: {
          rows: [],
          values: {}
        },
        counters: {},
        schemaVersion: 1
      });
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.8)', 
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Barra superior con título */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px 20px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd'
      }}>
        <h3 style={{ margin: 0 }}>Editor de Correo Electrónico</h3>
      </div>
      
      {/* Barra flotante con botones siempre visible */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '0',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1500
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '15px 25px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          gap: '15px'
        }}>
          <button 
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              border: '2px solid #F21A2B',
              color: '#F21A2B',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            Cancelar
          </button>
          <button 
            onClick={saveDesign}
            style={{
              padding: '10px 25px',
              backgroundColor: '#F21A2B',
              border: 'none',
              color: 'white',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            Guardar Diseño
          </button>
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        {!isLoaded && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8f9fa'
          }}>
            <p>Cargando editor...</p>
          </div>
        )}
        <EmailEditor
          ref={emailEditorRef}
          onReady={onReady}
          minHeight="100%"
          options={{
            customCSS: [
              `body { font-family: Arial, sans-serif; }`,
            ],
            features: {
              colorPicker: {
                presets: ['#F21A2B', '#282A5B', '#ffffff', '#000000', '#f8f9fa', '#6c757d']
              }
            },
            appearance: {
              theme: 'light',
              panels: {
                tools: {
                  dock: 'left'
                }
              }
            },
            // Configuración y desactivación de herramientas específicas
            displayMode: 'email',
            tools: {
              image: {
                enabled: false
              },
              heading: {
                properties: {
                  color: {
                    value: '#282A5B'
                  }
                }
              },
              button: {
                properties: {
                  color: {
                    value: '#F21A2B'
                  }
                }
              }
            },
            // Traducciones completas en español
            translations: {
              'es-ES': {
                // Encabezados y títulos
                'editor.heading': 'Encabezado',
                'editor.text': 'Texto',
                'editor.button': 'Botón',
                'editor.divider': 'Divisor',
                'editor.columns': 'Columnas',
                'editor.social': 'Social',
                'editor.html': 'HTML',
                // Botones de acción
                'editor.save': 'Guardar',
                'editor.cancel': 'Cancelar',
                // Propiedades comunes
                'editor.colorsPalette': 'Paleta de colores',
                'editor.textColor': 'Color de texto',
                'editor.backgroundColor': 'Color de fondo',
                'editor.alignment': 'Alineación',
                'editor.font': 'Fuente',
                'editor.fontSize': 'Tamaño de fuente',
                'editor.lineHeight': 'Altura de línea',
                'editor.letterSpacing': 'Espaciado de letras',
                'editor.link': 'Enlace',
                'editor.url': 'URL',
                'editor.textToDisplay': 'Texto a mostrar',
                'editor.openIn': 'Abrir en',
                'editor.sameTab': 'Misma pestaña',
                'editor.newTab': 'Nueva pestaña',
                // Botones e interacciones
                'editor.apply': 'Aplicar',
                'editor.remove': 'Eliminar',
                'editor.edit': 'Editar',
                'editor.delete': 'Borrar',
                'editor.duplicate': 'Duplicar',
                'editor.move': 'Mover',
                'editor.preview': 'Vista previa',
                'editor.export': 'Exportar',
                'editor.undo': 'Deshacer',
                'editor.redo': 'Rehacer'
              }
            },
            locale: 'es-ES'
          }}
        />
      </div>
    </div>
  );
};

export default EmailEditorComponent;
