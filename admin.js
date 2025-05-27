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
    const admin = await Usuario.findOne({ where: { usuario: "superadmin" } });

    if (!admin) {
      await Usuario.create({
        nombre: "EZEQUIEL",
        usuario: "ezequiel0217",
        direccion: "Calle Falsa 123", // Agrega dirección real si es necesario
        municipio: "Tuxpan",
        seccion_electoral: "1020",
        celular: "7821356726",
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
