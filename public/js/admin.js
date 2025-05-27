const btnVerAlumnos = document.getElementById("btnVerAlumnos");
const listaAlumnos = document.getElementById("listaAlumnos");
const modalAlumno = document.getElementById("modalAlumno");
const cerrarModal = document.getElementById("cerrarModal");

const modalNombre = document.getElementById("modalNombre");
const modalUsuario = document.getElementById("modalUsuario");
const modalDireccion = document.getElementById("modalDireccion");
const modalMunicipio = document.getElementById("modalMunicipio");
const modalCelular = document.getElementById("modalCelular");
const modalEventos = document.getElementById("modalEventos");

const modalEvento = document.getElementById("modalEvento");
const cerrarModalEvento = document.getElementById("cerrarModalEvento");

const modalTitulo = document.getElementById("modalEventoTitulo");
const modalDescripcion = document.getElementById("modalEventoDescripcion");
const modalEventoAlumno = document.getElementById("modalEventoAlumno");
const modalEventoUsuario = document.getElementById("modalEventoUsuario");
const modalEventoFecha = document.getElementById("modalEventoFecha");
const modalImagen = document.getElementById("modalEventoImagen");
const modalSeccion = document.getElementById("modalSeccion");

// Mostrar/Ocultar lista alumnos
btnVerAlumnos.addEventListener("click", () => {
  listaAlumnos.classList.toggle("hidden");
});

// Click en alumno abre modal con datos + eventos
document.querySelectorAll(".alumno-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const alumnoId = btn.dataset.id;
    modalNombre.textContent = btn.dataset.nombre;
    modalUsuario.textContent = btn.dataset.usuario;
    modalDireccion.textContent = btn.dataset.direccion;
    modalMunicipio.textContent = btn.dataset.municipio;
    modalCelular.textContent = btn.dataset.celular;
    modalSeccion.textContent = btn.dataset.seccion;

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
          li.textContent = `${ev.titulo} - ${ev.descripcion}`;
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

// Cerrar modal alumno
cerrarModal.addEventListener("click", () => {
  modalAlumno.classList.add("hidden");
});
modalAlumno.addEventListener("click", (e) => {
  if (e.target === modalAlumno) modalAlumno.classList.add("hidden");
});

// Click en fila evento abre modal evento
document.querySelectorAll("tbody tr").forEach((fila) => {
  fila.addEventListener("click", () => {
    modalTitulo.textContent = fila.getAttribute("data-titulo");
    modalDescripcion.textContent = fila.getAttribute("data-descripcion");
    modalEventoAlumno.textContent = fila.getAttribute("data-alumno");
    modalEventoUsuario.textContent = fila.getAttribute("data-usuario");
    modalEventoFecha.textContent = fila.getAttribute("data-fecha");

    const imagen = fila.getAttribute("data-imagen");
    if (imagen) {
      modalImagen.src = imagen;
      modalImagen.style.display = "block";
    } else {
      modalImagen.style.display = "none";
    }

    modalEvento.classList.remove("hidden");
  });
});

// Cerrar modal evento
cerrarModalEvento.addEventListener("click", () => {
  modalEvento.classList.add("hidden");
});
modalEvento.addEventListener("click", (e) => {
  if (e.target === modalEvento) modalEvento.classList.add("hidden");
});
