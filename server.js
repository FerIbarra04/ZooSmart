const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const Admin = require('./models/Admin');
const Zoo = require('./models/Zoo');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/create-account', async (req, res) => {
  try {
    const { name, email, password, nameZoo, country, state, city, address } = req.body;

    const newAdmin = new Admin({
      nombre: name,
      email: email,
      contraseña: password,
      nombre_zoo: nameZoo
    });

    await newAdmin.save();

    const newZoo = new Zoo({
      nombre: nameZoo,
      pais: country,
      estado: state,
      ciudad: city,
      direccion: address
    });

    await newZoo.save();

    res.status(201).json({ message: 'Cuenta creada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la cuenta', error });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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
