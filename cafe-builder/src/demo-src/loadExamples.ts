import { CafeBuilder } from "../cafe/cafeBuilder";

async function fetchMarkdownFile(markdownPath: string) {
  try {
    const response = await fetch(markdownPath); // Adjust the path to your file
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const markdownText = await response.text();
    return markdownText;
  } catch (error) {
    console.error("Error fetching the markdown file:", error);
  }
}

async function fetchImagesFromPublicDirectory(imagePaths: string[]) {
  const files = await Promise.all(
    imagePaths.map(async (path) => {
      const response = await fetch(path);
      const blob = await response.blob();
      const fileName = path.split("/").pop();
      const file = new File([blob], fileName!, { type: blob.type });
      return file;
    })
  );
  return files;
}

async function loadExamples(markdownPath: string, imgsPaths?: string[]) {
  const markdown = await fetchMarkdownFile(markdownPath);
  const quiz = new CafeBuilder(markdown);

  if (imgsPaths) {
    const images = await fetchImagesFromPublicDirectory(imgsPaths);
    await quiz.fileHandler.addImages(images);
  }
  return quiz;
}

export { loadExamples };
