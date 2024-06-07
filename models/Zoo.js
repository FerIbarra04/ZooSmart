const mongoose = require('mongoose');

const ZooSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  ciudad: { type: String, required: true },
  pais: { type: String, required: true },
  direccion: { type: String, required: true },
  especies: { type: [Number], required: true },
});

const Zoo = mongoose.model('Zoo', ZooSchema);
module.exports = Zoo;
