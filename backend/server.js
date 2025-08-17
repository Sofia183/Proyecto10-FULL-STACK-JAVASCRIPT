const mongoose = require('mongoose');
const app = require('./app');
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Conexión a MongoDB y arranque del servidor
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar a MongoDB:', error);
  });
