import type { Root as HastRoot } from "hast";

import { assemblyFunctions } from "./assembleFunctions";

type AssembleConfig = {
  randomizeItemsChoices?: boolean;
  randomizeItemsInSections?: boolean;
  randomizeSections?: boolean;
  sampleSize?: number;
  selectSections?: (number | string)[];
  sampleItemsInSections?: number[] | Record<string, number>;
  selectItemsInSections?: number[][] | Record<string, number[]>;
};

class CafeAssembler {
  constructor() {}

  assemble(hastTree: HastRoot, assembleConfig: AssembleConfig) {
    Object.entries(assembleConfig).forEach(([key, value]) => {
      if (key in assemblyFunctions) {
        const handler = assemblyFunctions[key as keyof AssembleConfig];
        if (value) {
          handler(hastTree, value);
        }
      }
    });
  }
}

export { CafeAssembler };
export type { AssembleConfig };
