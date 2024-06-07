const express = require('express');
const Animal = require('../models/Animal');
const router = express.Router();

// Crear un nuevo animal
router.post('/', async (req, res) => {
  try {
    const animal = new Animal(req.body);
    await animal.save();
    res.status(201).json(animal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los animales
router.get('/', async (req, res) => {
  try {
    const animales = await Animal.find();
    res.json(animales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
