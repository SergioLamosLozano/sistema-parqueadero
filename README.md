# 🚗 Sistema de Control de Parqueadero

Un sistema completo de gestión de parqueadero desarrollado con **Node.js**, **Express**, **React** y **SQLite**.

## 📋 Características

- ✅ **Registro de vehículos** - Ingreso de carros y motos
- 🚪 **Control de entrada y salida** - Seguimiento en tiempo real
- 📊 **Estadísticas avanzadas** - Reportes y métricas del parqueadero
- ✏️ **Edición de datos** - Modificación de información de vehículos
- 🗑️ **Eliminación de registros** - Gestión completa de datos
- 💾 **Persistencia de datos** - Base de datos SQLite integrada

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **SQLite3** - Base de datos
- **CORS** - Manejo de peticiones cross-origin

### Frontend
- **React** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **CSS3** - Estilos y diseño responsivo

## 📁 Estructura del Proyecto

```
├── backend/
│   ├── database.js      # Configuración y métodos de SQLite
│   ├── server.js        # Servidor Express y rutas API
│   ├── package.json     # Dependencias del backend
│   └── parqueadero.db   # Base de datos SQLite (generada automáticamente)
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── App.tsx      # Componente principal
│   │   └── ...
│   └── package.json     # Dependencias del frontend
├── .gitignore          # Archivos excluidos del repositorio
└── README.md           # Documentación del proyecto
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/sistema-parqueadero.git
cd sistema-parqueadero
```

### 2. Configurar el Backend
```bash
cd backend
npm install
npm run dev
```
El servidor estará disponible en: `http://localhost:5000`

### 3. Configurar el Frontend
```bash
cd frontend
npm install
npm start
```
La aplicación estará disponible en: `http://localhost:3000`

## 📡 API Endpoints

### Vehículos
- `GET /api/vehiculos` - Obtener todos los vehículos
- `GET /api/vehiculos/:id` - Obtener vehículo específico
- `POST /api/vehiculos` - Registrar nuevo vehículo
- `PUT /api/vehiculos/:id` - Actualizar vehículo
- `PUT /api/vehiculos/:id/salida` - Registrar salida
- `DELETE /api/vehiculos/:id` - Eliminar vehículo

### Estadísticas
- `GET /api/estadisticas` - Obtener estadísticas del parqueadero

### Ejemplo de JSON para POST
```json
{
    "placa": "ABC123",
    "tipo": "Carro",
    "propietario": "Juan Pérez"
}
```

## 🗄️ Base de Datos

El sistema utiliza **SQLite** para la persistencia de datos. La base de datos se crea automáticamente al iniciar el servidor.

### Estructura de la tabla `vehiculos`:
- `id` - Identificador único (autoincremental)
- `placa` - Placa del vehículo (única)
- `tipo` - Tipo de vehículo (Carro/Moto)
- `propietario` - Nombre del propietario
- `fechaIngreso` - Fecha y hora de ingreso
- `fechaSalida` - Fecha y hora de salida (nullable)
- `estado` - Estado actual (Dentro/Fuera)
- `created_at` - Fecha de creación del registro
- `updated_at` - Fecha de última actualización

## 🎯 Funcionalidades

### 1. Registro de Vehículos
- Formulario intuitivo para el ingreso de datos
- Validación de campos obligatorios
- Verificación de placas duplicadas

### 2. Listado y Búsqueda
- Vista completa de todos los vehículos
- Filtros por estado (Dentro/Fuera)
- Información detallada de cada vehículo

### 3. Control de Entrada/Salida
- Registro automático de fechas y horas
- Cambio de estado automático
- Historial completo de movimientos

### 4. Estadísticas
- Total de vehículos registrados
- Vehículos actualmente dentro
- Distribución por tipo de vehículo
- Métricas de ocupación

### 5. Gestión de Datos
- Edición de información de vehículos
- Eliminación de registros
- Persistencia automática en SQLite

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev    # Ejecutar servidor en modo desarrollo
npm start      # Ejecutar servidor en producción
```

### Frontend
```bash
npm start      # Ejecutar aplicación en desarrollo
npm run build  # Construir para producción
npm test       # Ejecutar pruebas
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para la gestión eficiente de parqueaderos.

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!