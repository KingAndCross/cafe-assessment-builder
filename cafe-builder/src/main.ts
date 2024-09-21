import { CafeBuilder } from "./cafe/cafeBuilder";
import { getElements, createAssemblerConfig } from "./demo-src/demoFunctions";
import { createSectionsCheckBoxes } from "./demo-src/configComponentHtmlCreator";
import { loadExamples } from "./demo-src/loadExamples";
// npx tailwindcss -i ./src/styles/input.css -o ./src/styles/output.css --watch

let cafeQuiz: CafeBuilder;

document.addEventListener("DOMContentLoaded", async () => {
  const {
    quizEditor,
    quizPreview,
    imagenesInput,
    zipInput,
    downloadPDFBtn,
    downloadZipBtn,
    showEditor,
    selectTheme,
    assembleBtn,
    openAssembleBtn,
  } = getElements();

  const newQuiz = await loadExamples("./examples/cultura-general.md");
  cafeQuiz = newQuiz;
  await cafeQuiz.initialize();
  const parsedContent = await cafeQuiz.toHtml();
  quizPreview.innerHTML = String(parsedContent);
  displayImagesNames();
  quizEditor.value = cafeQuiz.markdownContent!;

  selectTheme.addEventListener("change", function () {
    const themeLink = document.getElementById("theme-link")! as HTMLLinkElement;
    themeLink.href = `quiz-styles/${selectTheme.value}.css`;
  });

  quizEditor.addEventListener("change", async () => {
    await cafeQuiz.changeMarkdown(quizEditor.value);
  });

  showEditor.addEventListener("change", async () => {
    const parsedContent = await cafeQuiz.toHtml();
    quizPreview.innerHTML = String(parsedContent);
  });

  imagenesInput.addEventListener("change", async () => {
    const files = imagenesInput.files;
    if (files) {
      await cafeQuiz.fileHandler.addImages(files).then(() => {
        displayImagesNames();
      });
    }
  });

  zipInput.addEventListener("change", async () => {
    if (!zipInput.files?.[0]) return;
    await cafeQuiz.readZipFile(zipInput.files?.[0]);
    const parsedContent = await cafeQuiz.toHtml();
    quizPreview.innerHTML = String(parsedContent);
    quizEditor.value = cafeQuiz.markdownContent!;
    displayImagesNames();
  });

  openAssembleBtn.addEventListener("click", async () => {
    createSectionsCheckBoxes(cafeQuiz);
  });

  assembleBtn.addEventListener("click", async () => {
    let config = createAssemblerConfig();
    console.log(config);
    cafeQuiz.assemble(config);
    const parsedContent = await cafeQuiz.toHtml();
    quizPreview.innerHTML = String(parsedContent);
  });

  downloadZipBtn.addEventListener("click", async () => {
    cafeQuiz.downloadZipFile();
  });

  downloadPDFBtn.addEventListener("click", async () => {
    const rawHtml = String(await cafeQuiz.toHtml());
    cafeQuiz.fileHandler.downloadPDF(rawHtml, selectTheme.value);
  });

  const examplePaes = document.getElementById("example-paes");
  const exampleCultura = document.getElementById("example-cultura");

  examplePaes?.addEventListener("click", async () => {
    const newQuiz = await loadExamples("./examples/PAES-m1.md", [
      "./examples/paes/grafico-alt-1.png",
      "./examples/paes/grafico-alt-2.png",
      "./examples/paes/grafico-alt-3.png",
      "./examples/paes/grafico-alt-4.png",
      "./examples/paes/precios.png",
      "./examples/paes/pregunta-circulos-alt1.png",
      "./examples/paes/pregunta-circulos-alt2.png",
      "./examples/paes/pregunta-circulos-alt3.png",
      "./examples/paes/pregunta-circulos-alt4.png",
      "./examples/paes/pregunta-circulos.png",
      "./examples/paes/secuencia1.png",
    ]);
    cafeQuiz = newQuiz;
    await cafeQuiz.initialize();
    const parsedContent = await cafeQuiz.toHtml();
    quizPreview.innerHTML = String(parsedContent);
    displayImagesNames();
    quizEditor.value = cafeQuiz.markdownContent!;
  });

  exampleCultura?.addEventListener("click", async () => {
    const newQuiz = await loadExamples("./examples/cultura-general.md");
    cafeQuiz = newQuiz;
    await cafeQuiz.initialize();
    const parsedContent = await cafeQuiz.toHtml();
    quizPreview.innerHTML = String(parsedContent);
    displayImagesNames();
    quizEditor.value = cafeQuiz.markdownContent!;
  });
});

async function displayImagesNames() {
  const fileNamesDisplay = document.getElementById("images-names-display");

  const fileNames = await cafeQuiz.fileHandler.getFileNames("media");
  if (!fileNamesDisplay) return;
  fileNamesDisplay.innerHTML = "";
  fileNames.forEach((fileName) => {
    fileName = fileName.substring(0, 20) + "...";
    const li = document.createElement("li");
    li.classList.add("text-sm");
    li.textContent = fileName;
    fileNamesDisplay?.appendChild(li);
  });
}
