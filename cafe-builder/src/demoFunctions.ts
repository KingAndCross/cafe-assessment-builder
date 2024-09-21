import { AssembleConfig } from "./cafe/cafe-assembler/cafeAssembler";

function getElements() {
  const quizEditor = document.getElementById(
    "quiz-editor"
  ) as HTMLTextAreaElement;
  const quizPreview = document.getElementById("cafe-quiz") as HTMLDivElement;
  const imagenesInput = document.getElementById(
    "images-input"
  ) as HTMLInputElement;
  const zipInput = document.getElementById(
    "upload-zip-btn"
  ) as HTMLInputElement;
  const downloadPDFBtn = document.getElementById(
    "download-pdf-btn"
  ) as HTMLButtonElement;
  const downloadZipBtn = document.getElementById(
    "download-cafe-zip-btn"
  ) as HTMLButtonElement;
  const selectTheme = document.getElementById(
    "current-theme"
  ) as HTMLSelectElement;
  const showEditor = document.getElementById("show-editor") as HTMLInputElement;
  const openAssembleBtn = document.getElementById(
    "open-assemble-btn"
  ) as HTMLButtonElement;
  const assembleBtn = document.getElementById(
    "assemble-btn"
  ) as HTMLButtonElement;

  const notNullElements = [
    quizEditor,
    quizPreview,
    imagenesInput,
    zipInput,
    downloadPDFBtn,
    downloadZipBtn,
    selectTheme,
    showEditor,
    assembleBtn,
    openAssembleBtn,
  ].some((el) => !el);

  if (notNullElements) {
    throw new Error("Missing elements");
  }
  return {
    quizEditor: quizEditor,
    quizPreview: quizPreview,
    imagenesInput: imagenesInput,
    zipInput: zipInput,
    downloadPDFBtn: downloadPDFBtn,
    downloadZipBtn: downloadZipBtn,
    selectTheme: selectTheme,
    showEditor: showEditor,
    assembleBtn: assembleBtn,
    openAssembleBtn: openAssembleBtn,
  };
}

function createAssemblerConfig() {
  const modal = document.getElementById("my_modal_1")!;

  const sectionCheckboxes: NodeListOf<HTMLInputElement> =
    modal.querySelectorAll('#sectionsCheckbox input[type="checkbox"]');
  const generalCheckboxes: NodeListOf<HTMLInputElement> =
    modal.querySelectorAll('#generalCheckbox input[type="checkbox"]');

  const checkedValues = {
    sectionsToShow: [] as string[],
    generalOptions: [] as string[],
  };

  // Get checked section checkboxes
  sectionCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedValues.sectionsToShow.push(checkbox.value);
    }
  });

  // Get checked general checkboxes
  generalCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedValues.generalOptions.push(checkbox.value);
    }
  });
  return setAssemblerConfig(checkedValues);
}

function setAssemblerConfig(checkboxValues: {
  sectionsToShow: string[];
  generalOptions: string[];
}): AssembleConfig {
  const config = {
    randomizeItemsChoices:
      checkboxValues.generalOptions.includes("randomChoices"),
    randomizeItemsInSections:
      checkboxValues.generalOptions.includes("randomOrder"),
    selectSections: checkboxValues.sectionsToShow,
  };
  return config;
}

export { getElements, createAssemblerConfig };
