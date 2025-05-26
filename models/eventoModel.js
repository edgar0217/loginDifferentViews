import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Usuario from "../models/userModel.js";

// Definición del modelo Evento
const Evento = db.define("Evento", {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  url_imagen: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  public_id_imagen: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Asociaciones
Usuario.hasMany(Evento, {
  foreignKey: "usuarioId",
});
Evento.belongsTo(Usuario, {
  foreignKey: "usuarioId",
});

export default Evento;
