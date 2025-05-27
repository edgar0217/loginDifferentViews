import Evento from "../models/eventoModel.js";
import Usuario from "../models/userModel.js";
import { generateReportePDF } from "../utils/pdfGenerator.js";

export const listaEventosAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count: eventosCount, rows: eventos } = await Evento.findAndCountAll(
      {
        include: {
          model: Usuario,
          attributes: ["nombre", "apellidos", "matricula"],
        },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      }
    );

    const totalPages = Math.ceil(eventosCount / limit);

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

    const contadorVisitas = 0; // o la lógica que tengas

    res.render("admineventos", {
      eventos,
      alumnos,
      eventosCount,
      totalPages,
      currentPage: page,
      contadorVisitas,
    });
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

export const descargarReportePDFAdmin = async (req, res) => {
  try {
    const alumnos = await Usuario.findAll({
      where: { rol: "alumno" },
      attributes: [
        "id",
        "nombre",
        "apellidos",
        "matricula",
        "telefono",
        "correo_institucional",
        "createdAt",
      ],
    });

    const eventos = await Evento.findAll({ include: Usuario });

    await generateReportePDF(res, alumnos, eventos, {
      titulo: "Reporte de Alumnos y Eventos",
      tituloColor: "#047857",
      encabezadoColor: "#059669",
      filename: "reporte_admin.pdf",
    });
  } catch (error) {
    console.error("Error generando reporte PDF:", error);
    res.status(500).send("Error generando el reporte PDF");
  }
};
