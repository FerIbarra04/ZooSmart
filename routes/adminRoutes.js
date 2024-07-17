const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Zoo = require('../models/Zoo');

// Crear cuenta de admin
router.post('/create-account', async (req, res) => {
  try {
    const { name, email, password, nameZoo, country, state, city, address, isMobileApp } = req.body;

    const lastAdmin = await Admin.findOne().sort({ id: -1 });
    const newAdminId = lastAdmin ? lastAdmin.id + 1 : 1;

    // Crear nuevo administrador
    const newAdmin = new Admin({
      id: newAdminId,
      nombre: name,
      email: email,
      contraseña: password,
      nombre_zoo: nameZoo,
    });

    await newAdmin.save();

    // Crear nuevo zoológico
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

    req.session.user = {
      id: newAdminId,
      zoo_name: nameZoo,
      name: name,
      email: email,
      country: country,
      state: state,
      city: city,
      address: address
    };

    if (isMobileApp) {
      res.status(201).json({ message: 'Cuenta creada exitosamente', user: req.session.user });
    } else {
      res.redirect('/home.html');
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al crear admin', error });
  }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password, isMobileApp } = req.body;
    const admin = await Admin.findOne({ email: email, contraseña: password });

    if (admin) {
      const zoo = await Zoo.findOne({ admin_id: admin.id });

      req.session.user = {
        id: admin.id,
        zoo_name: zoo.nombre,
        name: admin.nombre,
        email: admin.email,
        country: zoo.pais,
        state: zoo.estado,
        city: zoo.ciudad,
        address: zoo.direccion
      };

      if (isMobileApp) {
        res.status(200).json({ message: 'Inicio de sesión exitoso', user: req.session.user });
      } else {
        res.redirect('/home.html');
      }
    } else {
      res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
});

module.exports = router;
