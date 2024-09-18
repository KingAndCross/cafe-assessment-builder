import JSZip from "jszip";
import {
  addImagesToZip,
  displayImageFromZip,
  filterImages,
} from "./imageFunctions";

class CafeFileHandler {
  zip: JSZip;

  constructor() {
    this.zip = new JSZip();
    this.zip.folder("media");
  }

  async readZipFile(file: File) {
    const jszip = new JSZip();
    const arrayBuffer = await file.arrayBuffer();
    const zip = await jszip.loadAsync(arrayBuffer);
    this.zip = zip;
  }

  async getFileNames(): Promise<string[]> {
    const filenames: string[] = [];
    this.zip.forEach((_, file) => {
      filenames.push(file.name);
    });

    return filenames;
  }

  async addMarkdownFileToZip(
    markdownString: string,
    quizName: string = "quiz"
  ) {
    this.zip.file(`${quizName}.md`, markdownString);
  }

  async addImagesToZip(images: FileList) {
    const mediaFolder = this.zip.folder("media");
    if (!mediaFolder) {
      throw new Error("Failed to create media folder in zip file");
    }
    const imagePromises = Array.from(images).map(async (image) => {
      const arrayBuffer = await image.arrayBuffer();
      mediaFolder.file(image.name, arrayBuffer);
    });
    await Promise.all(imagePromises);
  }

  // TODO: decouple the blob creation and download so the blob can be used in other ways.
  async downloadZipFile(markdownString: string, quizName?: string) {
    this.addMarkdownFileToZip(markdownString, quizName);
    this.zip.generateAsync({ type: "blob" }).then(function (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quiz.zip";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }
}

export { CafeFileHandler, addImagesToZip, filterImages, displayImageFromZip };
