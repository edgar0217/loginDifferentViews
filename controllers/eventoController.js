import { cloudinary } from "../config/cloudinary.js";
import Evento from "../models/eventoModel.js";

export const mostrarEventos = async (req, res) => {
  try {
    const eventos = await Evento.findAll({
      where: { usuarioId: req.session.usuario.id },
      order: [["createdAt", "DESC"]],
    });

    const error = req.session.error || null;
    const success = req.session.success || null;
    req.session.error = null;
    req.session.success = null;

    res.render("eventos", { eventos, error, success });
  } catch (error) {
    console.error(error);
    res.render("eventos", {
      eventos: [],
      error: "Error cargando eventos",
      success: null,
    });
  }
};

export const crearEvento = async (req, res) => {
  try {
    let { titulo, descripcion } = req.body;

    // Convertir a minúsculas antes de guardar
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

export const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await Evento.findOne({
      where: { id, usuarioId: req.session.usuario.id },
    });

    if (!evento) {
      req.session.error = "Evento no encontrado o no autorizado";
      return res.redirect("/eventos");
    }

    if (evento.public_id_imagen) {
      await cloudinary.uploader.destroy(evento.public_id_imagen);
    }

    await evento.destroy();

    req.session.success = "Evento eliminado";
    res.redirect("/eventos");
  } catch (error) {
    console.error(error);
    req.session.error = "Error al eliminar evento";
    res.redirect("/eventos");
  }
};
