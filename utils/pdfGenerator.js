// utils/pdfGenerator.js
import PDFDocument from "pdfkit";

export const generateReportePDF = (
  res,
  usuarios,
  eventos,
  options = {},
  summary = {}
) => {
  const {
    titulo = "Reporte de Usuarios y Eventos",
    tituloColor = "#047857",
    encabezadoColor = "#059669",
    filename = "reporte.pdf",
  } = options;

  const { totalAlumnos = null, totalEventos = null } = summary;

  const doc = new PDFDocument({ margin: 30, size: "A4" });

  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  // Título principal
  doc.fontSize(20).fillColor(tituloColor).text(titulo, { align: "center" });
  doc.moveDown();

  // Resumen conteos al inicio (Convencidos y Eventos)
  if (totalAlumnos !== null && totalEventos !== null) {
    doc.fontSize(14).fillColor("black").text("Resumen de registros:", {
      underline: true,
    });
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor("black").text(`Convencidos: ${totalAlumnos}`);
    doc.text(`Eventos: ${totalEventos}`);
    doc.moveDown(1.5);
  }

  // Tabla Convencidos
  doc
    .fontSize(16)
    .fillColor(encabezadoColor)
    .text("Convencidos", { underline: true });
  doc.moveDown(0.5);

  const userTableTop = doc.y;
  const userColWidths = {
    id: 30,
    nombre: 90,
    usuario: 70,
    direccion: 110,
    municipio: 65,
    seccion: 65,
    celular: 70,
    creado: 70,
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
      "Usuario",
      30 + userColWidths.id + userColWidths.nombre,
      userTableTop,
      {
        width: userColWidths.usuario,
        align: "center",
      }
    )
    .text(
      "Dirección",
      30 + userColWidths.id + userColWidths.nombre + userColWidths.usuario,
      userTableTop,
      {
        width: userColWidths.direccion,
        align: "center",
      }
    )
    .text(
      "Municipio",
      30 +
        userColWidths.id +
        userColWidths.nombre +
        userColWidths.usuario +
        userColWidths.direccion,
      userTableTop,
      {
        width: userColWidths.municipio,
        align: "center",
      }
    )
    .text(
      "Sección",
      30 +
        userColWidths.id +
        userColWidths.nombre +
        userColWidths.usuario +
        userColWidths.direccion +
        userColWidths.municipio,
      userTableTop,
      {
        width: userColWidths.seccion,
        align: "center",
      }
    )
    .text(
      "Celular",
      30 +
        userColWidths.id +
        userColWidths.nombre +
        userColWidths.usuario +
        userColWidths.direccion +
        userColWidths.municipio +
        userColWidths.seccion,
      userTableTop,
      {
        width: userColWidths.celular,
        align: "center",
      }
    )
    .text(
      "Creado",
      30 +
        userColWidths.id +
        userColWidths.nombre +
        userColWidths.usuario +
        userColWidths.direccion +
        userColWidths.municipio +
        userColWidths.seccion +
        userColWidths.celular,
      userTableTop,
      {
        width: userColWidths.creado,
        align: "center",
      }
    );

  // Línea debajo encabezados usuarios
  doc
    .moveTo(30, userTableTop + 15)
    .lineTo(
      30 + Object.values(userColWidths).reduce((a, b) => a + b, 0),
      userTableTop + 15
    )
    .stroke();

  // Filas usuarios con altura variable
  let y = userTableTop + 20;
  usuarios.forEach((u) => {
    const alturaNombre = doc.heightOfString(capitalize(u.nombre), {
      width: userColWidths.nombre,
      align: "left",
    });
    const alturaUsuario = doc.heightOfString(u.usuario, {
      width: userColWidths.usuario,
      align: "left",
    });
    const alturaDireccion = doc.heightOfString(u.direccion, {
      width: userColWidths.direccion,
      align: "left",
    });
    const alturaMunicipio = doc.heightOfString(u.municipio, {
      width: userColWidths.municipio,
      align: "left",
    });
    const alturaSeccion = doc.heightOfString(u.seccion_electoral, {
      width: userColWidths.seccion,
      align: "left",
    });
    const alturaCelular = doc.heightOfString(u.celular, {
      width: userColWidths.celular,
      align: "left",
    });
    const alturaCreado = doc.heightOfString(formatDate(u.createdAt), {
      width: userColWidths.creado,
      align: "center",
    });

    const filaAltura = Math.max(
      15,
      alturaNombre,
      alturaUsuario,
      alturaDireccion,
      alturaMunicipio,
      alturaSeccion,
      alturaCelular,
      alturaCreado
    );

    doc
      .fontSize(9)
      .text(u.id.toString(), 30, y, {
        width: userColWidths.id,
        align: "center",
      })
      .text(capitalize(u.nombre), 30 + userColWidths.id, y, {
        width: userColWidths.nombre,
      })
      .text(u.usuario, 30 + userColWidths.id + userColWidths.nombre, y, {
        width: userColWidths.usuario,
      })
      .text(
        u.direccion,
        30 + userColWidths.id + userColWidths.nombre + userColWidths.usuario,
        y,
        {
          width: userColWidths.direccion,
        }
      )
      .text(
        u.municipio,
        30 +
          userColWidths.id +
          userColWidths.nombre +
          userColWidths.usuario +
          userColWidths.direccion,
        y,
        {
          width: userColWidths.municipio,
        }
      )
      .text(
        u.seccion_electoral,
        30 +
          userColWidths.id +
          userColWidths.nombre +
          userColWidths.usuario +
          userColWidths.direccion +
          userColWidths.municipio,
        y,
        {
          width: userColWidths.seccion,
        }
      )
      .text(
        u.celular,
        30 +
          userColWidths.id +
          userColWidths.nombre +
          userColWidths.usuario +
          userColWidths.direccion +
          userColWidths.municipio +
          userColWidths.seccion,
        y,
        {
          width: userColWidths.celular,
        }
      )
      .text(
        formatDate(u.createdAt),
        30 +
          userColWidths.id +
          userColWidths.nombre +
          userColWidths.usuario +
          userColWidths.direccion +
          userColWidths.municipio +
          userColWidths.seccion +
          userColWidths.celular,
        y,
        {
          width: userColWidths.creado,
          align: "center",
        }
      );

    y += filaAltura + 5;
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
    titulo: 110,
    descripcion: 160,
    creador: 120,
    fecha: 80,
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
      {
        width: eventColWidths.descripcion,
        align: "center",
      }
    )
    .text(
      "Creado por",
      30 +
        eventColWidths.id +
        eventColWidths.titulo +
        eventColWidths.descripcion,
      eventTableTop,
      {
        width: eventColWidths.creador,
        align: "center",
      }
    )
    .text(
      "Fecha",
      30 +
        eventColWidths.id +
        eventColWidths.titulo +
        eventColWidths.descripcion +
        eventColWidths.creador,
      eventTableTop,
      {
        width: eventColWidths.fecha,
        align: "center",
      }
    );

  // Línea debajo encabezados eventos
  doc
    .moveTo(30, eventTableTop + 15)
    .lineTo(
      30 + Object.values(eventColWidths).reduce((a, b) => a + b, 0),
      eventTableTop + 15
    )
    .stroke();

  // Filas eventos con altura variable
  let yEventos = eventTableTop + 20;
  eventos.forEach((e) => {
    const creador = e.usuario
      ? capitalize(e.usuario.nombre) + " (" + e.usuario.usuario + ")"
      : "N/D";

    const alturaTitulo = doc.heightOfString(e.titulo || "", {
      width: eventColWidths.titulo,
    });
    const alturaDescripcion = doc.heightOfString(e.descripcion || "", {
      width: eventColWidths.descripcion,
    });
    const alturaCreador = doc.heightOfString(creador, {
      width: eventColWidths.creador,
    });
    const alturaFecha = doc.heightOfString(formatDate(e.createdAt), {
      width: eventColWidths.fecha,
    });

    const filaAltura = Math.max(
      15,
      alturaTitulo,
      alturaDescripcion,
      alturaCreador,
      alturaFecha
    );

    doc
      .fontSize(9)
      .text(e.id.toString(), 30, yEventos, {
        width: eventColWidths.id,
        align: "center",
      })
      .text(e.titulo || "", 30 + eventColWidths.id, yEventos, {
        width: eventColWidths.titulo,
      })
      .text(
        e.descripcion || "",
        30 + eventColWidths.id + eventColWidths.titulo,
        yEventos,
        {
          width: eventColWidths.descripcion,
        }
      )
      .text(
        creador,
        30 +
          eventColWidths.id +
          eventColWidths.titulo +
          eventColWidths.descripcion,
        yEventos,
        {
          width: eventColWidths.creador,
        }
      )
      .text(
        formatDate(e.createdAt),
        30 +
          eventColWidths.id +
          eventColWidths.titulo +
          eventColWidths.descripcion +
          eventColWidths.creador,
        yEventos,
        {
          width: eventColWidths.fecha,
          align: "center",
        }
      );

    yEventos += filaAltura + 5;
    if (yEventos > 750) {
      doc.addPage();
      yEventos = 50;
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
