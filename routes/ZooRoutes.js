const express = require('express');
const Zoo = require('../models/Zoo');
const router = express.Router();

// Crear un nuevo zoo
router.post('/', async (req, res) => {
  try {
    const zoo = new Zoo(req.body);
    await zoo.save();
    res.status(201).json(zoo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los zoos
router.get('/', async (req, res) => {
  try {
    const zoos = await Zoo.find();
    res.json(zoos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
