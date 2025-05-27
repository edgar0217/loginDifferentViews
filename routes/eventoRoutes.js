import express from "express";
import upload from "../middlewares/upload.js";
import {
  mostrarEventos,
  crearEvento,
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

export default router;
