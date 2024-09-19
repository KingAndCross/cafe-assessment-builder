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

  const notNullElements = [
    quizEditor,
    quizPreview,
    imagenesInput,
    zipInput,
    downloadPDFBtn,
    downloadZipBtn,
    selectTheme,
    showEditor,
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
  };
}

export { getElements };
