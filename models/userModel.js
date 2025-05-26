import { DataTypes } from "sequelize";
import db from "../config/db.js";

// Definición del modelo Usuario
const Usuario = db.define("usuario", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo_institucional: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { isEmail: true },
  },
  matricula: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM("alumno", "admin", "superadmin"),
    allowNull: false,
    defaultValue: "alumno",
  },
});

export default Usuario;
