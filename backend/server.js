// Importamos las librerías necesarias
const express = require('express'); // Framework web para Node.js
const cors = require('cors'); // Middleware para permitir peticiones desde el frontend
const { database, initializeDatabase } = require('./database'); // Importamos la configuración de SQLite

// Creamos la aplicación Express
const app = express();
const PORT = 5000; // Puerto donde correrá nuestro servidor

// Middleware - funciones que se ejecutan antes de las rutas
app.use(cors()); // Permite peticiones desde cualquier origen (frontend)
app.use(express.json()); // Permite recibir datos en formato JSON

// Variable para controlar si la base de datos está inicializada
let dbInitialized = false;

// ==================== RUTAS DE LA API ====================

// GET - Obtener todos los vehículos
// Esta ruta devuelve la lista completa de vehículos registrados
app.get('/api/vehiculos', async (req, res) => {
    try {
        // Obtenemos todos los vehículos de la base de datos SQLite
        const vehiculos = await database.getAllVehiculos();
        
        // Enviamos la respuesta con todos los vehículos
        res.status(200).json({
            success: true,
            message: 'Vehículos obtenidos correctamente',
            data: vehiculos,
            total: vehiculos.length
        });
    } catch (error) {
        // Si hay un error, enviamos una respuesta de error
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// GET - Obtener un vehículo específico por ID
// Esta ruta busca un vehículo específico usando su ID
app.get('/api/vehiculos/:id', async (req, res) => {
    try {
        // Obtenemos el ID de los parámetros de la URL y lo convertimos a número
        const id = parseInt(req.params.id);
        
        // Buscamos el vehículo en la base de datos
        const vehiculo = await database.getVehiculoById(id);
        
        // Si no encontramos el vehículo, enviamos error 404
        if (!vehiculo) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado'
            });
        }
        
        // Si lo encontramos, lo enviamos
        res.status(200).json({
            success: true,
            message: 'Vehículo encontrado',
            data: vehiculo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// POST - Registrar ingreso de un nuevo vehículo
// Esta ruta permite registrar cuando un vehículo entra al parqueadero
app.post('/api/vehiculos', async (req, res) => {
    try {
        // Obtenemos los datos del cuerpo de la petición
        const { placa, tipo, propietario } = req.body;
        
        // Validamos que todos los campos requeridos estén presentes
        if (!placa || !tipo || !propietario) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos: placa, tipo, propietario'
            });
        }
        
        // Verificamos si ya existe un vehículo con esa placa que esté dentro
        const vehiculos = await database.getAllVehiculos();
        const vehiculoExistente = vehiculos.find(v => v.placa === placa && v.estado === 'Dentro');
        if (vehiculoExistente) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un vehículo con esa placa dentro del parqueadero'
            });
        }
        
        // Creamos el nuevo vehículo
        const nuevoVehiculo = {
            placa: placa.toUpperCase(), // Convertimos la placa a mayúsculas
            tipo,
            propietario,
            fechaIngreso: new Date().toISOString() // Fecha y hora actual
        };
        
        // Guardamos el vehículo en la base de datos
        const vehiculoCreado = await database.createVehiculo(nuevoVehiculo);
        
        // Enviamos la respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Vehículo registrado exitosamente',
            data: vehiculoCreado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// PUT - Registrar salida de un vehículo
// Esta ruta permite registrar cuando un vehículo sale del parqueadero
app.put('/api/vehiculos/:id/salida', async (req, res) => {
    try {
        // Obtenemos el ID del vehículo
        const id = parseInt(req.params.id);
        
        // Buscamos el vehículo en la base de datos
        const vehiculo = await database.getVehiculoById(id);
        
        if (!vehiculo) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado'
            });
        }
        
        // Verificamos que el vehículo esté dentro del parqueadero
        if (vehiculo.estado === 'Fuera') {
            return res.status(400).json({
                success: false,
                message: 'El vehículo ya ha salido del parqueadero'
            });
        }
        
        // Registramos la salida en la base de datos
        const fechaSalida = new Date().toISOString();
        await database.registrarSalida(id, fechaSalida);
        
        // Obtenemos el vehículo actualizado
        const vehiculoActualizado = await database.getVehiculoById(id);
        
        res.status(200).json({
            success: true,
            message: 'Salida registrada exitosamente',
            data: vehiculoActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// PUT - Actualizar información de un vehículo
// Esta ruta permite modificar los datos de un vehículo existente
app.put('/api/vehiculos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { placa, tipo, propietario } = req.body;
        
        // Buscamos el vehículo en la base de datos
        const vehiculo = await database.getVehiculoById(id);
        
        if (!vehiculo) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado'
            });
        }
        
        // Preparamos los datos para actualizar
        const datosActualizacion = {
            placa: placa ? placa.toUpperCase() : vehiculo.placa,
            tipo: tipo || vehiculo.tipo,
            propietario: propietario || vehiculo.propietario
        };
        
        // Actualizamos el vehículo en la base de datos
        const vehiculoActualizado = await database.updateVehiculo(id, datosActualizacion);
        
        res.status(200).json({
            success: true,
            message: 'Vehículo actualizado exitosamente',
            data: vehiculoActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// DELETE - Eliminar un vehículo del registro
// Esta ruta permite eliminar completamente un vehículo del sistema
app.delete('/api/vehiculos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        // Buscamos el vehículo en la base de datos antes de eliminarlo
        const vehiculo = await database.getVehiculoById(id);
        
        if (!vehiculo) {
            return res.status(404).json({
                success: false,
                message: 'Vehículo no encontrado'
            });
        }
        
        // Eliminamos el vehículo de la base de datos
        await database.deleteVehiculo(id);
        
        res.status(200).json({
            success: true,
            message: 'Vehículo eliminado exitosamente',
            data: vehiculo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// GET - Obtener estadísticas del parqueadero
// Ruta adicional para obtener información útil sobre el estado del parqueadero
app.get('/api/estadisticas', async (req, res) => {
    try {
        // Obtenemos las estadísticas de la base de datos
        const stats = await database.getEstadisticas();
        
        // Formateamos las estadísticas para que coincidan con el formato esperado por el frontend
        const estadisticas = {
            totalVehiculos: stats.total,
            vehiculosDentro: stats.dentro,
            vehiculosFuera: stats.fuera,
            tiposVehiculos: {},
            vehiculosMasAntiguos: stats.masAntiguo
        };
        
        // Procesamos los tipos de vehículos
        stats.porTipo.forEach(tipo => {
            if (tipo.tipo.toLowerCase() === 'carro') {
                estadisticas.tiposVehiculos.carros = tipo.count;
            } else if (tipo.tipo.toLowerCase() === 'moto') {
                estadisticas.tiposVehiculos.motos = tipo.count;
            }
        });
        
        // Aseguramos que siempre haya valores para carros y motos
        estadisticas.tiposVehiculos.carros = estadisticas.tiposVehiculos.carros || 0;
        estadisticas.tiposVehiculos.motos = estadisticas.tiposVehiculos.motos || 0;
        
        res.status(200).json({
            success: true,
            message: 'Estadísticas obtenidas correctamente',
            data: estadisticas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// Ruta por defecto para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Iniciamos el servidor con inicialización de base de datos
async function startServer() {
    try {
        // Inicializamos la base de datos antes de iniciar el servidor
        await initializeDatabase();
        dbInitialized = true;
        
        // Iniciamos el servidor
        app.listen(PORT, () => {
            console.log(`🚗 Servidor del parqueadero corriendo en http://localhost:${PORT}`);
            console.log(`📋 API disponible en http://localhost:${PORT}/api/vehiculos`);
            console.log(`📊 Estadísticas en http://localhost:${PORT}/api/estadisticas`);
            console.log(`💾 Base de datos SQLite inicializada correctamente`);
        });
    } catch (error) {
        console.error('💥 Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

// Iniciamos el servidor
startServer();

// Exportamos la aplicación para poder usarla en otros archivos si es necesario
module.exports = app;