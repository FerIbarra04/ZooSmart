const mongoose = require('mongoose');

const EmpleadoSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  admin_id: { type: Number, required: true },
  nombre: { type: String, required: true },
  nombre_zoo: { type: String, required: true },
  zona: { type: String, required: true },
  email: { type: String, required: true },
  contraseña: { type: String, required: true },
  fecha_nacimiento: { type: Date, required: true },
  fecha_agregado: { type: Date, required: true },
});

const Empleado = mongoose.model('Empleado', EmpleadoSchema);
module.exports = Empleado;
