import type { Element as HastElement, Root as HastRoot } from "hast";
import { select, selectAll } from "hast-util-select";
import _ from "lodash";
import {
  ModifyItemsOptions,
  modifyItems,
  modifySections,
} from "./assembleUtils";

import { AssembleConfig } from "./cafeAssembler";
/* ============================================ */

type AssemblyHandler = (tree: HastRoot, value: any) => void;

/* ============================================ */

function shuffleItemChoices(element: HastElement) {
  const choices = select(".choices", element) as HastElement;
  if (choices) {
    const children = choices.children.filter(
      (child) => child.type === "element"
    );
    choices.children = _.shuffle(children);
  }
}

function selectRandomSubsetOfItems(
  element: HastElement,
  options: ModifyItemsOptions = {}
) {
  if (!options.sampleSize) {
    throw new Error("sampleSize option is required");
  }
  const items = selectAll(".item", element) as HastElement[];
  if (items) {
    element.children = _.sampleSize(items, options.sampleSize);
  }
}

/* =================================================== */

function randomizeItemsChoices(tree: HastElement | HastRoot) {
  modifyItems(tree, shuffleItemChoices);
}

function randomizeSections(tree: HastElement | HastRoot) {
  tree.children = _.shuffle(tree.children);
}

function sampleItemsInSections(
  tree: HastElement | HastRoot,
  sampleSize: number
) {
  modifySections(tree, selectRandomSubsetOfItems, { sampleSize: sampleSize });
}

function selectItemsInSections(
  tree: HastElement | HastRoot,
  itemsToKeep: number[][]
) {
  const sections = selectAll(".itemsGroup", tree) as HastElement[];
  sections.forEach((section, index) => {
    const items = selectAll(".item", section) as HastElement[];
    section.children = items.filter(
      (_, i) =>
        !itemsToKeep[index] ||
        itemsToKeep[index].length === 0 ||
        itemsToKeep[index].includes(i + 1)
    );
  });
}

const assemblyFunctions: Record<keyof AssembleConfig, AssemblyHandler> = {
  randomizeItemsChoices: randomizeItemsChoices,
  randomizeSections: randomizeSections,
  sampleSize: () => {},
  sampleItemsInSections: sampleItemsInSections,
  selectItemsInSections: selectItemsInSections,
};

export { assemblyFunctions };
