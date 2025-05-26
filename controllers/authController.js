import bcrypt from "bcrypt";
import Usuario from "../models/userModel.js";

const saltRounds = 10;

export const registroGet = (req, res) => {
  res.render("register", { error: null });
};

export const registroPost = async (req, res) => {
  try {
    let {
      nombre,
      apellidos,
      telefono,
      correo_institucional,
      matricula,
      password,
    } = req.body;

    // Convertir a minúsculas antes de guardar
    nombre = nombre.toLowerCase();
    apellidos = apellidos.toLowerCase();
    telefono = telefono.toLowerCase();
    correo_institucional = correo_institucional
      ? correo_institucional.toLowerCase()
      : null;
    matricula = matricula.toLowerCase();

    const existe = await Usuario.findOne({ where: { matricula } });
    if (existe) {
      return res.render("register", {
        error: "La matrícula ya está registrada.",
      });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    await Usuario.create({
      nombre,
      apellidos,
      telefono,
      correo_institucional,
      matricula,
      password: hash,
      rol: "alumno",
    });

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.render("register", { error: "Error al registrar usuario." });
  }
};

export const loginGet = (req, res) => {
  res.render("login", { error: null });
};

export const loginPost = async (req, res) => {
  try {
    const matricula = req.body.matricula.toLowerCase(); // convertir a minúsculas para buscar
    const password = req.body.password;

    const usuario = await Usuario.findOne({ where: { matricula } });
    if (!usuario) {
      return res.render("login", {
        error: "Matrícula o contraseña incorrecta.",
      });
    }
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.render("login", {
        error: "Matrícula o contraseña incorrecta.",
      });
    }
    req.session.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      rol: usuario.rol,
    };

    if (usuario.rol === "superadmin") {
      return res.redirect("/superadmin");
    }

    if (usuario.rol === "admin") {
      return res.redirect("/admin/eventos");
    }

    res.redirect("/eventos");
  } catch (error) {
    console.error(error);
    res.render("login", { error: "Error en el inicio de sesión." });
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
};
