import { Root as HastTree, Element as HastElement, Text } from "hast";
import { selectAll, select } from "hast-util-select";
import { toText } from "hast-util-to-text";

import {
  sectionHeadingClassName,
  specialHeadingsClassNames,
  sectionClassName,
} from "../cafe-config/cafeConstants";
import _ from "lodash";

interface CafeGenericSection extends HastElement {
  properties: {
    className: string[];
  };
  children: (HastElement | Text)[];
}

interface CafeItem extends CafeGenericSection {
  children: [CafeItemHeading, ...(HastElement | Text)[]];
}

interface CafeItemHeading extends HastElement {
  children: [Text];
}

class CafeHastHandler {
  hastTree?: HastTree;

  constructor(hastTree?: HastTree) {
    this.hastTree = hastTree;
  }

  setHastTree(hastTree: HastTree) {
    this.hastTree = hastTree;
  }

  getHastTree() {
    if (!this.hastTree) {
      throw new Error("Hast tree is not set.");
    }
    return this.hastTree;
  }

  #getNodes(selector: string | string[]) {
    const processedSelector = _.castArray(selector).join(", ");
    return selectAll(processedSelector, this.getHastTree());
  }

  getItems() {
    const itemsSelector = Object.values(specialHeadingsClassNames).map(
      (className) => `.${className}`
    );
    const itemsNodes = this.#getNodes(itemsSelector) as CafeItem[];
    const items = new Map(
      itemsNodes.map((node: CafeItem) => [toText(node.children[0]), node])
    );
    return items;
  }

  getSections() {
    const sectionNodes = this.#getNodes(
      `.${sectionClassName}`
    ) as CafeGenericSection[];
    const sections = new Map(
      sectionNodes.map((node: CafeGenericSection, index) => [
        getSectionHeading(node, index),
        node,
      ])
    );
    return sections;

    function getSectionHeading(node: CafeGenericSection, index: number) {
      const headingNode = select(`.${sectionHeadingClassName}`, node);
      const heading = `Section-${index + 1}${
        headingNode ? `: ${toText(headingNode)}` : ""
      }`;
      return heading;
    }
  }
}

export { CafeHastHandler };
