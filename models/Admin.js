const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  nombre_zoo: { type: String }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
