// Importamos React y los hooks necesarios
import React, { useState, useEffect } from 'react';

// Interfaces para los datos
interface Estadisticas {
  totalVehiculos: number;
  vehiculosDentro: number;
  vehiculosFuera: number;
  tiposVehiculos: {
    carros: number;
    motos: number;
  };
  capacidadMaxima: number;
  espaciosDisponibles: number;
  porcentajeOcupacion: number;
}

interface Vehiculo {
  id: number;
  placa: string;
  tipo: string;
  propietario: string;
  fechaIngreso: string;
  fechaSalida: string | null;
  estado: 'Dentro' | 'Fuera';
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
}

/**
 * Componente Estadisticas - Muestra métricas y estadísticas del parqueadero
 * Incluye gráficos simples y información resumida
 */
const Estadisticas: React.FC = () => {
  // Estados del componente
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // URL base de la API
  const API_URL = 'http://localhost:5000/api';

  /**
   * Función para obtener estadísticas desde la API
   */
  const obtenerEstadisticas = async () => {
    try {
      setLoading(true);
      setError('');

      // Obtener estadísticas
      const responseStats = await fetch(`${API_URL}/estadisticas`);
      const dataStats: ApiResponse = await responseStats.json();

      // Obtener lista completa de vehículos para análisis adicional
      const responseVehiculos = await fetch(`${API_URL}/vehiculos`);
      const dataVehiculos: ApiResponse = await responseVehiculos.json();

      if (dataStats.success && dataVehiculos.success) {
        setEstadisticas(dataStats.data);
        setVehiculos(dataVehiculos.data);
      } else {
        setError(dataStats.message || dataVehiculos.message);
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Asegúrate de que el backend esté corriendo.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para calcular el porcentaje de ocupación
   */
  const calcularPorcentajeOcupacion = (): number => {
    if (!estadisticas) return 0;
    // Usamos el porcentaje calculado por el backend que considera la capacidad máxima
    return estadisticas.porcentajeOcupacion || 0;
  };

  /**
   * Función para obtener vehículos que han estado más tiempo
   */
  const getVehiculosMasTiempo = (): Vehiculo[] => {
    const vehiculosDentro = vehiculos.filter(v => v.estado === 'Dentro');
    return vehiculosDentro
      .sort((a, b) => new Date(a.fechaIngreso).getTime() - new Date(b.fechaIngreso).getTime())
      .slice(0, 5);
  };

  /**
   * Función para calcular tiempo transcurrido
   */
  const calcularTiempoTranscurrido = (fechaIngreso: string): string => {
    const ahora = new Date();
    const ingreso = new Date(fechaIngreso);
    const diferencia = ahora.getTime() - ingreso.getTime();
    
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    
    if (horas > 0) {
      return `${horas}h ${minutos}m`;
    }
    return `${minutos}m`;
  };

  /**
   * Función para formatear fecha
   */
  const formatearFecha = (fecha: string): string => {
    return new Date(fecha).toLocaleString('es-CO', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Efecto para cargar datos al montar el componente
  useEffect(() => {
    obtenerEstadisticas();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(obtenerEstadisticas, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="estadisticas-page">
      <div className="page-header">
        <h1 className="page-title">📊 Estadísticas del Parqueadero</h1>
        <button 
          onClick={obtenerEstadisticas} 
          className="btn btn-secondary"
          disabled={loading}
        >
          🔄 Actualizar
        </button>
      </div>

      {loading && (
        <div className="loading">
          <p>📊 Cargando estadísticas...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={obtenerEstadisticas} className="btn btn-primary">
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && estadisticas && (
        <>
          {/* Alertas de capacidad */}
          {estadisticas.porcentajeOcupacion >= 90 && (
            <div className="alert alert-danger">
              <div className="alert-icon">🚨</div>
              <div className="alert-content">
                <h4>¡Capacidad Crítica!</h4>
                <p>El parqueadero está al {estadisticas.porcentajeOcupacion}% de su capacidad. Solo quedan {estadisticas.espaciosDisponibles} espacios disponibles.</p>
              </div>
            </div>
          )}
          
          {estadisticas.porcentajeOcupacion >= 80 && estadisticas.porcentajeOcupacion < 90 && (
            <div className="alert alert-warning">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <h4>Capacidad Alta</h4>
                <p>El parqueadero está al {estadisticas.porcentajeOcupacion}% de su capacidad. Quedan {estadisticas.espaciosDisponibles} espacios disponibles.</p>
              </div>
            </div>
          )}

          {estadisticas.porcentajeOcupacion >= 70 && estadisticas.porcentajeOcupacion < 80 && (
            <div className="alert alert-info">
              <div className="alert-icon">ℹ️</div>
              <div className="alert-content">
                <h4>Capacidad Moderada</h4>
                <p>El parqueadero está al {estadisticas.porcentajeOcupacion}% de su capacidad. Quedan {estadisticas.espaciosDisponibles} espacios disponibles.</p>
              </div>
            </div>
          )}

          {/* Tarjetas de estadísticas principales */}
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-icon">🚗</div>
              <div className="stat-content">
                <h3 className="stat-number">{estadisticas.totalVehiculos}</h3>
                <p className="stat-label">Total Vehículos</p>
              </div>
            </div>

            <div className="stat-card dentro">
              <div className="stat-icon">🟢</div>
              <div className="stat-content">
                <h3 className="stat-number">{estadisticas.vehiculosDentro}</h3>
                <p className="stat-label">Dentro del Parqueadero</p>
              </div>
            </div>

            <div className="stat-card fuera">
              <div className="stat-icon">🔴</div>
              <div className="stat-content">
                <h3 className="stat-number">{estadisticas.vehiculosFuera}</h3>
                <p className="stat-label">Fuera del Parqueadero</p>
              </div>
            </div>

            <div className="stat-card ocupacion">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3 className="stat-number">{calcularPorcentajeOcupacion()}%</h3>
                <p className="stat-label">Ocupación Actual</p>
              </div>
            </div>

            <div className="stat-card disponibles">
              <div className="stat-icon">🅿️</div>
              <div className="stat-content">
                <h3 className="stat-number">{estadisticas.espaciosDisponibles}</h3>
                <p className="stat-label">Espacios Disponibles</p>
              </div>
            </div>

            <div className="stat-card capacidad">
              <div className="stat-icon">🏢</div>
              <div className="stat-content">
                <h3 className="stat-number">{estadisticas.capacidadMaxima}</h3>
                <p className="stat-label">Capacidad Máxima</p>
              </div>
            </div>
          </div>

          {/* Gráfico de barras simple para tipos de vehículos */}
          <div className="chart-section">
            <h2 className="section-title">📊 Distribución por Tipo de Vehículo</h2>
            <div className="chart-container">
              <div className="bar-chart">
                <div className="bar-item">
                  <div className="bar-label">🚗 Carros</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill carros" 
                      style={{ 
                        width: estadisticas.totalVehiculos > 0 
                          ? `${(estadisticas.tiposVehiculos.carros / estadisticas.totalVehiculos) * 100}%` 
                          : '0%' 
                      }}
                    ></div>
                  </div>
                  <div className="bar-value">{estadisticas.tiposVehiculos.carros}</div>
                </div>

                <div className="bar-item">
                  <div className="bar-label">🏍️ Motos</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill motos" 
                      style={{ 
                        width: estadisticas.totalVehiculos > 0 
                          ? `${(estadisticas.tiposVehiculos.motos / estadisticas.totalVehiculos) * 100}%` 
                          : '0%' 
                      }}
                    ></div>
                  </div>
                  <div className="bar-value">{estadisticas.tiposVehiculos.motos}</div>
                </div>

                <div className="bar-item">
                  <div className="bar-label">🚐 Otros</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill otros" 
                      style={{ 
                        width: estadisticas.totalVehiculos > 0 
                          ? `${((estadisticas.totalVehiculos - estadisticas.tiposVehiculos.carros - estadisticas.tiposVehiculos.motos) / estadisticas.totalVehiculos) * 100}%` 
                          : '0%' 
                      }}
                    ></div>
                  </div>
                  <div className="bar-value">
                    {estadisticas.totalVehiculos - estadisticas.tiposVehiculos.carros - estadisticas.tiposVehiculos.motos}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de vehículos con más tiempo */}
          {getVehiculosMasTiempo().length > 0 && (
            <div className="tiempo-section">
              <h2 className="section-title">⏰ Vehículos con Más Tiempo en el Parqueadero</h2>
              <div className="tiempo-list">
                {getVehiculosMasTiempo().map((vehiculo, index) => (
                  <div key={vehiculo.id} className="tiempo-item">
                    <div className="tiempo-rank">#{index + 1}</div>
                    <div className="tiempo-info">
                      <h4 className="vehiculo-placa">{vehiculo.placa.toUpperCase()}</h4>
                      <p className="vehiculo-detalles">
                        {vehiculo.tipo} - {vehiculo.propietario}
                      </p>
                      <p className="vehiculo-tiempo">
                        Ingreso: {formatearFecha(vehiculo.fechaIngreso)}
                      </p>
                    </div>
                    <div className="tiempo-duracion">
                      <span className="duracion-badge">
                        {calcularTiempoTranscurrido(vehiculo.fechaIngreso)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="info-section">
            <h2 className="section-title">ℹ️ Información del Sistema</h2>
            <div className="info-grid">
              <div className="info-item">
                <h4>🔄 Actualización</h4>
                <p>Los datos se actualizan automáticamente cada 30 segundos</p>
              </div>
              <div className="info-item">
                <h4>📱 Tiempo Real</h4>
                <p>Las estadísticas reflejan el estado actual del parqueadero</p>
              </div>
              <div className="info-item">
                <h4>📊 Métricas</h4>
                <p>Incluye ocupación, distribución por tipos y tiempos de permanencia</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Estadisticas;