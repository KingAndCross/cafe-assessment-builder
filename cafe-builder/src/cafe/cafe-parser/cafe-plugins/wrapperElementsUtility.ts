import type { Plugin } from "unified";
import type { Element as HastElement, Root as HastRoot } from "hast";
import _ from "lodash";

import { v4 as uuidv4 } from "uuid";
import { visit } from "unist-util-visit";
import { h } from "hastscript";
import { SKIP } from "unist-util-visit";
import { matches } from "hast-util-select";

type WrapperOptions = {
  delimiterNodeSelector: string;
  closeNodeSelector: string;
  sectionSelector: string;
  keepClosingNode: boolean;
  alwaysOpen?: boolean;
  startOpen?: boolean;
  createId?: boolean;
};

const createWrapInSectionsPlugin = (
  options?: WrapperOptions,
  sectionsArrayModifier?: (e: HastElement[]) => void
): Plugin<[HastRoot], HastRoot> => {
  return () => (tree: HastRoot) => {
    const processedOptions = _initializeOptions(options);

    let sections: HastElement[] = [];

    const closeSection = _closeSectionFactory(processedOptions);

    sections = _processNodes(tree, processedOptions, closeSection);

    if (sectionsArrayModifier) {
      sectionsArrayModifier(sections);
    }
    tree.children = sections;
  };
};

function _initializeOptions(
  options: Partial<WrapperOptions> = {}
): WrapperOptions {
  const {
    sectionSelector = "section",
    keepClosingNode = true,
    alwaysOpen = false,
    startOpen = false,
    delimiterNodeSelector = "hr",
    closeNodeSelector = delimiterNodeSelector,
    createId = true,
  } = options;

  // If delimiterNodeSelector is an array, join it into a string
  const processedDelimiterNodeSelector = Array.isArray(delimiterNodeSelector)
    ? delimiterNodeSelector.join(", ")
    : delimiterNodeSelector;

  return {
    delimiterNodeSelector: processedDelimiterNodeSelector,
    sectionSelector,
    closeNodeSelector,
    keepClosingNode,
    createId,
    startOpen,
    alwaysOpen,
  };
}

function _processNodes(
  tree: HastRoot,
  options: WrapperOptions,
  closeSection: (section: HastElement[]) => HastElement
): HastElement[] {
  const sections: HastElement[] = [];
  let section: HastElement[] = [];

  let open = options.startOpen;

  visit(tree, "element", (node: HastElement) => {
    // handle the case when the section is closed
    if (!open) {
      if (matches(options.delimiterNodeSelector, node)) {
        section.push(node);
        open = true;
      } else {
        sections.push(node);
      }
      return SKIP;
    }

    // all below this assumes that the section is open
    if (matches(options.closeNodeSelector, node)) {
      sections.push(closeSection(section));
      if (options.keepClosingNode) {
        sections.push(node);
      }
      section = [];
      if (!options.alwaysOpen) {
        open = false;
      }
      return SKIP;
    }
    if (matches(options.delimiterNodeSelector, node)) {
      if (section.length > 0) {
        sections.push(closeSection(section));
      }
      section = [node];
      return SKIP;
    }
    section.push(node);
    return SKIP;
  });

  if (section.length > 0) {
    sections.push(closeSection(section));
    section = [];
  }
  return sections;
}

function _closeSectionFactory(options: WrapperOptions) {
  return function closeSection(section: HastElement[]) {
    const sectionSelectorAndId = options.createId
      ? `${options.sectionSelector}#cafe-${uuidv4()}`
      : options.sectionSelector;

    const sectionNode = h(sectionSelectorAndId, _.clone(section));
    return sectionNode;
  };
}

export { createWrapInSectionsPlugin };
