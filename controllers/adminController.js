import Evento from "../models/eventoModel.js";
import Usuario from "../models/userModel.js";
import { generateReportePDF } from "../utils/pdfGenerator.js";
import { Op } from "sequelize";

export const listaEventosAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count: eventosCount, rows: eventos } = await Evento.findAndCountAll(
      {
        include: {
          model: Usuario,
          attributes: [
            "nombre",
            "usuario",
            "direccion",
            "municipio",
            "celular",
          ],
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
        "usuario",
        "direccion",
        "municipio",
        "celular",
        "seccion_electoral",
      ],
      order: [["nombre", "ASC"]],
    });

    const contadorVisitas = 0;

    res.render("adminEventos", {
      // Aquí corregido el nombre con mayúscula E
      eventos,
      alumnos,
      eventosCount,
      totalPages,
      currentPage: page,
      contadorVisitas,
      usuario: req.session.usuario,
      error: req.session.error || null,
      success: req.session.success || null,
    });

    req.session.error = null;
    req.session.success = null;
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
      attributes: ["id", "titulo", "descripcion"],
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
        "usuario",
        "direccion",
        "municipio",
        "seccion_electoral",
        "celular",
        "createdAt",
      ],
    });

    const eventos = await Evento.findAll({ include: Usuario });

    const totalAlumnos = await Usuario.count({ where: { rol: "alumno" } });
    const totalEventos = await Evento.count();

    await generateReportePDF(
      res,
      alumnos,
      eventos,
      {
        titulo: "Reporte de Alumnos y Eventos",
        tituloColor: "#047857",
        encabezadoColor: "#059669",
        filename: "reporte_admin.pdf",
      },
      {
        totalAlumnos,
        totalEventos,
      }
    );
  } catch (error) {
    console.error("Error generando reporte PDF:", error);
    res.status(500).send("Error generando el reporte PDF");
  }
};

export const descargarReportePozaRica = async (req, res) => {
  try {
    const alumnos = await Usuario.findAll({
      where: { rol: "alumno" },
      attributes: [
        "id",
        "nombre",
        "usuario",
        "direccion",
        "municipio",
        "seccion_electoral",
        "celular",
        "createdAt",
      ],
    });

    const eventos = await Evento.findAll({
      include: Usuario,
      where: {
        descripcion: {
          [Op.iLike]: "%poza rica%",
        },
      },
    });

    const totalAlumnos = await Usuario.count({ where: { rol: "alumno" } });
    const totalEventos = await Evento.count({
      where: { descripcion: { [Op.iLike]: "%poza rica%" } },
    });

    await generateReportePDF(
      res,
      alumnos,
      eventos,
      {
        titulo: "Reporte Poza Rica - Alumnos y Eventos",
        tituloColor: "#1D4ED8",
        encabezadoColor: "#2563EB",
        filename: "reporte_poza_rica.pdf",
      },
      {
        totalAlumnos,
        totalEventos,
      }
    );
  } catch (error) {
    console.error("Error generando reporte Poza Rica:", error);
    res.status(500).send("Error generando el reporte Poza Rica");
  }
};

export const descargarReporteCoatzintla = async (req, res) => {
  try {
    const alumnos = await Usuario.findAll({
      where: { rol: "alumno" },
      attributes: [
        "id",
        "nombre",
        "usuario",
        "direccion",
        "municipio",
        "seccion_electoral",
        "celular",
        "createdAt",
      ],
    });

    const eventos = await Evento.findAll({
      include: Usuario,
      where: {
        descripcion: {
          [Op.iLike]: "%coatzintla%",
        },
      },
    });

    const totalAlumnos = await Usuario.count({ where: { rol: "alumno" } });
    const totalEventos = await Evento.count({
      where: { descripcion: { [Op.iLike]: "%coatzintla%" } },
    });

    await generateReportePDF(
      res,
      alumnos,
      eventos,
      {
        titulo: "Reporte Coatzintla - Alumnos y Eventos",
        tituloColor: "#059669",
        encabezadoColor: "#10B981",
        filename: "reporte_coatzintla.pdf",
      },
      {
        totalAlumnos,
        totalEventos,
      }
    );
  } catch (error) {
    console.error("Error generando reporte Coatzintla:", error);
    res.status(500).send("Error generando el reporte Coatzintla");
  }
};
