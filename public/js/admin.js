const btnVerAlumnos = document.getElementById("btnVerAlumnos");
const listaAlumnos = document.getElementById("listaAlumnos");
const modalAlumno = document.getElementById("modalAlumno");
const cerrarModal = document.getElementById("cerrarModal");

const modalNombre = document.getElementById("modalNombre");
const modalTelefono = document.getElementById("modalTelefono");
const modalCorreo = document.getElementById("modalCorreo");
const modalMatricula = document.getElementById("modalMatricula");
const modalEventos = document.getElementById("modalEventos");

// Botón para mostrar lista de alumnos
btnVerAlumnos.addEventListener("click", () => {
  listaAlumnos.classList.toggle("hidden");
});

// Al hacer clic en un alumno de la lista
document.querySelectorAll(".alumno-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const alumnoId = btn.dataset.id;
    const nombre = btn.dataset.nombre;
    const apellidos = btn.dataset.apellidos;
    const telefono = btn.dataset.telefono;
    const correo = btn.dataset.correo || "No especificado";
    const matricula = btn.dataset.matricula;

    modalNombre.textContent = `${nombre} ${apellidos}`;
    modalTelefono.textContent = telefono;
    modalCorreo.textContent = correo;
    modalMatricula.textContent = matricula;

    modalEventos.innerHTML = "<li>Cargando eventos...</li>";

    try {
      const res = await fetch(`/admin/alumno/${alumnoId}/eventos`);
      if (!res.ok) throw new Error("Error al obtener eventos");
      const eventos = await res.json();

      if (eventos.length === 0) {
        modalEventos.innerHTML = "<li>Sin eventos</li>";
      } else {
        modalEventos.innerHTML = "";
        eventos.forEach((ev) => {
          const li = document.createElement("li");
          li.textContent = ev.titulo;
          modalEventos.appendChild(li);
        });
      }
    } catch (error) {
      modalEventos.innerHTML = "<li>Error cargando eventos</li>";
      console.error(error);
    }

    modalAlumno.classList.remove("hidden");
  });
});

// Cerrar modal de alumno
cerrarModal.addEventListener("click", () => {
  modalAlumno.classList.add("hidden");
});

modalAlumno.addEventListener("click", (e) => {
  if (e.target === modalAlumno) {
    modalAlumno.classList.add("hidden");
  }
});

// Modal de eventos
document.addEventListener("DOMContentLoaded", () => {
  const modalEvento = document.getElementById("modalEvento");
  const cerrarModalEvento = document.getElementById("cerrarModalEvento");

  const modalTitulo = document.getElementById("modalEventoTitulo");
  const modalDescripcion = document.getElementById("modalEventoDescripcion");
  const modalEventoAlumno = document.getElementById("modalEventoAlumno");
  const modalEventoMatricula = document.getElementById(
    "modalEventoAlumnoMatricula"
  );
  const modalImagen = document.getElementById("modalEventoImagen");

  const filasEventos = document.querySelectorAll("tbody tr");

  filasEventos.forEach((fila) => {
    fila.addEventListener("click", () => {
      const titulo = fila.getAttribute("data-titulo");
      const descripcion = fila.getAttribute("data-descripcion");
      const alumno = fila.getAttribute("data-alumno");
      const matricula = fila.getAttribute("data-matricula");
      const imagen = fila.getAttribute("data-imagen");

      modalTitulo.textContent = titulo;
      modalDescripcion.textContent = descripcion;
      modalEventoAlumno.textContent = alumno;
      modalEventoMatricula.textContent = matricula;

      if (imagen) {
        modalImagen.src = imagen;
        modalImagen.style.display = "block";
      } else {
        modalImagen.style.display = "none";
      }

      modalEvento.classList.remove("hidden");
    });
  });

  cerrarModalEvento.addEventListener("click", () => {
    modalEvento.classList.add("hidden");
  });

  modalEvento.addEventListener("click", (e) => {
    if (e.target === modalEvento) {
      modalEvento.classList.add("hidden");
    }
  });
});
