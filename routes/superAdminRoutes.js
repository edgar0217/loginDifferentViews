import express from "express";
import {
  vistaSuperAdmin,
  eliminarUsuario,
  eliminarEvento,
  actualizarUsuario,
  mostrarEditarUsuario,
  crearUsuario,
  descargarReportePDF,
  descargarReportePozaRica,
  descargarReporteCoatzintla,
  actualizarEvento,
} from "../controllers/superAdminController.js";
import { isSuperAdmin } from "../middlewares/auth.js";
import { toLowerCaseMiddleware } from "../middlewares/toLowerCaseMiddleware.js";

const router = express.Router();

router.get("/superAdmin", isSuperAdmin, vistaSuperAdmin);

router.post("/superAdmin/eliminar-usuario/:id", isSuperAdmin, eliminarUsuario);
router.post("/superAdmin/eliminar-evento/:id", isSuperAdmin, eliminarEvento);

router.get(
  "/superAdmin/editar-usuario/:id",
  isSuperAdmin,
  mostrarEditarUsuario
);
router.post(
  "/superAdmin/editar-usuario/:id",
  isSuperAdmin,
  toLowerCaseMiddleware,
  actualizarUsuario
);

router.post(
  "/superAdmin/crear-usuario",
  isSuperAdmin,
  toLowerCaseMiddleware,
  crearUsuario
);

router.get("/superAdmin/descargar-reporte", isSuperAdmin, descargarReportePDF);
router.get(
  "/superAdmin/descargar-reporte-poza-rica",
  isSuperAdmin,
  descargarReportePozaRica
);
router.get(
  "/superAdmin/descargar-reporte-coatzintla",
  isSuperAdmin,
  descargarReporteCoatzintla
);

// NUEVO: Ruta para actualizar evento
router.post("/superAdmin/editar-evento/:id", isSuperAdmin, actualizarEvento);

export default router;
