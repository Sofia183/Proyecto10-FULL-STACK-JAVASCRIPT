const { protect } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');

// Ruta para registro
router.post('/register', registerUser);

// Ruta para login
router.post('/login', loginUser);

module.exports = router;

router.get('/me', protect, getMe);
