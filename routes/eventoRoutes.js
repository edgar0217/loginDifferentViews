import express from "express";
import upload from "../middlewares/upload.js";
import {
  mostrarEventos,
  crearEvento,
  eliminarEvento,
} from "../controllers/eventoController.js";
import methodOverride from "method-override";
import { toLowerCaseMiddleware } from "../middlewares/toLowerCaseMiddleware.js";

const router = express.Router();

router.use(methodOverride("_method"));

router.get("/eventos", mostrarEventos);
router.post(
  "/eventos/nuevo",
  upload.single("imagen"),
  toLowerCaseMiddleware,
  crearEvento
);
router.delete("/eventos/:id", eliminarEvento);

export default router;
