import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// Importar Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Importar Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
