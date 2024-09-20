import { CafeBuilder } from "./cafe/cafeBuilder";
import { markdownExample } from "./markdownExample";
import { getElements } from "./getElements";
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
  } = getElements();

  const sectionsCheckboxContainer = document.getElementById("sectionsCheckbox");

  if (sectionsCheckboxContainer) {
    const sectionsCheckBoxes = createSectionsCheckBoxes([
      "section1",
      "section2",
      "section3",
      "section5",
    ]).innerHTML;

    sectionsCheckboxContainer.outerHTML = sectionsCheckBoxes;
  } else {
    console.error("Element with id 'sectionsCheckbox' not found.");
  }

  quizEditor.value = markdownExample;
  cafeQuiz = new CafeBuilder(markdownExample);
  await cafeQuiz.initialize();
  const parsedContent = await cafeQuiz.toHtml();
  quizPreview.innerHTML = String(parsedContent);

  console.log(cafeQuiz.hastTreeHandler.getItems());

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

  downloadZipBtn.addEventListener("click", async () => {
    cafeQuiz.downloadZipFile();
  });

  downloadPDFBtn.addEventListener("click", async () => {
    cafeQuiz.assemble({});
    const rawHtml = String(await cafeQuiz.toHtml());
    cafeQuiz.fileHandler.downloadPDF(rawHtml);
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
