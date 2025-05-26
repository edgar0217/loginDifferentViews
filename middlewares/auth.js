export function isAuthenticated(req, res, next) {
  if (req.session.usuario) {
    return next(); // Si hay sesión, continuar
  }
  return res.redirect("/login"); // Si no hay sesión, redirigir al login
}

// middlewares/auth.js
export function isAdmin(req, res, next) {
  if (req.session.usuario && req.session.usuario.rol === "admin") {
    return next(); // Si es admin, continuar
  }

  // Si no es admin, redirigir al login
  return res.redirect("/login");
}

export function isAlumno(req, res, next) {
  if (req.session.usuario && req.session.usuario.rol === "alumno")
    return next();

  // Si es admin, redirigirlo a su panel
  if (req.session.usuario && req.session.usuario.rol === "admin") {
    return res.redirect("/admin/eventos");
  }

  return res.redirect("/login");
}

export const isSuperAdmin = (req, res, next) => {
  if (req.session.usuario && req.session.usuario.rol === "superadmin") {
    return next();
  }
  res.redirect("/login");
};
