import { Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/dashboard';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
