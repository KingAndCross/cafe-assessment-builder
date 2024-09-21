import { CafeBuilder } from "../cafe/cafeBuilder";

export function createSectionsCheckBoxes(cafeQuiz: CafeBuilder): void {
  const sectionsCheckboxContainer =
    document.getElementById("sectionsCheckbox")!;

  const sections = getSectionsNames(cafeQuiz);
  const sectionsCheckBoxes = document.createElement("div");
  sectionsCheckBoxes.innerHTML = sections
    .map((section, i) => checkBoxTemplate(section, i))
    .join("");

  sectionsCheckboxContainer.innerHTML = sectionsCheckBoxes.outerHTML;

  function getSectionsNames(cafeQuiz: CafeBuilder) {
    const sectionsNamesArray = Array.from(
      cafeQuiz.hastTreeHandler.getSections().keys()
    );
    return sectionsNamesArray;
  }

  function checkBoxTemplate(sectionName: string, i: number) {
    const name =
      sectionName.length > 25
        ? sectionName.substring(0, 22) + "..."
        : sectionName;

    return `
    <label class="label cursor-pointer">
    <span class="label-text">${name}</span>
    <input type="checkbox" value="${i}" checked="checked" class="checkbox" />
    </label>
    `;
  }
}
