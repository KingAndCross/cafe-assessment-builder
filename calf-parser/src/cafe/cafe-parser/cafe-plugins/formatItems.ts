import { Element as HastElement, Root as HastRoot } from "hast";
import { checkSectionStructure } from "./checkSectionStructure";
import type { StructureCondition } from "./checkSectionStructure";
import { getOnlyElementsChildren } from "../../utils/utils";
import { h } from "hastscript";
import { selectAll } from "hast-util-select";

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
  return formatItems(
    parentElement,
    [
      [{ className: "question" }, 0],
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
        lastChildren.properties.className = "calf-MC-item-choices";
      }
    }
  );
}

// constructed response (CR) items
function formatCRItems(parentElement: HastElement) {
  return formatItems(
    parentElement,
    [[{ className: ["medium-question", "long-question"] }, 0]],
    (children) => {
      const answerClass =
        children[0].properties.className === "medium-question"
          ? "medium-answer"
          : "long-answer";
      children.push(h(".answer-box", { className: answerClass }));
    }
  );
}

export function checkItemsAndFormat(parentElement: HastElement | HastRoot) {
  selectAll(".cafe-assessment-item", parentElement).forEach((question) => {
    formatMCItems(question);
    formatCRItems(question);
  });
}
