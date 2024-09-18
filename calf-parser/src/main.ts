import { CafeBuilder } from "./cafe/cafeBuilder";
import markdownExample from "./markdownExample";

// npx tailwindcss -i ./src/styles/input.css -o ./src/styles/output.css --watch

const calfParser = new CafeBuilder(markdownExample);
const configAssemble = {
  selectItemsInSections: [[], [1, 2], [1], []],
};

await calfParser.initialize();
calfParser.assemble(configAssemble);
