import { Routes, Route, Link } from 'react-router-dom';
import '../App.css';
import { useAppStore } from '../store'; // Importar el store
import Navbar from '../components/Navbar/Navbar'; // <-- Importar Navbar
import CircularChart from '../components/CircularChart/CircularChart'; // Importar el gráfico circular

// Componente Home usando Zustand
const Home = () => {
  const { count, increment, decrement } = useAppStore();
  return (
    <div className="container mt-4">
      <h2>Página de Inicio</h2>
      
      {/* Sección de estadísticas con el gráfico circular */}
      <div className="card mt-4 mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Estadísticas</h5>
          <div className="d-flex flex-wrap">
            <div className="me-4 mb-3">
              <CircularChart percentage={74} label="Tasa de clics" />
            </div>
          </div>
        </div>
      </div>
      
      <p>Contador: {count}</p>
      <button className="btn btn-primary me-2" onClick={increment}>Incrementar</button>
      <button className="btn btn-secondary" onClick={decrement}>Decrementar</button>
    </div>
  );
};

const About = () => (
  <div className="container mt-4">
    <h2>Página Acerca de</h2>
  </div>
);

function Dashboard() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <div className="container-fluid px-0">
        <div className="container mt-3">
          <nav>
            <ul className="nav">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard/about">Acerca de</Link>
              </li>
            </ul>
          </nav>
        </div>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard; 