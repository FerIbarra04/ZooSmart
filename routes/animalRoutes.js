const express = require('express');
const Animal = require('../models/Animal');
const Zoo = require('../models/Zoo');
const router = express.Router();

// Crear un nuevo animal
router.post('/create-animal', async (req, res) => {
  try {
    const { nombre, descripcion, dieta, fecha_nacimiento, edad, fecha_arrivo, zona } = req.body;

    // Obtener el ID del zoológico del usuario actual
    const zooId = req.session.user.zoo_id; // Ajustar según la lógica de tu aplicación

    // Crear una nueva instancia de Animal
    const animal = new Animal({
      nombre,
      descripcion,
      dieta,
      fecha_nacimiento,
      edad,
      fecha_arrivo,
      zoo_id: zooId, // Asignar el ID del zoológico al que pertenece este animal
      zona,
    });

    // Guardar el animal en la base de datos
    await animal.save();

    // Agregar el ID del nuevo animal al zoológico correspondiente
    const updatedZoo = await Zoo.findByIdAndUpdate(
      zooId,
      { $addToSet: { especies: animal._id } },
      { new: true }
    );

    res.status(201).json(animal); // Responder con el animal creado en formato JSON
  } catch (error) {
    res.status(400).json({ error: error.message }); // Manejar errores de manera adecuada
  }
});

module.exports = router;
