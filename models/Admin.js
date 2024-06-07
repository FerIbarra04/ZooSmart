const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  contraseña: { type: String, required: true },
  nombre_zoo: { type: String, required: true },
});

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
