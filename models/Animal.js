const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  info_adicional: { type: String },
  fecha_nacimiento: { type: Date, required: true },
  edad: { type: Number, required: true },
  dieta: { type: String, required: true },
  fecha_arrivo: { type: Date, required: true },
  zoo_id: { type: Number, required: true },
  zona: { type: String, required: true },
});

const Animal = mongoose.model('Animal', AnimalSchema);
module.exports = Animal;
