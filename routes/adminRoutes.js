const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

router.post('/create-admin', async (req, res) => {
  try {
    const lastAdmin = await Admin.findOne().sort({ id: -1 });
    const newId = lastAdmin ? lastAdmin.id + 1 : 1;

    const newAdmin = new Admin({
      id: newId,
      nombre: req.body.name,
      email: req.body.email,
      contraseña: req.body.password
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear admin', error });
  }
});

module.exports = router;
