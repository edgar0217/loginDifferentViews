import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import db from "./config/db.js";
import Usuario from "./models/userModel.js";

(async () => {
  try {
    await db.authenticate();
    await db.sync();

    const saltRounds = 10;

    // Crear admin
    const adminPassword = await bcrypt.hash("123", saltRounds);
    const admin = await Usuario.findOne({ where: { matricula: "echino0217" } });
    if (!admin) {
      await Usuario.create({
        nombre: "EDGAR ",
        apellidos: "GARCÍA",
        telefono: "7821356726",
        correo_institucional: "admin@itspr.edu.mx",
        matricula: "echino0217",
        password: adminPassword,
        rol: "superadmin",
      });
      console.log("Usuario admin creado");
    } else {
      console.log("El usuario admin ya existe");
    }

    process.exit();
  } catch (error) {
    console.error("Error creando usuario admin:", error);
    process.exit(1);
  }
})();
