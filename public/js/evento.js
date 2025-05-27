document.addEventListener("DOMContentLoaded", () => {
  const inputArchivo = document.getElementById("inputArchivo");
  const inputCamara = document.getElementById("inputCamara");
  const btnSeleccionarArchivo = document.getElementById(
    "btnSeleccionarArchivo"
  );
  const btnTomarFoto = document.getElementById("btnTomarFoto");
  const previewContainer = document.getElementById("previewContainer");
  const btnLimpiar = document.getElementById("btnLimpiar");
  const formCrearEvento = document.getElementById("formCrearEvento");

  function resetInputFile() {
    inputArchivo.value = "";
    inputCamara.value = "";
  }

  btnSeleccionarArchivo.addEventListener("click", () => {
    resetInputFile();
    inputArchivo.click();
  });

  btnTomarFoto.addEventListener("click", () => {
    resetInputFile();
    inputCamara.click();
  });

  function previewImage(event) {
    previewContainer.innerHTML = "";
    const file = event.target.files[0];
    if (!file) return;
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.className = "w-48 rounded mt-2";
    previewContainer.appendChild(img);
  }

  inputArchivo.addEventListener("change", previewImage);
  inputCamara.addEventListener("change", previewImage);

  btnLimpiar.addEventListener("click", () => {
    formCrearEvento.reset();
    previewContainer.innerHTML = "";
    resetInputFile();
  });

  formCrearEvento.addEventListener("submit", () => {
    const btnCrearEvento = formCrearEvento.querySelector(
      'button[type="submit"]'
    );
    btnCrearEvento.disabled = true;
    btnCrearEvento.classList.add("opacity-50", "cursor-not-allowed");
    btnCrearEvento.textContent = "Creando...";
  });
});
