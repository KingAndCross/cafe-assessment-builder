import { CafeBuilder } from "./cafe/cafeBuilder";
import { markdownExample } from "./markdownExample";
import { getElements, createAssemblerConfig } from "./demoFunctions";
import { createSectionsCheckBoxes } from "./configComponentHtmlCreator";
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

  quizEditor.value = markdownExample;
  cafeQuiz = new CafeBuilder(markdownExample);
  await cafeQuiz.initialize();
  const parsedContent = await cafeQuiz.toHtml();
  quizPreview.innerHTML = String(parsedContent);

  selectTheme.addEventListener("change", function () {
    const themeLink = document.getElementById("theme-link")! as HTMLLinkElement;
    themeLink.href = `quiz-styles/${selectTheme.value}.css`;
  });

  showEditor.addEventListener("change", async () => {
    if (!showEditor.checked) {
      await cafeQuiz.changeMarkdown(quizEditor.value);
      const parsedContent = await cafeQuiz.toHtml();
      quizPreview.innerHTML = String(parsedContent);
    }
  });

  imagenesInput.addEventListener("change", async () => {
    const files = imagenesInput.files;
    if (files) {
      await cafeQuiz.fileHandler.addImages(files);
      displayImagesNames();
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
});

async function displayImagesNames() {
  const fileNames = await cafeQuiz.fileHandler.getFileNames("media");
  const fileNamesDisplay = document.getElementById("images-names-display");
  if (!fileNamesDisplay) return;
  fileNames.forEach((fileName) => {
    fileName = fileName.substring(0, 15) + "...";
    const li = document.createElement("li");
    li.textContent = fileName;
    fileNamesDisplay?.appendChild(li);
  });
}
