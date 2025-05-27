import Usuario from "../models/userModel.js";
import Evento from "../models/eventoModel.js";
import { cloudinary } from "../config/cloudinary.js";
import bcrypt from "bcrypt";
import { generateReportePDF } from "../utils/pdfGenerator.js";
import { Op } from "sequelize";

const saltRounds = 10;

export const vistaSuperAdmin = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();

    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const { count: eventosCount, rows: eventos } = await Evento.findAndCountAll(
      {
        include: Usuario,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      }
    );

    const totalPages = Math.ceil(eventosCount / limit);

    const success = req.session.success || null;
    const error = req.session.error || null;
    req.session.success = null;
    req.session.error = null;

    res.render("superAdmin", {
      usuarios,
      eventos,
      eventosCount,
      totalPages,
      currentPage: page,
      usuarioEditar: null,
      success,
      error,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar la vista del superadmin");
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      req.session.error = "Usuario no encontrado.";
      return res.redirect("/superAdmin");
    }
    if (usuario.rol === "superadmin") {
      req.session.error = "No se puede eliminar un Superadmin.";
      return res.redirect("/superAdmin");
    }
    await usuario.destroy();
    req.session.success = "Usuario eliminado correctamente.";
    res.redirect("/superAdmin");
  } catch (error) {
    req.session.error = "Error al eliminar usuario.";
    res.redirect("/superAdmin");
  }
};

export const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);
    if (!evento) {
      req.session.error = "Evento no encontrado.";
      return res.redirect("/superAdmin");
    }
    if (evento.public_id_imagen) {
      await cloudinary.uploader.destroy(evento.public_id_imagen);
    }
    await evento.destroy();
    req.session.success = "Evento eliminado correctamente.";
    res.redirect("/superAdmin");
  } catch (error) {
    req.session.error = "Error al eliminar evento.";
    res.redirect("/superAdmin");
  }
};

export const mostrarEditarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      req.session.error = "Usuario no encontrado.";
      return res.redirect("/superAdmin");
    }
    const usuarios = await Usuario.findAll();
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    const { count: eventosCount, rows: eventos } = await Evento.findAndCountAll(
      {
        include: Usuario,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      }
    );
    const totalPages = Math.ceil(eventosCount / limit);

    res.render("superAdmin", {
      usuarios,
      eventos,
      eventosCount,
      totalPages,
      currentPage: page,
      usuarioEditar: usuario,
      success: null,
      error: null,
    });
  } catch (error) {
    req.session.error = "Error al cargar datos del usuario.";
    res.redirect("/superAdmin");
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const {
      nombre,
      usuario,
      direccion,
      municipio,
      seccion_electoral,
      celular,
      rol,
      password,
      passwordConfirm,
    } = req.body;

    const usuarioDB = await Usuario.findByPk(req.params.id);
    if (!usuarioDB) {
      req.session.error = "Usuario no encontrado.";
      return res.redirect("/superAdmin");
    }

    if (password || passwordConfirm) {
      if (password !== passwordConfirm) {
        req.session.error = "Las contraseñas no coinciden.";
        return res.redirect(`/superAdmin/editar-usuario/${req.params.id}`);
      }
      usuarioDB.password = await bcrypt.hash(password, saltRounds);
    }

    await usuarioDB.update({
      nombre: nombre.toLowerCase(),
      usuario: usuario.toLowerCase(),
      direccion: direccion.toLowerCase(),
      municipio: municipio.toLowerCase(),
      seccion_electoral: seccion_electoral.toLowerCase(),
      celular: celular,
      rol,
      password: usuarioDB.password,
    });

    req.session.success = "Usuario actualizado correctamente.";
    res.redirect("/superAdmin");
  } catch (error) {
    console.error(error);
    req.session.error = "Error al actualizar usuario.";
    res.redirect("/superAdmin");
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const {
      nombre,
      usuario,
      direccion,
      municipio,
      seccion_electoral,
      celular,
      password,
      passwordConfirm,
      rol,
    } = req.body;

    if (
      !nombre ||
      !usuario ||
      !direccion ||
      !municipio ||
      !seccion_electoral ||
      !celular ||
      !password ||
      !passwordConfirm ||
      !rol
    ) {
      req.session.error = "Por favor, completa todos los campos obligatorios.";
      return res.redirect("/superAdmin");
    }

    if (rol === "superadmin") {
      req.session.error = "No puedes crear un usuario con rol Superadmin.";
      return res.redirect("/superAdmin");
    }

    if (password !== passwordConfirm) {
      req.session.error = "Las contraseñas no coinciden.";
      return res.redirect("/superAdmin");
    }

    const existe = await Usuario.findOne({
      where: { usuario: usuario.toLowerCase() },
    });
    if (existe) {
      req.session.error = "El nombre de usuario ya está registrado.";
      return res.redirect("/superAdmin");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await Usuario.create({
      nombre: nombre.toLowerCase(),
      usuario: usuario.toLowerCase(),
      direccion: direccion.toLowerCase(),
      municipio: municipio.toLowerCase(),
      seccion_electoral: seccion_electoral.toLowerCase(),
      celular: celular,
      password: hashedPassword,
      rol,
    });

    req.session.success = "Usuario creado correctamente.";
    res.redirect("/superAdmin");
  } catch (error) {
    console.error(error);
    req.session.error = "Error al crear usuario.";
    res.redirect("/superAdmin");
  }
};

export const descargarReportePDF = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
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

    const totalUsuarios = await Usuario.count();
    const totalAlumnos = await Usuario.count({ where: { rol: "alumno" } });
    const totalEventos = await Evento.count();

    await generateReportePDF(
      res,
      usuarios,
      eventos,
      {
        titulo: "Reporte de Usuarios y Eventos",
        tituloColor: "#4F46E5",
        encabezadoColor: "#2563EB",
        filename: "reporte_superadmin.pdf",
      },
      {
        totalUsuarios,
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
    const usuarios = await Usuario.findAll({
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
      usuarios,
      eventos,
      {
        titulo: "Reporte Poza Rica - Convencidos y Eventos",
        tituloColor: "#1D4ED8",
        encabezadoColor: "#2563EB",
        filename: "reporte_poza_rica_superadmin.pdf",
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
    const usuarios = await Usuario.findAll({
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
      usuarios,
      eventos,
      {
        titulo: "Reporte Coatzintla - Convencidos y Eventos",
        tituloColor: "#059669",
        encabezadoColor: "#10B981",
        filename: "reporte_coatzintla_superadmin.pdf",
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

// NUEVO: Actualizar evento con datos recibidos
export const actualizarEvento = async (req, res) => {
  try {
    const { titulo, descripcion, usuarioId } = req.body;

    const evento = await Evento.findByPk(req.params.id);
    if (!evento) {
      req.session.error = "Evento no encontrado.";
      return res.redirect("/superAdmin");
    }

    await evento.update({
      titulo,
      descripcion,
      usuarioId,
    });

    req.session.success = "Evento actualizado correctamente.";
    res.redirect("/superAdmin");
  } catch (error) {
    console.error(error);
    req.session.error = "Error al actualizar evento.";
    res.redirect("/superAdmin");
  }
};
