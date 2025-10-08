// Importamos las librerías necesarias de React y React Router
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Importamos nuestros componentes de páginas
import Home from './components/Home';
import VehiculosList from './components/VehiculosList';
import RegistrarVehiculo from './components/RegistrarVehiculo';
import Estadisticas from './components/Estadisticas';

/**
 * Componente principal de la aplicación
 * Maneja la navegación y las rutas principales
 */
function App() {
  return (
    <Router>
      <div className="App">
        {/* Header con navegación */}
        <header className="app-header">
          <div className="container">
            <h1 className="app-title">🚗 Control de Parqueadero</h1>
            
            {/* Menú de navegación */}
            <nav className="nav-menu">
              <Link to="/" className="nav-link">
                🏠 Inicio
              </Link>
              <Link to="/vehiculos" className="nav-link">
                📋 Vehículos
              </Link>
              <Link to="/registrar" className="nav-link">
                ➕ Registrar
              </Link>
              <Link to="/estadisticas" className="nav-link">
                📊 Estadísticas
              </Link>
            </nav>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="main-content">
          <div className="container">
            {/* Definimos las rutas de la aplicación */}
            <Routes>
              {/* Ruta principal - Página de inicio */}
              <Route path="/" element={<Home />} />
              
              {/* Ruta para ver la lista de vehículos */}
              <Route path="/vehiculos" element={<VehiculosList />} />
              
              {/* Ruta para registrar un nuevo vehículo */}
              <Route path="/registrar" element={<RegistrarVehiculo />} />
              
              {/* Ruta para ver estadísticas */}
              <Route path="/estadisticas" element={<Estadisticas />} />
              
              {/* Ruta por defecto para páginas no encontradas */}
              <Route path="*" element={
                <div className="error-page">
                  <h2>❌ Página no encontrada</h2>
                  <p>La página que buscas no existe.</p>
                  <Link to="/" className="btn btn-primary">
                    Volver al inicio
                  </Link>
                </div>
              } />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="container">
            <p>&copy; 2024 Sistema de Control de Parqueadero - Desarrollado con React y Node.js</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
