import express from "express";
import {
  listaEventosAdmin,
  eventosPorAlumno,
  descargarReportePDFAdmin,
} from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/admin/eventos", isAdmin, listaEventosAdmin);
router.get("/admin/alumno/:id/eventos", isAdmin, eventosPorAlumno);
router.get("/admin/descargar-reporte", isAdmin, descargarReportePDFAdmin);

export default router;
