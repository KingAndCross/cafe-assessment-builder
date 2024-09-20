// CAFE Custom Assessment Framework for Education
import { CafeHastHandler } from "./cafe-hast-tree-handler/cafeHastTreeHandler";
import { CafeParser } from "./cafe-parser/cafeParser";
import { CafeAssembler, AssembleConfig } from "./cafe-assembler/cafeAssembler";
import {
  CafeFileHandler,
  displayImageFromZip,
} from "./cafe-file-handler/cafeFileHandler";

class CafeBuilder {
  parser: CafeParser;
  assembler: CafeAssembler;
  fileHandler: CafeFileHandler;
  markdownContent?: string;
  hastTreeHandler: CafeHastHandler;

  constructor(markdownContent?: string) {
    this.parser = new CafeParser();
    this.assembler = new CafeAssembler();
    this.fileHandler = new CafeFileHandler();
    this.hastTreeHandler = new CafeHastHandler();
    this.markdownContent = markdownContent;
  }

  async initialize(markdownContent?: string) {
    await this.setHastTree(markdownContent);
  }

  async setHastTree(markdownContent?: string) {
    const markdownToParse = markdownContent ?? this.markdownContent;
    if (markdownToParse === undefined) {
      throw Error("No markdown content provided");
    }
    const newHastTree = await this.parser.parseToHastTree(markdownToParse);
    this.hastTreeHandler.setHastTree(newHastTree);
  }

  async changeMarkdown(markdownContent: string) {
    this.markdownContent = markdownContent;
    this.setHastTree(markdownContent);
  }

  async readZipFile(zipFile: File) {
    await this.fileHandler._readZipFile(zipFile);
    const markdownContent = await this.fileHandler.zip
      .file("quiz.md")
      ?.async("string");
    if (!markdownContent) {
      throw new Error("No markdown content found in zip file");
    }
    await this.initialize(markdownContent);
  }

  assemble(assembleConfig: AssembleConfig) {
    if (!this.hastTreeHandler) {
      throw new Error("Hast tree not initialized");
    }
    this.assembler.assemble(this.hastTreeHandler.getHastTree(), assembleConfig);
  }

  async toHtml() {
    if (!this.hastTreeHandler) {
      throw new Error("Hast tree not initialized");
    }
    const hastTreeWithImages = await displayImageFromZip(
      this.hastTreeHandler.getHastTree(),
      this.fileHandler.zip
    );
    const html = this.parser.formatAndStringify(hastTreeWithImages);
    return html;
  }
  async downloadZipFile(quizName?: string) {
    if (!this.markdownContent) {
      throw new Error("No markdown content provided");
    }
    quizName ??= "quiz";
    this.fileHandler._downloadZipFile(this.markdownContent, quizName);
  }
}

export { CafeBuilder };
