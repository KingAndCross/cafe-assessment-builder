export function createSectionsCheckBoxes(sections: string[]): HTMLElement {
  const sectionsCheckBoxes = document.createElement("div");
  sectionsCheckBoxes.innerHTML = sections
    .map((section) => checkBoxTemplate(section))
    .join("");

  return sectionsCheckBoxes;

  function checkBoxTemplate(sectionName: string) {
    return `
    <label class="label cursor-pointer">
    <span class="label-text">${sectionName}</span>
    <input type="checkbox" checked="checked" class="checkbox" />
    </label>
    `;
  }
}
