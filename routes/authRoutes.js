import express from "express";
import {
  registroGet,
  registroPost,
  loginGet,
  loginPost,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/register", registroGet);
router.post("/register", registroPost);

router.get("/login", loginGet);
router.post("/login", loginPost);

router.get("/logout", logout);

export default router;
