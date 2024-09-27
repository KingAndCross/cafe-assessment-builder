import type { Root as HastRoot, Element as HastElement } from "hast";
import { visitHastElementChildren } from "../../utils/utils";
import { isElement } from "hast-util-is-element";
import { matches } from "hast-util-select";
import _ from "lodash";
import {
  specialHeadingsClassNames,
  SpecialHeadings,
  sectionHeadingClassName,
} from "../../cafe-config/cafeConstants";

interface ParagraphNode extends HastElement {
  children: [{ type: "text"; value: string }];
}

const specialHeadings = specialHeadingsClassNames;

const transformSpecialHeadings = () => (tree: HastRoot) => {
  visitHastElementChildren(tree, (node) => {
    if (isElement(node, specialHeadingTest)) {
      handleSpecialHeadings(node as ParagraphNode);
    }
  });
};

/* 
Add class to the headings after the first hr. All the headings should be h2
 */
const transformSectionHeadings = () => (tree: HastRoot) => {
  let firstHrFound = false;
  visitHastElementChildren(tree, (node) => {
    // skip all until the first hr is found
    if (!firstHrFound) {
      if (node.tagName === "hr") {
        firstHrFound = true;
      }
      return;
    }
    // add the class to the headings and normalize them to h2
    if (matches("h1, h2", node)) {
      node.tagName = "h2";
      node.properties.className = _.castArray(
        node.properties.className || []
      ) as string[];
      node.properties.className.push(sectionHeadingClassName);
    }
  });
};

export { transformSpecialHeadings, transformSectionHeadings };

/* =============================== */

function startsWithKey(
  s: string,
  headingsCodes: Record<string, string>
): boolean {
  const codes = Object.keys(headingsCodes);
  return codes.some((code) => s.startsWith(code + " "));
}

const specialHeadingTest = (element: HastElement): boolean => {
  if (element.tagName === "p") {
    if (element.children[0].type !== "text") {
      return false;
    }
    return startsWithKey(element.children[0].value as string, specialHeadings);
  }

  return false;
};

function handleSpecialHeadings(paragraphNode: ParagraphNode) {
  let paragraphText = paragraphNode.children[0].value;
  const specialHeadingClass = Object.keys(specialHeadings).find((heading) =>
    paragraphText.startsWith(heading + " ")
  ) as keyof SpecialHeadings;
  if (specialHeadingClass) {
    paragraphNode.children[0].value = paragraphText.slice(
      specialHeadingClass.length
    );
    paragraphNode.tagName = "h3";

    paragraphNode.properties.className = _.castArray(
      paragraphNode.properties.className || []
    ) as string[];
    paragraphNode.properties.className.push(
      specialHeadings[specialHeadingClass]
    );
  }
}
