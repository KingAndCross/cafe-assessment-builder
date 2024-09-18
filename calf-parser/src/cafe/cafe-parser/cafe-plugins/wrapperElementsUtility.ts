import type { Plugin } from "unified";
import type { Element as HastElement, Root as HastRoot } from "hast";

import { v4 as uuidv4 } from "uuid";
import { visit } from "unist-util-visit";
import { h } from "hastscript";
import { SKIP } from "unist-util-visit";
import { matches } from "hast-util-select";

type WrapperOptions = {
  skipFirst?: boolean;
  delimeterTagName: string;
  closeTagName?: string;
  sectionSelector: string;
  keepNode: boolean;
  createId?: boolean;
};

const createWrapInSectionsPlugin = (
  options: WrapperOptions = {
    delimeterTagName: "hr",
    sectionSelector: "section",
    keepNode: true,
    createId: true,
  },
  sectionsArrayModifier?: (e: HastElement[]) => void
): Plugin<[HastRoot], HastRoot> => {
  return () => (tree: HastRoot) => {
    const { delimeterTagName = "hr", sectionSelector = "section" } = options;
    const closeTagName = options.closeTagName;
    let sections: HastElement[] = [];
    let currentSection: HastElement[] = [];
    let sectionSelectorAndId;

    visit(tree, "element", (node: HastElement) => {
      if (closeTagName && matches(closeTagName, node)) {
        processSection(node);
        currentSection = [];
        return SKIP;
      } else if (matches(delimeterTagName, node)) {
        if (currentSection.length > 0) {
          processSection();
          currentSection = options.keepNode ? [node] : [];
        } else if (options.keepNode) {
          currentSection.push(node);
        }
      } else {
        currentSection.push(node);
        return SKIP;
      }
    });

    if (currentSection.length > 0) {
      processSection();
    }
    sectionsArrayModifier?.(sections);
    tree.children = sections;

    function processSection(delimeterElement: HastElement | null = null) {
      sectionSelectorAndId = options.createId
        ? `${sectionSelector}#cafe-${uuidv4()}`
        : sectionSelector;
      sections.push(h(sectionSelectorAndId, currentSection));
      if (delimeterElement) {
        sections.push(delimeterElement);
      }
    }
  };
};

export { createWrapInSectionsPlugin };
export type { WrapperOptions };
