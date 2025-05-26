import Evento from "../models/eventoModel.js";
import Usuario from "../models/userModel.js";

export const listaEventosAdmin = async (req, res) => {
  try {
    const eventos = await Evento.findAll({
      include: {
        model: Usuario,
        attributes: ["nombre", "apellidos", "matricula"],
      },
      order: [["createdAt", "DESC"]],
    });

    const alumnos = await Usuario.findAll({
      where: { rol: "alumno" },
      attributes: [
        "id",
        "nombre",
        "apellidos",
        "telefono",
        "correo_institucional",
        "matricula",
      ],
      order: [["nombre", "ASC"]],
    });

    res.render("admineventos", { eventos, alumnos });
  } catch (error) {
    console.error("Error cargando datos admin:", error);
    res.status(500).send("Error al cargar datos");
  }
};

export const eventosPorAlumno = async (req, res) => {
  try {
    const alumnoId = req.params.id;

    const eventos = await Evento.findAll({
      where: { usuarioId: alumnoId },
      attributes: ["id", "titulo"],
      order: [["createdAt", "DESC"]],
    });

    res.json(eventos);
  } catch (error) {
    console.error("Error al obtener eventos del alumno:", error);
    res.status(500).json({ error: "Error al obtener eventos del alumno" });
  }
};
