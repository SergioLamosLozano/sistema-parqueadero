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
  const [busqueda, setBusqueda] = useState<string>(''); // Estado para la búsqueda por placa

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
   * Función para filtrar vehículos según el filtro seleccionado y la búsqueda por placa
   */
  const vehiculosFiltrados = vehiculos.filter(vehiculo => {
    // Filtro por estado
    let cumpleFiltroEstado = true;
    if (filtro === 'dentro') cumpleFiltroEstado = vehiculo.estado === 'Dentro';
    if (filtro === 'fuera') cumpleFiltroEstado = vehiculo.estado === 'Fuera';
    
    // Filtro por búsqueda de placa (insensible a mayúsculas/minúsculas)
    const cumpleBusqueda = busqueda === '' || 
      vehiculo.placa.toLowerCase().includes(busqueda.toLowerCase()) ||
      vehiculo.propietario.toLowerCase().includes(busqueda.toLowerCase());
    
    return cumpleFiltroEstado && cumpleBusqueda;
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
        <h3>🔍 Filtrar y Buscar:</h3>
        
        {/* Barra de búsqueda */}
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Buscar por placa o propietario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
          {busqueda && (
            <button 
              onClick={() => setBusqueda('')}
              className="clear-search-btn"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {/* Botones de filtro por estado */}
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

        {/* Mostrar resultados de búsqueda */}
        {busqueda && (
          <div className="search-results-info">
            <p>📊 Mostrando {vehiculosFiltrados.length} resultado(s) para "{busqueda}"</p>
          </div>
        )}
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