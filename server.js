const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const Admin = require('./models/Admin');
const Zoo = require('./models/Zoo');

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

// Define la ruta para crear una cuenta
app.post('/api/create-account', async (req, res) => {
  try {
    const { name, email, password, nameZoo, country, state, city, address, isMobileApp } = req.body;

    const lastAdmin = await Admin.findOne().sort({ id: -1 });
    const newAdminId = lastAdmin ? lastAdmin.id + 1 : 1;

    const newAdmin = new Admin({
      id: newAdminId,
      nombre: name,
      email: email,
      contraseña: password,
      nombre_zoo: nameZoo
    });

    await newAdmin.save();

    const newZoo = new Zoo({
      id: newAdminId,
      nombre: nameZoo,
      pais: country,
      estado: state,
      ciudad: city,
      direccion: address,
      admin_id: newAdminId,
      especies: [],
      zonas: []
    });

    await newZoo.save();

    // Guarda toda la información del usuario en la sesión
    req.session.user = { 
      id: newAdminId,
      name: name,
      email: email,
      nameZoo: nameZoo,
      country: country,
      state: state,
      city: city,
      address: address
    };

    if (isMobileApp) {
      // Responde con los datos del usuario (para la app)
      res.status(201).json({ message: 'Cuenta creada exitosamente', user: req.session.user });
    } else {
      // Redirige al usuario (para la web)
      res.redirect('/home.html');
    }
  } catch (error) {
    console.error('Error al crear la cuenta:', error);
    res.status(500).send('Error al crear la cuenta');
  }
});

// Define la ruta para iniciar sesión
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, isMobileApp } = req.body;
    const admin = await Admin.findOne({ email: email, contraseña: password });

    if (admin) {
      // Guarda toda la información del usuario en la sesión
      const zoo = await Zoo.findOne({ admin_id: admin.id });

      req.session.user = {
        id: admin.id,
        name: admin.nombre,
        email: admin.email,
        nameZoo: zoo.nombre,
        country: zoo.pais,
        state: zoo.estado,
        city: zoo.ciudad,
        address: zoo.direccion
      };

      if (isMobileApp) {
        // Responde con los datos del usuario (para la app)
        res.status(200).json({ message: 'Inicio de sesión exitoso', user: req.session.user });
      } else {
        // Redirige al usuario (para la web)
        res.redirect('/home.html');
      }
    } else {
      res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send('Error al iniciar sesión');
  }
});

// Define una ruta para obtener los datos del usuario
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
