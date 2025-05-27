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

router.get("/superadmin", isSuperAdmin, vistaSuperAdmin);

router.post("/superadmin/eliminar-usuario/:id", isSuperAdmin, eliminarUsuario);
router.post("/superadmin/eliminar-evento/:id", isSuperAdmin, eliminarEvento);

router.get(
  "/superadmin/editar-usuario/:id",
  isSuperAdmin,
  mostrarEditarUsuario
);
router.post(
  "/superadmin/editar-usuario/:id",
  isSuperAdmin,
  toLowerCaseMiddleware,
  actualizarUsuario
);

router.post(
  "/superadmin/crear-usuario",
  isSuperAdmin,
  toLowerCaseMiddleware,
  crearUsuario
);

router.get("/superadmin/descargar-reporte", isSuperAdmin, descargarReportePDF);
router.get(
  "/superadmin/descargar-reporte-poza-rica",
  isSuperAdmin,
  descargarReportePozaRica
);
router.get(
  "/superadmin/descargar-reporte-coatzintla",
  isSuperAdmin,
  descargarReporteCoatzintla
);

// NUEVO: Ruta para actualizar evento
router.post("/superadmin/editar-evento/:id", isSuperAdmin, actualizarEvento);

export default router;
