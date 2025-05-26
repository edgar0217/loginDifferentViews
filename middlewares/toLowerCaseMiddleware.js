export const toLowerCaseMiddleware = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (
        typeof req.body[key] === "string" &&
        [
          "nombre",
          "apellidos",
          "telefono",
          "correo_institucional",
          "matricula",
          "titulo",
          "descripcion",
        ].includes(key)
      ) {
        req.body[key] = req.body[key].toLowerCase();
      }
    }
  }
  next();
};
