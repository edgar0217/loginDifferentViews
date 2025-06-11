// models/imagenDestacada.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ImagenDestacada = db.define("imagen_destacada", {
  orden: {
    type: DataTypes.INTEGER, // 1 (izquierda) o 2 (derecha)
    allowNull: false,
    unique: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  public_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creado_por: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

export default ImagenDestacada;
