import Evento from "../models/eventoModel.js";

export const mostrarEventos = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;

    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    // Contar total de eventos
    const totalEventos = await Evento.count({ where: { usuarioId } });
    const totalPages = Math.max(1, Math.ceil(totalEventos / limit));

    // Validar página para que esté entre 1 y totalPages
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const offset = (safePage - 1) * limit;

    // Obtener eventos paginados
    const eventos = await Evento.findAll({
      where: { usuarioId },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const error = req.session.error || null;
    const success = req.session.success || null;
    req.session.error = null;
    req.session.success = null;

    res.render("eventos", {
      eventos,
      error,
      success,
      currentPage: safePage,
      totalPages,
      usuario: req.session.usuario, // Asegúrate de pasar usuario para la vista
    });
  } catch (error) {
    console.error(error);
    res.render("eventos", {
      eventos: [],
      error: "Error cargando eventos",
      success: null,
      currentPage: 1,
      totalPages: 0,
      usuario: req.session.usuario,
    });
  }
};

export const crearEvento = async (req, res) => {
  try {
    let { titulo, descripcion } = req.body;

    titulo = titulo.toLowerCase();
    descripcion = descripcion.toLowerCase();

    let url_imagen = null;
    let public_id_imagen = null;

    if (req.file) {
      url_imagen = req.file.path;
      public_id_imagen = req.file.filename;
    }

    await Evento.create({
      titulo,
      descripcion,
      url_imagen,
      public_id_imagen,
      usuarioId: req.session.usuario.id,
    });

    req.session.success = "Evento creado con éxito";
    res.redirect("/eventos");
  } catch (error) {
    console.error(error);
    req.session.error = "Error creando evento";
    res.redirect("/eventos");
  }
};
