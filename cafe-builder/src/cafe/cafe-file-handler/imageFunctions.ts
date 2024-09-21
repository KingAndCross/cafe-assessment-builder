import type { Root as HastRoot, Element as HastElement } from "hast";
import { filter } from "unist-util-filter";
import { selectAll } from "hast-util-select";
import JSZip from "jszip";
import _ from "lodash";

// TODO: fix the code to allow for repeated images

function filterImages(files: FileList) {
  const images = Array.from(files).filter((file) =>
    file.type.includes("image")
  );
  return images;
}

async function addImagesToZip(images: File[], zip: JSZip) {
  const mediaFolder = zip.folder("media");
  if (!mediaFolder) {
    throw new Error("Failed to create media folder in zip file");
  }
  const imagePromises = Array.from(images).map(async (image) => {
    const arrayBuffer = await image.arrayBuffer();
    mediaFolder.file(image.name, arrayBuffer);
  });
  await Promise.all(imagePromises);
  return zip;
}

// TODO: handle the revoking  URL.revokeObjectURL(imageUrl);

function extractImageNodes(hastTree: HastRoot): Map<string, HastElement> {
  const imgElementsMap = new Map<string, HastElement>();
  const imgElements = selectAll("img", hastTree) as HastElement[];
  imgElements.forEach((node) => {
    const src = node.properties?.src;
    const srcFileName =
      typeof src === "string" && src.split("/").pop()?.split(".")[0];
    if (srcFileName) {
      imgElementsMap.set(srcFileName, node);
    }
  });
  return imgElementsMap;
}

function inferMimeType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "bmp":
      return "image/bmp";
    case "webp":
      return "image/webp";
    default:
      return "application/octet-stream"; // Fallback for unknown types
  }
}

async function processZipImages(
  zip: JSZip,
  imgElementsMap: Map<string, HastElement>
): Promise<void> {
  const imagePromises: Promise<any>[] = [];

  zip.folder("media")?.forEach(async function (_, file) {
    const fileName = file.name.split("/").pop() || "";
    const fileNameWithoutExtension = fileName.split(".")[0] || "";
    const mimeType = inferMimeType(fileName);

    if (imgElementsMap.has(fileNameWithoutExtension)) {
      const imagePromise = file.async("blob").then((blob) => {
        const correctedBlob = new Blob([blob], { type: mimeType });
        const imageUrl = URL.createObjectURL(correctedBlob);

        const imgElement = imgElementsMap.get(fileNameWithoutExtension);
        if (imgElement) {
          imgElement.properties.src = imageUrl;
        }
      });
      imagePromises.push(imagePromise);
    }
  });

  await Promise.all(imagePromises);
}

function copyTree(tree: HastRoot): HastRoot {
  let newTree = filter(tree, (_) => {
    return true;
  }) as HastRoot;
  if (!newTree) {
    throw new Error("Failed to copy tree");
  }
  return newTree;
}

async function displayImageFromZip(
  hastTree: HastRoot,
  zip: JSZip
): Promise<HastRoot> {
  const newTree = copyTree(hastTree);
  const imgElementsMap = extractImageNodes(newTree);
  await processZipImages(zip, imgElementsMap);
  return newTree;
}

export { filterImages, addImagesToZip, displayImageFromZip };
