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
