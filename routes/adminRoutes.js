const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password, isMobileApp } = req.body;
    
    const lastAdmin = await Admin.findOne().sort({ id: -1 });
    const newId = lastAdmin ? lastAdmin.id + 1 : 1;

    const newAdmin = new Admin({
      id: newId,
      nombre: name,
      email: email,
      contraseña: password
    });

    await newAdmin.save();

    if (isMobileApp) {
      // Responde con los datos del administrador (para la app)
      res.status(201).json({ message: 'Admin creado exitosamente', admin: newAdmin });
    } else {
      // Redirige al usuario (para la web)
      res.redirect('/some-web-page.html'); // Cambia esta ruta según tus necesidades
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al crear admin', error });
  }
});

module.exports = router;

