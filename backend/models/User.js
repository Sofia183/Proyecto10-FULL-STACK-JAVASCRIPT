const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Esquema del Usuario
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // el nombre es obligatorio
  },
  email: {
    type: String,
    required: true, // el email es obligatorio
    unique: true,   // no puede repetirse
  },
  password: {
    type: String,
    required: true, // la contraseña es obligatoria
  },
}, {
  timestamps: true // agrega createdAt y updatedAt automáticamente
});

// Middleware: antes de guardar un usuario, encriptamos su contraseña
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // si la contraseña no fue modificada, seguimos
  }
  const salt = await bcrypt.genSalt(10); // genera una "sal" para encriptar
  this.password = await bcrypt.hash(this.password, salt); // encripta la contraseña
  next();
});

// Método para comparar contraseñas (cuando el usuario hace login)
userSchema.methods.matchPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

// Exportamos el modelo
const User = mongoose.model('User', userSchema);
module.exports = User;
