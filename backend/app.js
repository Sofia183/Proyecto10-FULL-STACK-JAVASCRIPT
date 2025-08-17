const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// ✅ Ruta de salud (DEBE IR ANTES de los manejadores de error)
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Manejadores globales de error (al final)
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

module.exports = app;
