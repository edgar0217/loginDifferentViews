// Abrir selector de archivo
document
  .getElementById("btnSeleccionarArchivo")
  .addEventListener("click", () => {
    document.getElementById("inputArchivo").click();
  });

// Abrir cámara para tomar foto
document.getElementById("btnTomarFoto").addEventListener("click", () => {
  document.getElementById("inputCamara").click();
});

// Previsualizar imagen y evitar 2 archivos simultáneos
function previewImage(event) {
  const previewContainer = document.getElementById("previewContainer");
  previewContainer.innerHTML = "";
  const file = event.target.files[0];
  if (!file) return;
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.className = "w-48 rounded mt-2";
  previewContainer.appendChild(img);

  // Limpiar el otro input para evitar subir dos archivos
  if (event.target.id === "inputArchivo") {
    document.getElementById("inputCamara").value = "";
  } else {
    document.getElementById("inputArchivo").value = "";
  }
}

// Botón limpiar formulario
const btnLimpiar = document.getElementById("btnLimpiar");
btnLimpiar.addEventListener("click", () => {
  const form = document.getElementById("formCrearEvento");
  form.reset();

  const previewContainer = document.getElementById("previewContainer");
  previewContainer.innerHTML = "";
});

// Confirmación SweetAlert2 para eliminar evento
document.querySelectorAll(".formEliminarEvento").forEach((formEl) => {
  formEl.addEventListener("submit", function (e) {
    e.preventDefault();
    Swal.fire({
      title: "¿Eliminar evento?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        formEl.submit();
      }
    });
  });
});

// Deshabilitar botón "Crear Evento" al enviar formulario
const formCrearEvento = document.getElementById("formCrearEvento");
const btnCrearEvento = formCrearEvento.querySelector('button[type="submit"]');

formCrearEvento.addEventListener("submit", () => {
  btnCrearEvento.disabled = true;
  btnCrearEvento.classList.add("opacity-50", "cursor-not-allowed");
  btnCrearEvento.textContent = "Creando...";
});
