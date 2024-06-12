const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  info_adicional: { type: String },
  fecha_nacimiento: { type: Date, required: true },
  edad: { type: Number, required: true },
  dieta: { type: String, required: true },
  fecha_arrivo: { type: Date, required: true },
  zoo_id: { type: Number, required: true, ref: 'Zoo' },
  zona: { type: String, required: true },
}, {
  collection: 'Animals' // Nombre de la colección en MongoDB
});

module.exports = mongoose.model('Animals', AnimalSchema);
