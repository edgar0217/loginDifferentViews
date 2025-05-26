import express from "express";
import {
  vistaSuperAdmin,
  eliminarUsuario,
  eliminarEvento,
  actualizarUsuario,
  mostrarEditarUsuario,
  crearUsuario,
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

export default router;
