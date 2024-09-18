import { visitHastElementChildren } from "../utils/utils";
import type { Element as HastElement, Root as HastRoot } from "hast";

export interface ModifyItemsOptions {
  sampleSize?: number;
}

export const modifySections = (
  tree: HastElement | HastRoot,
  callback: (item: HastElement, options?: ModifyItemsOptions) => void,
  options?: ModifyItemsOptions
) => {
  visitHastElementChildren(tree, (section) => {
    callback(section, options);
  });
};

export const modifyItems = (
  tree: HastElement | HastRoot,
  callback: (item: HastElement, options?: ModifyItemsOptions) => void,
  options?: ModifyItemsOptions
) => {
  visitHastElementChildren(tree, (section) => {
    modifySections(section, callback, options);
  });
};
