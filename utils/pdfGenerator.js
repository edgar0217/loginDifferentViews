// utils/pdfGenerator.js
import PDFDocument from "pdfkit";

export const generateReportePDF = (res, usuarios, eventos, options = {}) => {
  const {
    titulo = "Reporte de Usuarios y Eventos",
    tituloColor = "#047857", // color del título principal
    encabezadoColor = "#059669", // color de los encabezados de tablas
    filename = "reporte.pdf", // nombre del archivo PDF
  } = options;

  const doc = new PDFDocument({ margin: 30, size: "A4" });

  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  // Título principal
  doc.fontSize(20).fillColor(tituloColor).text(titulo, { align: "center" });
  doc.moveDown();

  // Tabla Usuarios
  doc
    .fontSize(16)
    .fillColor(encabezadoColor)
    .text("Usuarios (Alumnos)", { underline: true });
  doc.moveDown(0.5);

  const userTableTop = doc.y;
  const userColWidths = {
    id: 30,
    nombre: 100,
    apellidos: 100,
    matricula: 70,
    telefono: 70,
    correo: 120,
    creado: 80,
  };

  // Encabezados tabla usuarios
  doc
    .fontSize(10)
    .fillColor("black")
    .text("ID", 30, userTableTop, { width: userColWidths.id, align: "center" })
    .text("Nombre", 30 + userColWidths.id, userTableTop, {
      width: userColWidths.nombre,
      align: "center",
    })
    .text(
      "Apellidos",
      30 + userColWidths.id + userColWidths.nombre,
      userTableTop,
      { width: userColWidths.apellidos, align: "center" }
    )
    .text(
      "Matrícula",
      30 + userColWidths.id + userColWidths.nombre + userColWidths.apellidos,
      userTableTop,
      { width: userColWidths.matricula, align: "center" }
    )
    .text(
      "Teléfono",
      30 +
        userColWidths.id +
        userColWidths.nombre +
        userColWidths.apellidos +
        userColWidths.matricula,
      userTableTop,
      { width: userColWidths.telefono, align: "center" }
    )
    .text(
      "Correo",
      30 +
        userColWidths.id +
        userColWidths.nombre +
        userColWidths.apellidos +
        userColWidths.matricula +
        userColWidths.telefono,
      userTableTop,
      { width: userColWidths.correo, align: "center" }
    )
    .text(
      "Creado",
      30 +
        userColWidths.id +
        userColWidths.nombre +
        userColWidths.apellidos +
        userColWidths.matricula +
        userColWidths.telefono +
        userColWidths.correo,
      userTableTop,
      { width: userColWidths.creado, align: "center" }
    );

  // Línea debajo encabezados usuarios
  doc
    .moveTo(30, userTableTop + 15)
    .lineTo(570, userTableTop + 15)
    .stroke();

  // Filas usuarios
  let y = userTableTop + 20;
  usuarios.forEach((u) => {
    doc
      .fontSize(9)
      .text(u.id.toString(), 30, y, {
        width: userColWidths.id,
        align: "center",
      })
      .text(capitalize(u.nombre), 30 + userColWidths.id, y, {
        width: userColWidths.nombre,
      })
      .text(
        capitalize(u.apellidos),
        30 + userColWidths.id + userColWidths.nombre,
        y,
        { width: userColWidths.apellidos }
      )
      .text(
        u.matricula,
        30 + userColWidths.id + userColWidths.nombre + userColWidths.apellidos,
        y,
        { width: userColWidths.matricula, align: "center" }
      )
      .text(
        u.telefono,
        30 +
          userColWidths.id +
          userColWidths.nombre +
          userColWidths.apellidos +
          userColWidths.matricula,
        y,
        { width: userColWidths.telefono, align: "center" }
      )
      .text(
        u.correo_institucional || "N/A",
        30 +
          userColWidths.id +
          userColWidths.nombre +
          userColWidths.apellidos +
          userColWidths.matricula +
          userColWidths.telefono,
        y,
        { width: userColWidths.correo }
      )
      .text(
        formatDate(u.createdAt),
        30 +
          userColWidths.id +
          userColWidths.nombre +
          userColWidths.apellidos +
          userColWidths.matricula +
          userColWidths.telefono +
          userColWidths.correo,
        y,
        { width: userColWidths.creado, align: "center" }
      );

    y += 15;
    if (y > 750) {
      doc.addPage();
      y = 50;
    }
  });

  doc.addPage();

  // Tabla Eventos
  doc
    .fontSize(16)
    .fillColor(encabezadoColor)
    .text("Eventos", { underline: true });
  doc.moveDown(0.5);

  const eventTableTop = doc.y;
  const eventColWidths = {
    id: 30,
    titulo: 100,
    descripcion: 170,
    creadoPor: 160,
    fecha: 90,
  };

  // Encabezados tabla eventos
  doc
    .fontSize(10)
    .fillColor("black")
    .text("ID", 30, eventTableTop, {
      width: eventColWidths.id,
      align: "center",
    })
    .text("Título", 30 + eventColWidths.id, eventTableTop, {
      width: eventColWidths.titulo,
      align: "center",
    })
    .text(
      "Descripción",
      30 + eventColWidths.id + eventColWidths.titulo,
      eventTableTop,
      { width: eventColWidths.descripcion, align: "center" }
    )
    .text(
      "Creado por(Nombre y Matrícula)",
      30 +
        eventColWidths.id +
        eventColWidths.titulo +
        eventColWidths.descripcion,
      eventTableTop,
      { width: eventColWidths.creadoPor, align: "center" }
    )
    .text(
      "Fecha creación",
      30 +
        eventColWidths.id +
        eventColWidths.titulo +
        eventColWidths.descripcion +
        eventColWidths.creadoPor,
      eventTableTop,
      { width: eventColWidths.fecha, align: "center" }
    );

  // Línea debajo encabezados eventos
  doc
    .moveTo(30, eventTableTop + 15)
    .lineTo(580, eventTableTop + 15)
    .stroke();

  // Filas eventos
  y = eventTableTop + 20;
  eventos.forEach((e) => {
    const creadorNombre = e.usuario
      ? capitalize(e.usuario.nombre) + " " + capitalize(e.usuario.apellidos)
      : "N/D";
    const creadorMatricula = e.usuario ? e.usuario.matricula : "N/D";
    const creador = `${creadorNombre} (${creadorMatricula})`;

    doc
      .fontSize(9)
      .text(e.id.toString(), 30, y, {
        width: eventColWidths.id,
        align: "center",
      })
      .text(truncateText(e.titulo, 30), 30 + eventColWidths.id, y, {
        width: eventColWidths.titulo,
      })
      .text(
        truncateText(e.descripcion || "", 60),
        30 + eventColWidths.id + eventColWidths.titulo,
        y,
        { width: eventColWidths.descripcion }
      )
      .text(
        creador,
        30 +
          eventColWidths.id +
          eventColWidths.titulo +
          eventColWidths.descripcion,
        y,
        { width: eventColWidths.creadoPor }
      )
      .text(
        formatDate(e.createdAt),
        30 +
          eventColWidths.id +
          eventColWidths.titulo +
          eventColWidths.descripcion +
          eventColWidths.creadoPor,
        y,
        { width: eventColWidths.fecha, align: "center" }
      );

    y += 15;
    if (y > 750) {
      doc.addPage();
      y = 50;
    }
  });

  doc.end();
};

// Funciones auxiliares

export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("es-MX");
};

export const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
};
