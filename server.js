const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const adminRoutes = require('./routes/adminRoutes');
const zooRoutes = require('./routes/ZooRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const animalRoutes = require('./routes/animalRoutes');

const app = express();
const port = 3000;

// Configura CORS para permitir solicitudes desde la app
app.use(cors({
  origin: '*', // Puedes cambiar esto a la URL de tu app en producción
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configura el middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configura las sesiones
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Conecta a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/ZooSmart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false
});

mongoose.connection.on('open', () => {
  console.log('Conectado a la base de datos MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error al conectar a la base de datos MongoDB:', err);
});

// Rutas
app.use('/api/admin', adminRoutes);
app.use('/api/zoo', zooRoutes);
app.use('/api/empleado', empleadoRoutes);
app.use('/api/animal', animalRoutes);

//ruta para obtener los datos del usuario
app.get('/api/user', (req, res) => {
  if (!req.session.user) {
    res.status(401).send('No autorizado');
  } else {
    res.json(req.session.user);
  }
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
