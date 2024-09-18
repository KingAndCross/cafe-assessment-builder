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
  markdownContent: string;
  hastTree: HastRoot | undefined;

  constructor(markdownContent: string) {
    this.parser = new CafeParser();
    this.assembler = new CafeAssembler();
    this.fileHandler = new CafeFileHandler();
    this.markdownContent = markdownContent;
  }

  async initialize() {
    this.hastTree = await this.parser.parseToHastTree(this.markdownContent);
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
}

export { CafeBuilder };
