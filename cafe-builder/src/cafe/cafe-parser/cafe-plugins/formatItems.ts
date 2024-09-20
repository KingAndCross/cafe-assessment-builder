import { Element as HastElement, Root as HastRoot } from "hast";
import { checkSectionStructure } from "./checkSectionStructure";
import type { StructureCondition } from "./checkSectionStructure";
import { getOnlyElementsChildren } from "../../utils/utils";
import { h } from "hastscript";
import { selectAll } from "hast-util-select";

import {
  specialHeadingsClassNames,
  choicesClassName,
  answerBoxClassName,
} from "../../cafe-config/cafeConstants";

function formatItems(
  parentElement: HastElement,
  structureConditions: StructureCondition[],
  format: (element: HastElement[]) => void
) {
  if (checkSectionStructure(parentElement, structureConditions)) {
    let children = getOnlyElementsChildren(parentElement);
    format(children);
    parentElement.children = [...children]; // Ensure the parent children is updated
  }
}

function formatMCItems(parentElement: HastElement) {
  const genericQuestionClass = specialHeadingsClassNames["#?"];
  return formatItems(
    parentElement,
    [
      [{ className: genericQuestionClass }, 0],
      [["ol", "ul"], -1],
    ],
    (children) => {
      let lastChildren = children[children.length - 1];
      lastChildren.children = getOnlyElementsChildren(lastChildren);
      const conditions = [
        lastChildren.tagName === "ul",
        lastChildren.children.length >= 3,
        lastChildren.children.length <= 5,
      ];
      if (conditions.every((condition) => condition)) {
        lastChildren.tagName = "ol";
        lastChildren.properties.className = choicesClassName;
      }
    }
  );
}

// constructed response (CR) items
function formatCRItems(parentElement: HastElement) {
  const { "#??": mediumQuestion, "#???": longQuestion } =
    specialHeadingsClassNames;

  return formatItems(
    parentElement,
    [[{ className: [mediumQuestion, longQuestion] }, 0]],
    (children) => {
      children.push(h("div", { className: answerBoxClassName }));
    }
  );
}

export function checkItemsAndFormat(parentElement: HastElement | HastRoot) {
  selectAll(".cafe-assessment-item", parentElement).forEach((question) => {
    formatMCItems(question);
    formatCRItems(question);
  });
}
