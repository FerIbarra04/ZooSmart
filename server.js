const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const adminRoutes = require('./routes/adminRoutes');
const animalRoutes = require('./routes/animalRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const zooRoutes = require('./routes/zooRoutes');

const app = express();
const port = 3000;

// Conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/ZooSmart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Conectado a la base de datos MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error al conectar a la base de datos MongoDB:', err);
});

// Middleware para parsear JSON
app.use(express.json());

// Usar rutas
app.use('/api/admins', adminRoutes);
app.use('/api/animales', animalRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/zoos', zooRoutes);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para servir tu archivo HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de prueba para verificar la conexión
app.get('/api/test-db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ message: 'Conexión a la base de datos exitosa' });
  } catch (error) {
    res.status(500).json({ message: 'Error al conectar a la base de datos', error });
  }
});

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});

