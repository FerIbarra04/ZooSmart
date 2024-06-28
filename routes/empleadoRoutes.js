const express = require('express');
const router = express.Router();
const Empleado = require('../models/Empleado');
const Admin = require('../models/Admin');

// Ruta para crear un empleado
router.post('/create-employee', async (req, res) => {
  try {
    const { name, birthdate, email, password, zone, dateAdded } = req.body;
    const adminId = req.session.user.id;
    const nameZoo = req.session.user.nameZoo;

    // Generar un nuevo ID para el empleado
    const lastEmpleado = await Empleado.findOne().sort({ id: -1 });
    const newEmpleadoId = lastEmpleado ? lastEmpleado.id + 1 : 1;

    // Crear el nuevo empleado en la base de datos
    const newEmpleado = new Empleado({
      id: newEmpleadoId,
      admin_id: adminId,
      nombre: name,
      nombre_zoo: nameZoo,
      zona: zone,
      email: email,
      contraseña: password,
      fecha_nacimiento: birthdate,
      fecha_agregado: dateAdded
    });

    await newEmpleado.save();

    // Enviar respuesta al cliente
    res.status(201).json({ message: 'Empleado creado exitosamente', empleado: newEmpleado });

  } catch (error) {
    res.status(500).json({ message: 'Error al crear empleado', error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar empleado por email y contraseña
    const empleado = await Empleado.findOne({ email: email, contraseña: password });

    if (empleado) {
      // Establecer la sesión del empleado
      req.session.employee = {
        id: empleado.id,
        name: empleado.nombre,
        email: empleado.email,
        nameZoo: empleado.nombre_zoo,
        zone: empleado.zona,
        birthdate: empleado.fecha_nacimiento,
        dateAdded: empleado.fecha_agregado,
        role: 'empleado'
      };

      // Enviar respuesta de éxito al cliente
      res.status(200).json({ message: 'Inicio de sesión exitoso', user: req.session.employee });
    } else {
      // Enviar respuesta si las credenciales son incorrectas
      res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

  } catch (error) {
    // Manejar errores internos del servidor
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
});

// Ruta para obtener los datos del empleado actual
router.get('/current-employee', (req, res) => {
  if (!req.session.employee) {
    res.status(401).json({ message: 'No autorizado' });
  } else {
    res.json(req.session.employee);
  }
});

module.exports = router;
