import { hasProperty } from "hast-util-has-property";
import type { Element as HastElement, Root as HastRoot } from "hast";

import { isElement } from "hast-util-is-element";

export function hasClass(node: HastElement, className: string) {
  if (hasProperty(node, "className")) {
    const classNames = node.properties.className;

    if (Array.isArray(classNames)) {
      return classNames.includes(className);
    } else if (typeof classNames === "string") {
      return classNames.split(" ").includes(className);
    }
  }
  return false;
}

export function visitHastElementChildren(
  tree: HastElement | HastRoot,
  callback: (node: HastElement) => void
) {
  const children = tree && tree.children;
  let index = -1;

  if (!children) {
    throw new Error("Missing children in `parent` for `visit`");
  }

  const elementChildren = children.filter((child) =>
    isElement(child)
  ) as HastElement[];

  while (++index in elementChildren) {
    callback(elementChildren[index]);
  }
}

export function getOnlyElementsChildren(node: HastElement) {
  return node.children.filter((child) => isElement(child)) as HastElement[];
}
