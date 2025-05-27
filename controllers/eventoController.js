import Evento from "../models/eventoModel.js";

export const mostrarEventos = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const totalEventos = await Evento.count({ where: { usuarioId } });
    const totalPages = Math.max(1, Math.ceil(totalEventos / limit));

    const safePage = Math.min(Math.max(page, 1), totalPages);
    const offset = (safePage - 1) * limit;

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
      usuario: req.session.usuario,
      currentPage: safePage,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.render("eventos", {
      eventos: [],
      error: "Error cargando eventos",
      success: null,
      usuario: req.session.usuario,
      currentPage: 1,
      totalPages: 0,
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
