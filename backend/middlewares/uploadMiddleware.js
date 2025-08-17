const multer = require('multer');
const path = require('path');

// Configuración de destino y nombre del archivo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // carpeta donde guardamos los archivos
  },
  filename: function (req, file, cb) {
    // nombre único: campo-fecha.extensión
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${base}_${Date.now()}${ext}`);
  },
});

// Filtro para permitir solo imágenes
function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato no permitido. Usa JPG, PNG, WEBP o GIF.'));
  }
}

// Límite de tamaño: 5MB
const limits = { fileSize: 5 * 1024 * 1024 };

const upload = multer({ storage, fileFilter, limits });

module.exports = { upload };
