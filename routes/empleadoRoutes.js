const express = require('express');
const Empleado = require('../models/Empleado');
const router = express.Router();

// Crear un nuevo empleado
router.post('/', async (req, res) => {
  try {
    const empleado = new Empleado(req.body);
    await empleado.save();
    res.status(201).json(empleado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los empleados
router.get('/', async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
