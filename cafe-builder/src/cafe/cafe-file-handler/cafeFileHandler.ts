import JSZip from "jszip";
import { displayImageFromZip, filterImages } from "./imageFunctions";

class CafeFileHandler {
  zip: JSZip;

  constructor() {
    this.zip = new JSZip();
    this.zip.folder("media");
  }

  async _readZipFile(file: File) {
    const jszip = new JSZip();
    const arrayBuffer = await file.arrayBuffer();
    const zip = await jszip.loadAsync(arrayBuffer);
    this.zip = zip;
  }

  async getFileNames(
    folder?: string,
    relative: boolean = true
  ): Promise<string[]> {
    const filenames: string[] = [];
    const directory = folder ? this.zip.folder(folder) : this.zip;
    if (!directory) {
      throw new Error("Failed to find folder in zip file");
    }
    directory.forEach((_, file) => {
      filenames.push(file.name);
    });
    if (relative) {
      return filenames.map((filename) => filename.split("/").pop() || filename);
    }
    return filenames;
  }

  async addMarkdownFileToZip(
    markdownString: string,
    quizName: string = "quiz"
  ) {
    this.zip.file(`${quizName}.md`, markdownString);
  }

  async addImages(images: FileList) {
    const mediaFolder = this.zip.folder("media");
    if (!mediaFolder) {
      throw new Error("Failed to create media folder in zip file");
    }
    const imagePromises = Array.from(images).map(async (image) => {
      const arrayBuffer = await image.arrayBuffer();
      const imageName = image.name.replace(/[^a-zA-Z0-9._]/g, "_");
      console.log(imageName);
      mediaFolder.file(imageName, arrayBuffer);
    });
    await Promise.all(imagePromises);
  }

  // TODO: decouple the blob creation and download so the blob can be used in other ways.
  async _downloadZipFile(markdownString: string, quizName: string) {
    this.addMarkdownFileToZip(markdownString, quizName);
    this.zip.generateAsync({ type: "blob" }).then(function (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${quizName}.zip`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  downloadPDF(rawHtml: string, cssStyle?: string) {
    const hideFrame = document.createElement("iframe");
    hideFrame.style.display = "none";
    document.body.appendChild(hideFrame);
    const frameDoc = hideFrame.contentWindow?.document;
    if (frameDoc) {
      // Inject HTML content
      frameDoc.open();
      frameDoc.write(`
          <html>
            <head>
            </head>
            <body>
              <div class='cafe-quiz'>
                ${rawHtml}
              </div>
                ${this.#generateCafeFooter()}
              </body>
          </html>
        `);

      this.#handleStyle(frameDoc, cssStyle);

      frameDoc.close();

      // Trigger print once content is loaded
      hideFrame.contentWindow?.focus();
      hideFrame.contentWindow?.print();
    }
  }

  // Todo: improve
  #generateCafeFooter() {
    const specialFooter = `
    <div style='display:flex; gap: 0.2em' class='special-footer'>
     <p style='font-size:0.7rem'>Creado con CAFE </p>
     <img src="/logo-cafe-small.png" alt="Cafe Logo" />  
    </div>
`;
    return "";
  }

  #handleStyle(iframeDoc: Document, cssStyle?: string) {
    const themeNames = !cssStyle
      ? ["default-theme"]
      : ["default-theme", cssStyle];

    themeNames.forEach((themeName) => {
      const cssLink = iframeDoc.createElement("link");
      cssLink.href = `src/styles/quiz-styles/${themeName}.css`;
      cssLink.rel = "stylesheet";
      cssLink.type = "text/css";
      iframeDoc.head.appendChild(cssLink);
    });

    const cssLink = iframeDoc.createElement("link");
    cssLink.href =
      "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    iframeDoc.head.appendChild(cssLink);
  }
}

export { CafeFileHandler, filterImages, displayImageFromZip };
