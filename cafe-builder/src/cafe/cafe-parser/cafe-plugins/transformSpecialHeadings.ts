import type { Root as HastRoot, Element as HastElement } from "hast";
import { visitHastElementChildren } from "../../utils/utils";
import { isElement } from "hast-util-is-element";

interface ParagraphNode extends HastElement {
  children: [{ type: "text"; value: string }];
}

type SpecialHeadings = {
  "#?": string;
  "#??": string;
  "#???": string;
  "#!": string;
};

const specialHeadings: SpecialHeadings = {
  "#?": "question",
  "#??": "medium-question",
  "#???": "long-question",
  "#!": "indication",
};

const transformSpecialHeadings = () => (tree: HastRoot) => {
  visitHastElementChildren(tree, (node) => {
    if (isElement(node, specialHeadingTest)) {
      handleSpecialHeadings(node as ParagraphNode);
    }
  });
};

export default transformSpecialHeadings;

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
    paragraphNode.properties.className = specialHeadings[specialHeadingClass];
  }
}
