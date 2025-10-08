// Importamos React y los hooks necesarios
import React, { useState, useEffect } from 'react';

// Definimos la interfaz para el tipo de datos de un vehículo
interface Vehiculo {
  id: number;
  placa: string;
  tipo: string;
  propietario: string;
  fechaIngreso: string;
  fechaSalida: string | null;
  estado: 'Dentro' | 'Fuera';
}

// Interfaz para la respuesta de la API
interface ApiResponse {
  success: boolean;
  message: string;
  data: Vehiculo[];
  total?: number;
}

/**
 * Componente VehiculosList - Muestra la lista de vehículos registrados
 * Permite ver, editar y eliminar vehículos, así como registrar salidas
 */
const VehiculosList: React.FC = () => {
  // Estados del componente
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filtro, setFiltro] = useState<string>('todos'); // 'todos', 'dentro', 'fuera'

  // URL base de la API
  const API_URL = 'http://localhost:5000/api';

  /**
   * Función para obtener la lista de vehículos desde la API
   */
  const obtenerVehiculos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_URL}/vehiculos`);
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setVehiculos(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Asegúrate de que el backend esté corriendo.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para registrar la salida de un vehículo
   */
  const registrarSalida = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/vehiculos/${id}/salida`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Actualizamos la lista de vehículos
        await obtenerVehiculos();
        alert('✅ Salida registrada exitosamente');
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      alert('❌ Error al registrar la salida');
      console.error('Error:', err);
    }
  };

  /**
   * Función para eliminar un vehículo
   */
  const eliminarVehiculo = async (id: number, placa: string) => {
    // Confirmamos la eliminación
    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar el vehículo con placa ${placa}?`);
    
    if (!confirmar) return;

    try {
      const response = await fetch(`${API_URL}/vehiculos/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Actualizamos la lista de vehículos
        await obtenerVehiculos();
        alert('✅ Vehículo eliminado exitosamente');
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      alert('❌ Error al eliminar el vehículo');
      console.error('Error:', err);
    }
  };

  /**
   * Función para formatear fechas
   */
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Función para filtrar vehículos según el filtro seleccionado
   */
  const vehiculosFiltrados = vehiculos.filter(vehiculo => {
    if (filtro === 'dentro') return vehiculo.estado === 'Dentro';
    if (filtro === 'fuera') return vehiculo.estado === 'Fuera';
    return true; // 'todos'
  });

  // Efecto para cargar los vehículos al montar el componente
  useEffect(() => {
    obtenerVehiculos();
  }, []);

  return (
    <div className="vehiculos-list-page">
      <div className="page-header">
        <h1 className="page-title">📋 Lista de Vehículos</h1>
        <button 
          onClick={obtenerVehiculos} 
          className="btn btn-secondary"
          disabled={loading}
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <h3>🔍 Filtrar por estado:</h3>
        <div className="filter-buttons">
          <button 
            className={`btn ${filtro === 'todos' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFiltro('todos')}
          >
            Todos ({vehiculos.length})
          </button>
          <button 
            className={`btn ${filtro === 'dentro' ? 'btn-success' : 'btn-outline'}`}
            onClick={() => setFiltro('dentro')}
          >
            Dentro ({vehiculos.filter(v => v.estado === 'Dentro').length})
          </button>
          <button 
            className={`btn ${filtro === 'fuera' ? 'btn-warning' : 'btn-outline'}`}
            onClick={() => setFiltro('fuera')}
          >
            Fuera ({vehiculos.filter(v => v.estado === 'Fuera').length})
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      {loading && (
        <div className="loading">
          <p>🔄 Cargando vehículos...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={obtenerVehiculos} className="btn btn-primary">
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {vehiculosFiltrados.length === 0 ? (
            <div className="empty-state">
              <p>📭 No hay vehículos registrados{filtro !== 'todos' ? ` con estado "${filtro}"` : ''}.</p>
            </div>
          ) : (
            <div className="vehiculos-grid">
              {vehiculosFiltrados.map((vehiculo) => (
                <div key={vehiculo.id} className={`vehiculo-card ${vehiculo.estado.toLowerCase()}`}>
                  <div className="card-header">
                    <h3 className="vehiculo-placa">{vehiculo.placa}</h3>
                    <span className={`estado-badge ${vehiculo.estado.toLowerCase()}`}>
                      {vehiculo.estado === 'Dentro' ? '🟢' : '🔴'} {vehiculo.estado}
                    </span>
                  </div>
                  
                  <div className="card-body">
                    <div className="vehiculo-info">
                      <p><strong>🚗 Tipo:</strong> {vehiculo.tipo}</p>
                      <p><strong>👤 Propietario:</strong> {vehiculo.propietario}</p>
                      <p><strong>📅 Ingreso:</strong> {formatearFecha(vehiculo.fechaIngreso)}</p>
                      {vehiculo.fechaSalida && (
                        <p><strong>🚪 Salida:</strong> {formatearFecha(vehiculo.fechaSalida)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    {vehiculo.estado === 'Dentro' && (
                      <button 
                        onClick={() => registrarSalida(vehiculo.id)}
                        className="btn btn-warning btn-sm"
                      >
                        🚪 Registrar Salida
                      </button>
                    )}
                    
                    <button 
                      onClick={() => eliminarVehiculo(vehiculo.id, vehiculo.placa)}
                      className="btn btn-danger btn-sm"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VehiculosList;