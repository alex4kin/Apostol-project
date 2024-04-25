const uploadedFiles = [];

document.getElementById("upload-input").addEventListener("change", (event) => {
  const files = event.target.files;
  const imagePreview = document.getElementById("image-preview");
  const pdfPreview = document.getElementById("pdf-preview");
  const ifcPreview = document.getElementById("ifc-preview");

  const updateDeleteButtonVisibility = (previewElement) => {
    const deleteButtons = previewElement.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.style.display = previewElement.children.length > 0 ? "block" : "none";
    });
  };

  const createDeleteButton = (fileDeleteButton, fileContainer, fileName, previewElement) => {
    fileDeleteButton.addEventListener("click", () => {
      fileContainer.remove();
      removeFromUploadedFiles(fileName);
      updateDeleteButtonVisibility(previewElement);
    });
  };

  const removeFromUploadedFiles = (fileName) => {
    const index = uploadedFiles.findIndex((file) => file.name === fileName);
    if (index !== -1) {
      uploadedFiles.splice(index, 1);
      console.log("Файл удален из uploadedFiles:", uploadedFiles);
    }
  };

  const createFileElement = (file, previewElement) => {
    return new Promise((resolve, reject) => {
      const fileContainer = document.createElement("div");
      fileContainer.classList.add("preview-file-container");

      if (file.type.includes("image")) {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("preview-file-container");

        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.alt = "Uploaded Image";
        img.classList.add("preview-image");

        const controlContainer = document.createElement("div");
        controlContainer.classList.add("file-control-container");

        const imgDeleteButton = document.createElement("button");
        imgDeleteButton.type = "button";
        imgDeleteButton.classList.add("btn", "delete-button", "btn-busket");
        imgDeleteButton.innerHTML = '<i class="bi bi-trash-fill"></i>';

        const fileNamePlaceholder = document.createElement("div");
        fileNamePlaceholder.textContent = file.name;
        fileNamePlaceholder.classList.add("image-preview__file-name");

        createDeleteButton(imgDeleteButton, imgContainer, file.name, previewElement);

        controlContainer.appendChild(imgDeleteButton);
        controlContainer.appendChild(fileNamePlaceholder);

        imgContainer.appendChild(img);
        imgContainer.appendChild(controlContainer);
        previewElement.appendChild(imgContainer);
      } else if (file.type.includes("pdf")) {
        const pdfContainer = document.createElement("div");
        pdfContainer.classList.add("preview-file-container");

        const embed = document.createElement("embed");
        embed.src = URL.createObjectURL(file);
        embed.type = "application/pdf";
        embed.classList.add("preview-pdf");

        const controlContainer = document.createElement("div");
        controlContainer.classList.add("file-control-container");

        const pdfDeleteButton = document.createElement("button");
        pdfDeleteButton.type = "button";
        pdfDeleteButton.classList.add("btn", "delete-button", "btn-busket");
        pdfDeleteButton.innerHTML = '<i class="bi bi-trash-fill"></i>';

        const fileNamePlaceholder = document.createElement("div");
        fileNamePlaceholder.textContent = file.name;
        fileNamePlaceholder.classList.add("pdf-preview__file-name");

        createDeleteButton(pdfDeleteButton, pdfContainer, file.name, previewElement);

        controlContainer.appendChild(pdfDeleteButton);
        controlContainer.appendChild(fileNamePlaceholder);

        pdfContainer.appendChild(embed);
        pdfContainer.appendChild(controlContainer);
        previewElement.appendChild(pdfContainer);
      } else if (file.name.endsWith(".ifc")) {
        const ifcContainer = document.createElement("div");
        ifcContainer.classList.add("preview-file-container");

        const fileIcon = document.createElement("div");
        fileIcon.innerHTML = '<i class="bi bi-badge-3d"></i>';
        fileIcon.classList.add("file-icon");

        const controlContainer = document.createElement("div");
        controlContainer.classList.add("file-control-container");

        const ifcDeleteButton = document.createElement("button");
        ifcDeleteButton.type = "button";
        ifcDeleteButton.classList.add("btn", "delete-button", "btn-busket");
        ifcDeleteButton.innerHTML = '<i class="bi bi-trash-fill"></i>';

        const fileNamePlaceholder = document.createElement("div");
        fileNamePlaceholder.textContent = file.name;
        fileNamePlaceholder.classList.add("ifc-preview__file-name");

        createDeleteButton(ifcDeleteButton, ifcContainer, file.name, previewElement);

        controlContainer.appendChild(ifcDeleteButton);
        controlContainer.appendChild(fileNamePlaceholder);

        ifcContainer.appendChild(fileIcon);
        ifcContainer.appendChild(controlContainer);
        previewElement.appendChild(ifcContainer);
      }

      uploadedFiles.push({
        name: file.name,
        type: file.type,
        url: file.type.includes("image") ? URL.createObjectURL(file) : null,
      });

      console.log("Загружен новый файл:", uploadedFiles);

      resolve();
    });
  };

  for (const file of files) {
    const previewElement = file.type.includes("image") ? imagePreview : file.type.includes("pdf") ? pdfPreview : ifcPreview;
    createFileElement(file, previewElement)
      .then(() => updateDeleteButtonVisibility(previewElement))
      .catch((error) => console.error("Ошибка при загрузке файла:", error));
  }
});

const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function addTagEventListeners(containerId, inputId) {
  const tagsInput = document.getElementById(inputId);
  const tagsContainer = document.getElementById(containerId);
  const tags = tagsContainer.querySelectorAll(".form-tags__item");

  tags.forEach((tag) => {
    tag.addEventListener("click", () => {
      if (!tagsInput.value.includes(tag.textContent)) {
        tagsInput.value += (tagsInput.value ? ", " : "") + tag.textContent;
        tagsInput.classList.remove("error");
        const errorMessage = tagsInput.parentNode.querySelector(".error-message");
        if (errorMessage) {
          errorMessage.remove();
        }
      }
      tag.style.display = "none";
    });
  });
}

addTagEventListeners("softwareContainer", "softwareInput");
addTagEventListeners("tagsContainer", "tagsInput");

function validateForm() {
  const form = document.getElementById("myForm");
  const requiredInputs = form.querySelectorAll("[required]");
  let tagAdded = false;
  let isValid = true;

  if (!tagAdded && softwareInput.value.trim() === "") {
    softwareInput.classList.add("error");
    const errorMessage = document.createElement("span");
    errorMessage.textContent = "Ошибка";
    errorMessage.classList.add("error-message");
    softwareInput.parentNode.appendChild(errorMessage);
    formIsValid = false;
  }

  requiredInputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
    }
  });

  if (isValid) {
    form.submit();
  } else {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.style.display = "block";
  }
}

function removeError(input) {
  input.classList.remove("error");
  const errorMessage = input.parentNode.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach(function (input) {
    input.addEventListener("input", function () {
      removeError(input);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(function (errorMessage) {
      errorMessage.textContent = "";
    });
    const errorInputs = document.querySelectorAll(".error");
    errorInputs.forEach(function (errorInput) {
      errorInput.classList.remove("error");
    });

    let formIsValid = true;

    const nameInput = document.getElementById("nameInput");
    if (nameInput.value.trim() === "") {
      nameInput.classList.add("error");
      const errorMessage = document.createElement("span");
      errorMessage.textContent = "Ошибка";
      errorMessage.classList.add("error-message");
      nameInput.parentNode.appendChild(errorMessage);
      formIsValid = false;
    }

    const softwareInput = document.getElementById("softwareInput");
    if (softwareInput.value.trim() === "") {
      softwareInput.classList.add("error");
      const errorMessage = document.createElement("span");
      errorMessage.textContent = "Ошибка";
      errorMessage.classList.add("error-message");
      softwareInput.parentNode.appendChild(errorMessage);
      formIsValid = false;
    }

    const tagsInput = document.getElementById("tagsInput");
    if (tagsInput.value.trim() === "") {
      tagsInput.classList.add("error");
      const errorMessage = document.createElement("span");
      errorMessage.textContent = "Ошибка";
      errorMessage.classList.add("error-message");
      tagsInput.parentNode.appendChild(errorMessage);
      formIsValid = false;
    }

    if (formIsValid) {
      form.submit();
    }
  });
});
