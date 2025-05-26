import express from "express";
import {
  listaEventosAdmin,
  eventosPorAlumno,
} from "../controllers/adminController.js";
import { isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/admin/eventos", isAdmin, listaEventosAdmin);
router.get("/admin/alumno/:id/eventos", isAdmin, eventosPorAlumno);

export default router;
