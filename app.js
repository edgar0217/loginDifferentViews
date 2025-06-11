import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import SequelizeStore from "connect-session-sequelize";
import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventoRoutes from "./routes/eventoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { isAuthenticated } from "./middlewares/auth.js";
import methodOverride from "method-override";
import superadminRoutes from "./routes/superAdminRoutes.js";

// NUEVO: Importa el modelo y las rutas de imágenes destacadas
import ImagenDestacada from "./models/imagenDestacada.js";
import imagenesDestacadasRoutes from "./routes/imagenesDestacadasRoutes.js";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const SequelizeStoreSession = SequelizeStore(session.Store);
const sessionStore = new SequelizeStoreSession({
  db,
  expiration: 1000 * 60 * 30, // 30 minutos TTL para sesión en DB
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);

sessionStore.sync();

// Middleware para evitar cache
function noCacheMiddleware(req, res, next) {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
}

app.use("/eventos", noCacheMiddleware);
app.use("/admin", noCacheMiddleware);

// Middleware para pasar usuario a vistas
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// Montar rutas
app.use(authRoutes); // Rutas de login y registro
app.use(isAuthenticated, eventoRoutes); // Rutas de eventos protegidas
app.use(isAuthenticated, adminRoutes); // Rutas de admin protegidas
app.use(superadminRoutes);

// NUEVO: Monta la ruta para imágenes destacadas
app.use(imagenesDestacadasRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await db.authenticate();
    await db.sync({ alter: true }); // Esto crea la tabla de ImagenDestacada si no existe

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}/login`);
    });
  } catch (error) {
    console.error("Error al conectar o sincronizar DB:", error);
    process.exit(1);
  }
})();
