import { isElement } from "hast-util-is-element";
import { Element as HastElement } from "hast";
import _ from "lodash";
import { getOnlyElementsChildren } from "../../utils/utils";

export type StructureCondition = [
  (
    | string
    | string[]
    | { tagName?: string | string[]; className?: string | string[] }
  ),
  number
];

function checkElementStructure(
  parentElement: HastElement,
  structureCondition: StructureCondition
): boolean {
  let [selector, index] = structureCondition;
  const onlyElementsChildren = getOnlyElementsChildren(parentElement);
  index = index < 0 ? onlyElementsChildren.length + index : index;

  const element = onlyElementsChildren[index] as HastElement | undefined;
  if (!element) return false;
  if (typeof selector === "string" || Array.isArray(selector)) {
    return isElement(element, selector);
  } else if (typeof selector === "object" && selector !== null) {
    const { tagName, className } = selector;

    return isElement(element, (e: HastElement) => {
      const firstCondition = !tagName || isElement(e, tagName);
      const secondCondition = !className || classMatches(element, className);
      return firstCondition && secondCondition;
    });
  }

  function classMatches(element: HastElement, className: string | string[]) {
    if (!element.properties.className) {
      return false;
    }
    const elementClassName = Array.isArray(element.properties.className)
      ? element.properties.className
      : [element.properties.className];

    const conditionClassName = Array.isArray(className)
      ? className
      : [className];

    return _.intersection(elementClassName, conditionClassName).length !== 0;
  }
  return false;
}

export function checkSectionStructure(
  parentElement: HastElement,
  structureConditions: StructureCondition[]
): boolean {
  return structureConditions.every((condition) =>
    checkElementStructure(parentElement, condition)
  );
}
