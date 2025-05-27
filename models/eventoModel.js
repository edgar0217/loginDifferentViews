import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Usuario from "./userModel.js";

const Evento = db.define("evento", {
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

Usuario.hasMany(Evento, { foreignKey: "usuarioId" });
Evento.belongsTo(Usuario, { foreignKey: "usuarioId" });

export default Evento;
