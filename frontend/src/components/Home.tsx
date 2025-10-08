// Importamos React y el hook Link para navegación
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Home - Página principal de la aplicación
 * Muestra información general y enlaces rápidos a las funcionalidades principales
 */
const Home: React.FC = () => {
  return (
    <div className="home-page">
      {/* Sección de bienvenida */}
      <section className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">
            🚗 Bienvenido al Sistema de Control de Parqueadero
          </h1>
          <p className="welcome-description">
            Gestiona de manera eficiente el ingreso y salida de vehículos en tu parqueadero.
            Mantén un registro completo y obtén estadísticas en tiempo real.
          </p>
        </div>
      </section>

      {/* Sección de acciones rápidas */}
      <section className="quick-actions">
        <h2 className="section-title">🚀 Acciones Rápidas</h2>
        
        <div className="actions-grid">
          {/* Tarjeta para registrar vehículo */}
          <div className="action-card">
            <div className="card-icon">➕</div>
            <h3 className="card-title">Registrar Vehículo</h3>
            <p className="card-description">
              Registra el ingreso de un nuevo vehículo al parqueadero
            </p>
            <Link to="/registrar" className="btn btn-primary">
              Registrar Ahora
            </Link>
          </div>

          {/* Tarjeta para ver vehículos */}
          <div className="action-card">
            <div className="card-icon">📋</div>
            <h3 className="card-title">Ver Vehículos</h3>
            <p className="card-description">
              Consulta todos los vehículos registrados y gestiona su información
            </p>
            <Link to="/vehiculos" className="btn btn-secondary">
              Ver Lista
            </Link>
          </div>

          {/* Tarjeta para estadísticas */}
          <div className="action-card">
            <div className="card-icon">📊</div>
            <h3 className="card-title">Estadísticas</h3>
            <p className="card-description">
              Visualiza estadísticas y reportes del parqueadero
            </p>
            <Link to="/estadisticas" className="btn btn-info">
              Ver Estadísticas
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de información del sistema */}
      <section className="system-info">
        <h2 className="section-title">ℹ️ Información del Sistema</h2>
        
        <div className="info-grid">
          <div className="info-item">
            <h4>🔧 Funcionalidades</h4>
            <ul>
              <li>Registro de ingreso de vehículos</li>
              <li>Control de salida de vehículos</li>
              <li>Gestión completa de información</li>
              <li>Estadísticas en tiempo real</li>
            </ul>
          </div>

          <div className="info-item">
            <h4>🚗 Tipos de Vehículos</h4>
            <ul>
              <li>Automóviles</li>
              <li>Motocicletas</li>
              <li>Camionetas</li>
              <li>Otros vehículos</li>
            </ul>
          </div>

          <div className="info-item">
            <h4>📱 Tecnologías</h4>
            <ul>
              <li>Frontend: React + TypeScript</li>
              <li>Backend: Node.js + Express</li>
              <li>API REST completa</li>
              <li>Diseño responsivo</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;