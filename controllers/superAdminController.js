import Usuario from "../models/userModel.js";
import Evento from "../models/eventoModel.js";
import { cloudinary } from "../config/cloudinary.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const vistaSuperAdmin = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    const eventos = await Evento.findAll({ include: Usuario });

    const success = req.session.success || null;
    const error = req.session.error || null;
    req.session.success = null;
    req.session.error = null;

    res.render("superadmin", {
      usuarios,
      eventos,
      usuarioEditar: null,
      success,
      error,
    });
  } catch (error) {
    res.status(500).send("Error al cargar la vista del superadmin");
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      req.session.error = "Usuario no encontrado.";
      return res.redirect("/superadmin");
    }
    if (usuario.rol === "superadmin") {
      req.session.error = "No se puede eliminar un Superadmin.";
      return res.redirect("/superadmin");
    }
    await usuario.destroy();
    req.session.success = "Usuario eliminado correctamente.";
    res.redirect("/superadmin");
  } catch (error) {
    req.session.error = "Error al eliminar usuario.";
    res.redirect("/superadmin");
  }
};

export const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);
    if (!evento) {
      req.session.error = "Evento no encontrado.";
      return res.redirect("/superadmin");
    }
    if (evento.public_id_imagen) {
      await cloudinary.uploader.destroy(evento.public_id_imagen);
    }
    await evento.destroy();
    req.session.success = "Evento eliminado correctamente.";
    res.redirect("/superadmin");
  } catch (error) {
    req.session.error = "Error al eliminar evento.";
    res.redirect("/superadmin");
  }
};

export const mostrarEditarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      req.session.error = "Usuario no encontrado.";
      return res.redirect("/superadmin");
    }
    const usuarios = await Usuario.findAll();
    const eventos = await Evento.findAll({ include: Usuario });

    res.render("superadmin", {
      usuarios,
      eventos,
      usuarioEditar: usuario,
      success: null,
      error: null,
    });
  } catch (error) {
    req.session.error = "Error al cargar datos del usuario.";
    res.redirect("/superadmin");
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      telefono,
      correo_institucional,
      matricula,
      rol,
      password,
      passwordConfirm,
    } = req.body;

    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      req.session.error = "Usuario no encontrado.";
      return res.redirect("/superadmin");
    }

    if (password || passwordConfirm) {
      if (password !== passwordConfirm) {
        req.session.error = "Las contraseñas no coinciden.";
        return res.redirect(`/superadmin/editar-usuario/${req.params.id}`);
      }
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      usuario.password = hashedPassword;
    }

    await usuario.update({
      nombre: nombre.toLowerCase(),
      apellidos: apellidos.toLowerCase(),
      telefono: telefono.toLowerCase(),
      correo_institucional: correo_institucional
        ? correo_institucional.toLowerCase()
        : null,
      matricula: matricula.toLowerCase(),
      rol,
      password: usuario.password,
    });

    req.session.success = "Usuario actualizado correctamente.";
    res.redirect("/superadmin");
  } catch (error) {
    console.error(error);
    req.session.error = "Error al actualizar usuario.";
    res.redirect("/superadmin");
  }
};

export const crearUsuario = async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      telefono,
      correo_institucional,
      matricula,
      password,
      passwordConfirm,
      rol,
    } = req.body;

    // Validar campos obligatorios
    if (
      !nombre ||
      !apellidos ||
      !telefono ||
      !matricula ||
      !password ||
      !passwordConfirm ||
      !rol
    ) {
      req.session.error = "Por favor, completa todos los campos obligatorios.";
      return res.redirect("/superadmin");
    }

    // Evitar creación de superadmin desde el formulario
    if (rol === "superadmin") {
      req.session.error = "No puedes crear un usuario con rol Superadmin.";
      return res.redirect("/superadmin");
    }

    // Validar contraseñas
    if (password !== passwordConfirm) {
      req.session.error = "Las contraseñas no coinciden.";
      return res.redirect("/superadmin");
    }

    // Verificar si ya existe la matrícula
    const existe = await Usuario.findOne({
      where: { matricula: matricula.toLowerCase() },
    });
    if (existe) {
      req.session.error = "La matrícula ya está registrada.";
      return res.redirect("/superadmin");
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    await Usuario.create({
      nombre: nombre.toLowerCase(),
      apellidos: apellidos.toLowerCase(),
      telefono: telefono.toLowerCase(),
      correo_institucional: correo_institucional
        ? correo_institucional.toLowerCase()
        : null,
      matricula: matricula.toLowerCase(),
      password: hashedPassword,
      rol,
    });

    req.session.success = "Usuario creado correctamente.";
    res.redirect("/superadmin");
  } catch (error) {
    console.error(error);
    req.session.error = "Error al crear usuario.";
    res.redirect("/superadmin");
  }
};
