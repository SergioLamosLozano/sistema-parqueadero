// Importamos React y los hooks necesarios
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Interfaz para los datos del formulario
interface FormData {
  placa: string;
  tipo: string;
  propietario: string;
}

// Interfaz para la respuesta de la API
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Componente RegistrarVehiculo - Formulario para registrar nuevos vehículos
 * Permite ingresar la información de un vehículo y enviarlo a la API
 */
const RegistrarVehiculo: React.FC = () => {
  // Hook para navegación programática
  const navigate = useNavigate();

  // Estados del componente
  const [formData, setFormData] = useState<FormData>({
    placa: '',
    tipo: '',
    propietario: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // URL base de la API
  const API_URL = 'http://localhost:5000/api';

  /**
   * Función para manejar cambios en los campos del formulario
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Para el campo placa, convertir a mayúsculas y validar formato
    if (name === 'placa') {
      const placaLimpia = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: placaLimpia
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  /**
   * Función para validar el formulario
   */
  const validarFormulario = (): boolean => {
    if (!formData.placa.trim()) {
      setError('La placa es requerida');
      return false;
    }
    
    if (!formData.tipo) {
      setError('El tipo de vehículo es requerido');
      return false;
    }
    
    if (!formData.propietario.trim()) {
      setError('El nombre del propietario es requerido');
      return false;
    }

    // Validar formato de placa (3 letras + 3 números)
    const formatoPlaca = /^[A-Z]{3}[0-9]{3}$/;
    if (!formatoPlaca.test(formData.placa)) {
      setError('La placa debe tener el formato: 3 letras seguidas de 3 números (ejemplo: ABC123)');
      return false;
    }

    return true;
  };

  /**
   * Función para manejar el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      setError('');

      // Preparar datos para enviar
      const dataToSend = {
        placa: formData.placa.trim().toUpperCase(),
        tipo: formData.tipo,
        propietario: formData.propietario.trim()
      };

      // Enviar petición POST a la API
      const response = await fetch(`${API_URL}/vehiculos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        // Mostrar mensaje de éxito
        alert('✅ Vehículo registrado exitosamente');
        
        // Limpiar formulario
        setFormData({
          placa: '',
          tipo: '',
          propietario: ''
        });
        
        // Navegar a la lista de vehículos
        navigate('/vehiculos');
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
   * Función para limpiar el formulario
   */
  const limpiarFormulario = () => {
    setFormData({
      placa: '',
      tipo: '',
      propietario: ''
    });
    setError('');
  };

  return (
    <div className="registrar-vehiculo-page">
      <div className="page-header">
        <h1 className="page-title">➕ Registrar Nuevo Vehículo</h1>
        <p className="page-description">
          Completa el formulario para registrar el ingreso de un vehículo al parqueadero
        </p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="vehiculo-form">
          {/* Campo Placa */}
          <div className="form-group">
            <label htmlFor="placa" className="form-label">
              🏷️ Placa del Vehículo *
            </label>
            <input
              type="text"
              id="placa"
              name="placa"
              value={formData.placa}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Ej: ABC123"
              maxLength={6}
              required
            />
            <small className="form-help">
              Formato: 3 letras + 3 números (ejemplo: ABC123)
            </small>
          </div>

          {/* Campo Tipo */}
          <div className="form-group">
            <label htmlFor="tipo" className="form-label">
              🚗 Tipo de Vehículo *
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Selecciona el tipo de vehículo</option>
              <option value="Carro">🚗 Carro</option>
              <option value="Moto">🏍️ Moto</option>
              <option value="Camioneta">🚙 Camioneta</option>
              <option value="Camión">🚚 Camión</option>
              <option value="Bicicleta">🚲 Bicicleta</option>
              <option value="Otro">🚐 Otro</option>
            </select>
          </div>

          {/* Campo Propietario */}
          <div className="form-group">
            <label htmlFor="propietario" className="form-label">
              👤 Nombre del Propietario *
            </label>
            <input
              type="text"
              id="propietario"
              name="propietario"
              value={formData.propietario}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Ej: Juan Pérez"
              maxLength={100}
              required
            />
            <small className="form-help">
              Nombre completo de la persona responsable del vehículo
            </small>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="error-message">
              <p>❌ {error}</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '⏳ Registrando...' : '✅ Registrar Vehículo'}
            </button>
            
            <button
              type="button"
              onClick={limpiarFormulario}
              className="btn btn-secondary"
              disabled={loading}
            >
              🧹 Limpiar
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/vehiculos')}
              className="btn btn-outline"
              disabled={loading}
            >
              📋 Ver Lista
            </button>
          </div>
        </form>

        {/* Información adicional */}
        <div className="info-section">
          <h3>ℹ️ Información Importante</h3>
          <ul className="info-list">
            <li>✅ Todos los campos marcados con (*) son obligatorios</li>
            <li>🏷️ La placa debe ser única para vehículos que estén dentro del parqueadero</li>
            <li>⏰ Se registrará automáticamente la fecha y hora de ingreso</li>
            <li>🔄 Puedes actualizar la información después del registro</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegistrarVehiculo;