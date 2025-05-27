import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Usuario = db.define("usuario", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  municipio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  seccion_electoral: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  celular: {
    type: DataTypes.STRING,
    allowNull: false,
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
