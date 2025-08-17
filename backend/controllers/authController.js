const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Función para generar un token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d', // el token dura 7 días
  });
};

// Registro de usuario
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const newUser = await User.create({ name, email, password });

    // Respuesta con token
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Respuesta con token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

module.exports = {
  registerUser,
  loginUser,
};

// Devuelve los datos del usuario autenticado
const getMe = async (req, res) => {
  return res.status(200).json(req.user);
};

module.exports.getMe = getMe;
