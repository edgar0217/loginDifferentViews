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
      usuario,
      direccion,
      municipio,
      seccion_electoral,
      celular,
      password,
    } = req.body;

    // Normalizar usuario para evitar duplicados (minúsculas)
    usuario = usuario.toLowerCase();
    nombre = nombre.trim();
    direccion = direccion.trim();
    municipio = municipio.trim();
    seccion_electoral = seccion_electoral.trim();
    celular = celular.trim();

    // Validar que el usuario no exista
    const existe = await Usuario.findOne({ where: { usuario } });
    if (existe) {
      return res.render("register", {
        error: "El usuario ya está en uso, elige otro.",
      });
    }

    // Hashear la contraseña
    const hash = await bcrypt.hash(password, saltRounds);

    // Crear nuevo usuario
    await Usuario.create({
      nombre,
      usuario,
      direccion,
      municipio,
      seccion_electoral,
      celular,
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
    const usuario = req.body.usuario.toLowerCase();
    const password = req.body.password;

    const user = await Usuario.findOne({ where: { usuario } });
    if (!user) {
      return res.render("login", {
        error: "Usuario o contraseña incorrecta.",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("login", {
        error: "Usuario o contraseña incorrecta.",
      });
    }

    // Guardar sesión con nombre y usuario
    req.session.usuario = {
      id: user.id,
      nombre: user.nombre,
      usuario: user.usuario, // <--- agregado aquí
      rol: user.rol,
    };

    if (user.rol === "superadmin") return res.redirect("/superadmin");
    if (user.rol === "admin") return res.redirect("/admin/eventos");

    res.redirect("/eventos");
  } catch (error) {
    console.error(error);
    res.render("login", { error: "Error en el inicio de sesión." });
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
