// routes/imagenesDestacadasRoutes.js
import express from "express";
import upload from "../middlewares/upload.js";
import {
  mostrarImagenesDestacadas,
  subirImagenDestacada,
  borrarImagenDestacada,
} from "../controllers/imagenesDestacadasController.js";

const router = express.Router();

// Obtener imágenes (todos pueden ver)
router.get("/imagenes-destacadas", mostrarImagenesDestacadas);

// Subir imagen (solo admin/superadmin)
router.post(
  "/imagenes-destacadas",
  (req, res, next) => {
    if (
      req.session.usuario &&
      (req.session.usuario.rol === "admin" ||
        req.session.usuario.rol === "superadmin")
    )
      return next();
    return res.status(403).json({ error: "No autorizado" });
  },
  upload.single("imagen"),
  subirImagenDestacada
);

// Borrar imagen (solo admin/superadmin)
router.delete(
  "/imagenes-destacadas/:orden",
  (req, res, next) => {
    if (
      req.session.usuario &&
      (req.session.usuario.rol === "admin" ||
        req.session.usuario.rol === "superadmin")
    )
      return next();
    return res.status(403).json({ error: "No autorizado" });
  },
  borrarImagenDestacada
);

export default router;
