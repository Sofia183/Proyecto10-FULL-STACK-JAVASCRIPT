// 404: la ruta no existe
const notFound = (req, res, next) => {
  return res.status(404).json({ message: 'Ruta no encontrada' });
};

// Errores no controlados
const errorHandler = (err, req, res, next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(status).json({
    message: err?.message || 'Error del servidor',
  });
};

module.exports = { notFound, errorHandler };
