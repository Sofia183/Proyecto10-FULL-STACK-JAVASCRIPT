const Event = require('../models/Event');

// Crear un evento (ruta protegida)
const createEvent = async (req, res) => {
  try {
    const { title, date, location, description, poster } = req.body;

    if (!title || !date || !location || !description) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Normalizamos la "fecha del día" para comparar por día (ignorando la hora)
    const d = new Date(date);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

    // Si ya existe un evento con mismo título + ubicación el mismo día → lo consideramos duplicado
    const exists = await Event.findOne({
      title,
      location,
      date: { $gte: start, $lt: end }
    });

    if (exists) {
      return res.status(409).json({ message: 'Ya existe un evento con ese título, fecha y ubicación' });
    }

    const event = await Event.create({
      title,
      date,
      location,
      description,
      poster: poster || null,
      attendees: []
    });

    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear el evento', error });
  }
};


// Listar eventos con orden configurable
const listEvents = async (req, res) => {
  try {
    const { sort } = req.query;

    let sortQuery = { date: 1 };      // por defecto: por fecha ascendente
    if (sort === 'dateDesc') sortQuery = { date: -1 };
    if (sort === 'titleAsc') sortQuery = { title: 1 };
    if (sort === 'titleDesc') sortQuery = { title: -1 };

    const events = await Event.find().sort(sortQuery);
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar eventos', error });
  }
};

// Obtener un evento por id con sus asistentes
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id).populate({
      path: 'attendees',
      select: 'name email'
    });

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el evento', error });
  }
};

// Apuntarse a un evento (inserta userId en attendees)
const attendEvent = async (req, res) => {
  try {
    const { id } = req.params;     // id del evento
    const userId = req.user._id;   // del middleware protect

    const event = await Event.findByIdAndUpdate(
      id,
      { $addToSet: { attendees: userId } }, // evita duplicados
      { new: true }
    ).populate({ path: 'attendees', select: 'name email' });

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Error al apuntarse al evento', error });
  }
};

// Desapuntarse de un evento (elimina userId de attendees)
const unattendEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const event = await Event.findByIdAndUpdate(
      id,
      { $pull: { attendees: userId } },
      { new: true }
    ).populate({ path: 'attendees', select: 'name email' });

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Error al desapuntarse del evento', error });
  }
};

module.exports = {
  createEvent,
  listEvents,
  getEventById,
  attendEvent,
  unattendEvent,
};

// Subir cartel del evento (actualiza campo poster con la ruta del archivo)
const uploadEventPoster = async (req, res) => {
  try {
    const { id } = req.params;

    // multer habrá puesto el archivo en req.file si todo fue bien
    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió ningún archivo' });
    }

    // ruta pública para servir el archivo
    const publicPath = `/uploads/${req.file.filename}`;

    const event = await Event.findByIdAndUpdate(
      id,
      { poster: publicPath },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: 'Error al subir el cartel', error });
  }
};

module.exports.uploadEventPoster = uploadEventPoster;

// Borrar un evento por id (ruta protegida)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    return res.status(200).json({ message: 'Evento eliminado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar el evento', error });
  }
};

module.exports.deleteEvent = deleteEvent;
