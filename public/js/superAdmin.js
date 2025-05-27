document.addEventListener("DOMContentLoaded", () => {
  // Confirmación SweetAlert para eliminar usuarios
  document.querySelectorAll(".eliminar-usuario-form").forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el usuario permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  });

  // Confirmación SweetAlert para eliminar eventos
  document.querySelectorAll(".eliminar-evento-form").forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el evento permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          form.submit();
        }
      });
    });
  });

  // Mostrar alertas de éxito o error al cargar la página
  if (window.alertData) {
    if (window.alertData.success) {
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: window.alertData.success,
        timer: 2500,
        showConfirmButton: false,
        background: "#1e293b",
        color: "#e0e7ff",
      });
    }
    if (window.alertData.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: window.alertData.error,
        timer: 3500,
        showConfirmButton: true,
        background: "#1e293b",
        color: "#e0e7ff",
      });
    }
  }
});
