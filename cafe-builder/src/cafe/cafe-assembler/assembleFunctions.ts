import type { Element as HastElement, Root as HastRoot } from "hast";
import { select, selectAll, matches } from "hast-util-select";
import { isElement } from "hast-util-is-element";
import _ from "lodash";
import { ModifyItemsOptions, modifySections } from "./assembleUtils";

import { AssembleConfig } from "./cafeAssembler";
import {
  choicesClassName,
  sectionClassName,
  sectionHeadingClassName,
} from "../cafe-config/cafeConstants";
/* ============================================ */

type AssemblyHandler = (tree: HastRoot, value: any) => void;

/* ============================================ */

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
  const choices = selectAll(`.${choicesClassName}`, tree) as HastElement[];
  if (!choices || choices.length === 0) {
    throw new Error("No choices found");
  }
  choices.forEach((choice) => {
    const children = choice.children.filter((e) => isElement(e));
    choice.children = _.shuffle(children);
  });
}

function randomizeItemsInSections(tree: HastElement | HastRoot) {
  const sections = selectAll(`.${sectionClassName}`, tree) as HastElement[];
  if (!sections || sections.length === 0) {
    throw new Error("No sections found");
  }
  sections.forEach((section) => {
    let items = selectAll(`.cafe-assessment-item`, section) as HastElement[];
    const heading = select(`.${sectionHeadingClassName}`, section);
    if (heading) {
      items = _.shuffle(items);
      section.children = [heading, ...items];
    } else {
      section.children = _.shuffle(items);
    }
  });
}

function selectSections(
  tree: HastElement | HastRoot,
  sectionsToKeep: (string | number)[]
) {
  if (!sectionsToKeep || sectionsToKeep.length === 0) {
    throw new Error("sectionsToKeep must be an array of section numbers");
  }
  let currSection = -1;
  tree.children.forEach((node) => {
    if (matches(`.${sectionClassName}`, node) && isElement(node)) {
      currSection++;
      if (!sectionsToKeep.includes(String(currSection))) {
        const classList = _.concat(
          _.castArray(node.properties.className),
          "cafe-hidden-element"
        ) as string[];
        node.properties.className = classList;
      } else {
        node.properties.className = _.castArray(
          node.properties.className
        ).filter((c) => c !== "cafe-hidden-element") as string[];
      }
    }
  });
}

function randomizeSections(_: HastElement | HastRoot) {
  console.log("por implementar");
  return;
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
  randomizeItemsInSections: randomizeItemsInSections,
  randomizeSections: randomizeSections,
  selectSections: selectSections,
  sampleSize: () => {},
  sampleItemsInSections: sampleItemsInSections,
  selectItemsInSections: selectItemsInSections,
};

export { assemblyFunctions };
