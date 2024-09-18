import { createWrapInSectionsPlugin } from "./wrapperElementsUtility";
import { isElement } from "hast-util-is-element";

const wrapAssessmentSections = createWrapInSectionsPlugin(
  {
    delimeterTagName: "hr",
    sectionSelector: "section.cafe-assessment-section",
    keepNode: false,
    createId: true,
  },
  (sections) => {
    sections[0].properties = { className: "header" };
  }
);

const wrapAssessmentItems = createWrapInSectionsPlugin(
  {
    delimeterTagName: "h3",
    closeTagName: "hr",
    sectionSelector: "section.cafe-assessment-item",
    keepNode: true,
    createId: true,
  },
  (sections) => {
    if (sections.length > 0) {
      const [header, ...items] = sections;

      if (header.children) {
        const elementChildren = header.children.filter((element) =>
          isElement(element)
        );

        sections.splice(0, sections.length, ...elementChildren, ...items);
      }
    }
  }
);

export { wrapAssessmentSections, wrapAssessmentItems };
