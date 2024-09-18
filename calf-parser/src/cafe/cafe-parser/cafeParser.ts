import type { Root as HastRoot } from "hast";

import { unified, Processor } from "unified";
import rehypeFormat from "rehype-format";

import preset from "./cafeParserPreset";
import { checkItemsAndFormat } from "./cafe-plugins/formatItems";

class CafeParser {
  private processor: Processor;
  private formater: Processor<
    undefined,
    HastRoot,
    undefined,
    undefined,
    undefined
  >;
  constructor() {
    this.processor = unified().use(preset);
    this.formater = unified().use(rehypeFormat);
  }

  async parseToHastTree(markdown: string): Promise<HastRoot> {
    const mdast = this.processor.parse(markdown);
    let hastTree = (await this.processor.run(mdast)) as HastRoot;
    checkItemsAndFormat(hastTree);
    return hastTree;
  }

  formatAndStringify(hastTree: HastRoot) {
    this.formater.run(hastTree);
    return this.processor.stringify(hastTree);
  }
}

export { CafeParser };
