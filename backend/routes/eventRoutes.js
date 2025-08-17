const { upload } = require('../middlewares/uploadMiddleware');
const express = require('express');
const router = express.Router();
const {
  createEvent,
  listEvents,
  getEventById,
  attendEvent,
  unattendEvent,
  deleteEvent,
} = require('../controllers/eventController');

const { protect } = require('../middlewares/authMiddleware');
const { uploadEventPoster } = require('../controllers/eventController');
router.post('/:id/poster', protect, upload.single('poster'), uploadEventPoster);
router.delete('/:id', protect, deleteEvent);


// Listar eventos (público)
router.get('/', listEvents);

// Detalle de un evento (público)
router.get('/:id', getEventById);

// Crear evento (protegido)
router.post('/', protect, createEvent);

// Apuntarse (protegido)
router.post('/:id/attend', protect, attendEvent);

// Desapuntarse (protegido)
router.delete('/:id/attend', protect, unattendEvent);

module.exports = router;
