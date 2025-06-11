// controllers/imagenesDestacadasController.js
import ImagenDestacada from "../models/imagenDestacada.js";
import { cloudinary } from "../config/cloudinary.js";

export const mostrarImagenesDestacadas = async (req, res) => {
  const imagenes = await ImagenDestacada.findAll({ order: [["orden", "ASC"]] });
  res.json(imagenes);
};

export const subirImagenDestacada = async (req, res) => {
  try {
    const orden = parseInt(req.body.orden);
    if (!req.file) return res.status(400).json({ error: "No hay archivo" });

    // Borra la imagen anterior si existe
    const anterior = await ImagenDestacada.findOne({ where: { orden } });
    if (anterior) {
      await cloudinary.uploader.destroy(anterior.public_id);
      await anterior.destroy();
    }

    const nueva = await ImagenDestacada.create({
      orden,
      url: req.file.path,
      public_id: req.file.filename,
      creado_por: req.session.usuario.id,
    });

    res.json(nueva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al subir imagen" });
  }
};

export const borrarImagenDestacada = async (req, res) => {
  try {
    const { orden } = req.params;
    const imagen = await ImagenDestacada.findOne({ where: { orden } });
    if (!imagen) return res.status(404).json({ error: "No existe imagen" });

    await cloudinary.uploader.destroy(imagen.public_id);
    await imagen.destroy();
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al borrar imagen" });
  }
};
