// CAFE Custom Assessment Framework for Education

import type { Root as HastRoot } from "hast";

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
  hastTree: HastRoot | undefined;

  constructor(markdownContent?: string) {
    this.parser = new CafeParser();
    this.assembler = new CafeAssembler();
    this.fileHandler = new CafeFileHandler();
    this.markdownContent = markdownContent;
  }

  async initialize(markdownContent?: string) {
    if (!this.markdownContent && !markdownContent) {
      throw Error("No markdown content provided");
    }
    if (markdownContent) {
      this.markdownContent = markdownContent;
    }
    this.hastTree = await this.parser.parseToHastTree(this.markdownContent!);
  }

  async changeMarkdown(markdownContent: string) {
    this.markdownContent = markdownContent;
    this.hastTree = await this.parser.parseToHastTree(this.markdownContent);
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
    if (!this.hastTree) {
      throw new Error("Hast tree not initialized");
    }
    this.assembler.assemble(this.hastTree, assembleConfig);
  }

  async toHtml() {
    if (!this.hastTree) {
      throw new Error("Hast tree not initialized");
    }
    const hastTreeWithImages = await displayImageFromZip(
      this.hastTree,
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
