// ==================== CONFIGURACIÓN DE BASE DE DATOS SQLite ====================
// Este archivo maneja toda la configuración y operaciones de la base de datos

const sqlite3 = require('sqlite3').verbose(); // Importamos SQLite3 en modo verbose para debugging
const path = require('path'); // Para manejar rutas de archivos

// Ruta donde se guardará el archivo de la base de datos
const DB_PATH = path.join(__dirname, 'parqueadero.db');

// Clase para manejar la base de datos
class Database {
    constructor() {
        this.db = null;
    }

    // Método para conectar a la base de datos
    connect() {
        return new Promise((resolve, reject) => {
            // Crear o conectar a la base de datos
            this.db = new sqlite3.Database(DB_PATH, (err) => {
                if (err) {
                    console.error('❌ Error al conectar con la base de datos:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Conectado a la base de datos SQLite');
                    resolve();
                }
            });
        });
    }

    // Método para crear las tablas necesarias
    createTables() {
        return new Promise((resolve, reject) => {
            // SQL para crear la tabla de vehículos
            const createVehiculosTable = `
                CREATE TABLE IF NOT EXISTS vehiculos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    placa TEXT NOT NULL UNIQUE,
                    tipo TEXT NOT NULL,
                    propietario TEXT NOT NULL,
                    fechaIngreso TEXT NOT NULL,
                    fechaSalida TEXT,
                    estado TEXT NOT NULL DEFAULT 'Dentro',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;

            this.db.run(createVehiculosTable, (err) => {
                if (err) {
                    console.error('❌ Error al crear tabla vehiculos:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Tabla vehiculos creada o ya existe');
                    resolve();
                }
            });
        });
    }

    // Método para poblar la base de datos con datos iniciales
    seedData() {
        return new Promise((resolve, reject) => {
            // Primero verificamos si ya hay datos
            this.db.get("SELECT COUNT(*) as count FROM vehiculos", (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Si ya hay datos, no insertamos más
                if (row.count > 0) {
                    console.log('📊 La base de datos ya tiene datos');
                    resolve();
                    return;
                }

                // Datos iniciales para poblar la base de datos
                const vehiculosIniciales = [
                    {
                        placa: 'ABC123',
                        tipo: 'Carro',
                        propietario: 'Juan Pérez',
                        fechaIngreso: '2024-01-10T08:30:00Z',
                        fechaSalida: null,
                        estado: 'Dentro'
                    },
                    {
                        placa: 'XYZ789',
                        tipo: 'Moto',
                        propietario: 'María García',
                        fechaIngreso: '2024-01-10T09:15:00Z',
                        fechaSalida: '2024-01-10T17:30:00Z',
                        estado: 'Fuera'
                    },
                    {
                        placa: 'DEF456',
                        tipo: 'Carro',
                        propietario: 'Carlos López',
                        fechaIngreso: '2024-01-10T10:00:00Z',
                        fechaSalida: null,
                        estado: 'Dentro'
                    }
                ];

                // Preparar la consulta de inserción
                const insertQuery = `
                    INSERT INTO vehiculos (placa, tipo, propietario, fechaIngreso, fechaSalida, estado)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                // Insertar cada vehículo
                const stmt = this.db.prepare(insertQuery);
                let insertedCount = 0;

                vehiculosIniciales.forEach((vehiculo, index) => {
                    stmt.run([
                        vehiculo.placa,
                        vehiculo.tipo,
                        vehiculo.propietario,
                        vehiculo.fechaIngreso,
                        vehiculo.fechaSalida,
                        vehiculo.estado
                    ], (err) => {
                        if (err) {
                            console.error(`❌ Error al insertar vehículo ${vehiculo.placa}:`, err.message);
                        } else {
                            insertedCount++;
                            console.log(`✅ Vehículo ${vehiculo.placa} insertado`);
                        }

                        // Si es el último vehículo, finalizar
                        if (index === vehiculosIniciales.length - 1) {
                            stmt.finalize();
                            console.log(`🚗 ${insertedCount} vehículos insertados en la base de datos`);
                            resolve();
                        }
                    });
                });
            });
        });
    }

    // ==================== MÉTODOS CRUD ====================

    // Obtener todos los vehículos
    getAllVehiculos() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM vehiculos ORDER BY created_at DESC", (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Obtener vehículo por ID
    getVehiculoById(id) {
        return new Promise((resolve, reject) => {
            this.db.get("SELECT * FROM vehiculos WHERE id = ?", [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Crear nuevo vehículo
    createVehiculo(vehiculo) {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO vehiculos (placa, tipo, propietario, fechaIngreso, estado)
                VALUES (?, ?, ?, ?, ?)
            `;
            
            this.db.run(query, [
                vehiculo.placa,
                vehiculo.tipo,
                vehiculo.propietario,
                vehiculo.fechaIngreso,
                'Dentro'
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...vehiculo, estado: 'Dentro' });
                }
            });
        });
    }

    // Actualizar vehículo
    updateVehiculo(id, vehiculo) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE vehiculos 
                SET placa = ?, tipo = ?, propietario = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            this.db.run(query, [
                vehiculo.placa,
                vehiculo.tipo,
                vehiculo.propietario,
                id
            ], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Vehículo no encontrado'));
                } else {
                    resolve({ id, ...vehiculo });
                }
            });
        });
    }

    // Registrar salida de vehículo
    registrarSalida(id, fechaSalida) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE vehiculos 
                SET fechaSalida = ?, estado = 'Fuera', updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            this.db.run(query, [fechaSalida, id], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Vehículo no encontrado'));
                } else {
                    resolve({ id, fechaSalida, estado: 'Fuera' });
                }
            });
        });
    }

    // Eliminar vehículo
    deleteVehiculo(id) {
        return new Promise((resolve, reject) => {
            this.db.run("DELETE FROM vehiculos WHERE id = ?", [id], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Vehículo no encontrado'));
                } else {
                    resolve({ id, deleted: true });
                }
            });
        });
    }

    // Obtener estadísticas
    getEstadisticas() {
        return new Promise((resolve, reject) => {
            const queries = {
                total: "SELECT COUNT(*) as count FROM vehiculos",
                dentro: "SELECT COUNT(*) as count FROM vehiculos WHERE estado = 'Dentro'",
                fuera: "SELECT COUNT(*) as count FROM vehiculos WHERE estado = 'Fuera'",
                porTipo: `
                    SELECT tipo, COUNT(*) as count 
                    FROM vehiculos 
                    GROUP BY tipo
                `,
                masAntiguo: `
                    SELECT * FROM vehiculos 
                    WHERE estado = 'Dentro' 
                    ORDER BY fechaIngreso ASC 
                    LIMIT 5
                `
            };

            const stats = {};
            let completedQueries = 0;
            const totalQueries = Object.keys(queries).length;

            // Ejecutar cada consulta
            Object.entries(queries).forEach(([key, query]) => {
                if (key === 'porTipo' || key === 'masAntiguo') {
                    this.db.all(query, (err, rows) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        stats[key] = rows;
                        completedQueries++;
                        if (completedQueries === totalQueries) {
                            resolve(stats);
                        }
                    });
                } else {
                    this.db.get(query, (err, row) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        stats[key] = row.count;
                        completedQueries++;
                        if (completedQueries === totalQueries) {
                            resolve(stats);
                        }
                    });
                }
            });
        });
    }

    // Cerrar conexión a la base de datos
    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        console.error('❌ Error al cerrar la base de datos:', err.message);
                        reject(err);
                    } else {
                        console.log('✅ Conexión a la base de datos cerrada');
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}

// Crear instancia única de la base de datos (Singleton)
const database = new Database();

// Inicializar la base de datos
async function initializeDatabase() {
    try {
        await database.connect();
        await database.createTables();
        await database.seedData();
        console.log('🎉 Base de datos inicializada correctamente');
        return database;
    } catch (error) {
        console.error('💥 Error al inicializar la base de datos:', error);
        throw error;
    }
}

// Exportar la instancia y función de inicialización
module.exports = {
    database,
    initializeDatabase
};