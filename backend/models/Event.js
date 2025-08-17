const mongoose = require('mongoose');

// Esquema del Evento
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // obligatorio
  },
  date: {
    type: Date,
    required: true, // obligatorio
  },
  location: {
    type: String,
    required: true, // obligatorio
  },
  description: {
    type: String,
    required: true, // obligatorio
  },
  poster: {
    type: String, // será la ruta o URL de la imagen
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // hace referencia al modelo "User"
  }]
}, {
  timestamps: true // agrega createdAt y updatedAt
});

// Exportamos el modelo
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
