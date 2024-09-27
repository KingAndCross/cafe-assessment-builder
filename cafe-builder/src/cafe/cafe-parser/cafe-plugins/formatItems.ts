import { Element as HastElement, Root as HastRoot } from "hast";
import { checkSectionStructure } from "./checkSectionStructure";
import type { StructureCondition } from "./checkSectionStructure";
import { getOnlyElementsChildren } from "../../utils/utils";
import { h } from "hastscript";
import { selectAll } from "hast-util-select";
import _ from "lodash";
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
    parentElement.children = [...children];
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

        lastChildren.properties.className = _.castArray(
          lastChildren.properties.className || []
        ) as string[];
        lastChildren.properties.className.push(choicesClassName);
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
