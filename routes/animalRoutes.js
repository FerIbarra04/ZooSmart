const express = require('express');
const Animal = require('../models/Animal');
const router = express.Router();
const Zoo = require('../models/Zoo');

// Crear un nuevo animal
router.post('/create-animal', async (req, res) => {
  try {
    // Verificar que el usuario esté autenticado
    if (!req.session.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const { nombre, descripcion, dieta, info_adicional, fecha_nacimiento, fecha_arrivo, zona } = req.body;
    const zoo_name = req.session.user.zoo_name;

    const zoo = await Zoo.findOne({ nombre: zoo_name });
    if (!zoo) {
      return res.status(400).json({ error: 'Zoo no encontrado' });
    }

    const edadDetallada = calcularEdadDetallada(new Date(fecha_nacimiento));

    const lastAnimal = await Animal.findOne().sort({ id: -1 });
    const newAnimalId = lastAnimal ? lastAnimal.id + 1 : 1;

    const newAnimal = new Animal({
      id: newAnimalId,
      nombre,
      descripcion,
      dieta,
      info_adicional,
      fecha_nacimiento: new Date(fecha_nacimiento),
      edad: edadDetallada,
      fecha_arrivo: new Date(fecha_arrivo),
      zoo_name: zoo.nombre,
      zona
    });

    await newAnimal.save();

    // Redirigir a la página de la zona correspondiente
    res.status(201).json({ url: `${zona}Zone.html`, animal: newAnimal });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener animales por zoológico
router.get('/byZoo', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('No autorizado');
  }
  
  const zooName = req.session.user.zoo_name;
  
  try {
    const animals = await Animal.find({ zoo_name: zooName });
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener animales', error });
  }
});

// Obtener un animal por ID
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      return res.status(404).json({ message: 'Animal no encontrado' });
    }
    res.json(animal);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el animal', error });
  }
});

// Obtener un animal por ID
router.get('/animal/:id', async (req, res) => {
  try {
    const animal = await Animal.findOne({ id: req.params.id }); // Ajuste de findById a findOne con id
    if (!animal) {
      return res.status(404).json({ message: 'Animal no encontrado' });
    }
    res.json(animal);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el animal', error });
  }
});

// Actualizar información del animal
router.put('/:id', async (req, res) => {
  try {
    const { dieta, info_adicional } = req.body;
    const animalId = req.params.id;

    // Obtener el animal actual
    const animal = await Animal.findById(animalId);
    if (!animal) {
      return res.status(404).json({ message: 'Animal no encontrado' });
    }

    // Calcular la edad actualizada
    const birthdate = new Date(animal.fecha_nacimiento);
    const today = new Date();
    const years = today.getFullYear() - birthdate.getFullYear() - (today.getMonth() < birthdate.getMonth() || (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate()) ? 1 : 0);
    const months = (today.getMonth() + 12 - birthdate.getMonth()) % 12;
    const days = Math.max(today.getDate() - birthdate.getDate(), 0);

    // Actualizar los datos del animal, incluyendo la edad
    animal.dieta = dieta || animal.dieta;
    animal.info_adicional = info_adicional || animal.info_adicional;
    animal.edad = { años: years, meses: months, dias: days };

    // Guardar los cambios en la base de datos
    await animal.save();

    // Responder con el animal actualizado
    res.json(animal);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la información del animal', error });
  }
});


// Eliminar animal
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Animal.findByIdAndDelete(id);
    res.status(200).send('Animal eliminado correctamente');
  } catch (error) {
    res.status(500).send('Error al eliminar el animal');
  }
});

// Función para calcular la edad detallada
const calcularEdadDetallada = (fechaNacimiento) => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  let años = hoy.getFullYear() - nacimiento.getFullYear();
  let meses = hoy.getMonth() - nacimiento.getMonth();
  let dias = hoy.getDate() - nacimiento.getDate();

  if (dias < 0) {
    meses--;
    dias += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate(); // Último día del mes anterior
  }

  if (meses < 0) {
    años--;
    meses += 12;
  }

  return { años, meses, dias };
};

module.exports = router;
