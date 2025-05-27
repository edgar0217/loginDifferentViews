import express from "express";
import {
  listaEventosAdmin,
  eventosPorAlumno,
  descargarReportePDFAdmin,
  descargarReportePozaRica, // <-- Importa estas dos nuevas
  descargarReporteCoatzintla, // <--
} from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/admin/eventos", isAdmin, listaEventosAdmin);
router.get("/admin/alumno/:id/eventos", isAdmin, eventosPorAlumno);
router.get("/admin/descargar-reporte", isAdmin, descargarReportePDFAdmin);

// Nuevas rutas para reportes filtrados
router.get(
  "/admin/descargar-reporte-poza-rica",
  isAdmin,
  descargarReportePozaRica
);
router.get(
  "/admin/descargar-reporte-coatzintla",
  isAdmin,
  descargarReporteCoatzintla
);

export default router;
