import { createWrapInSectionsPlugin } from "./wrapperElementsUtility";
import {
  specialHeadingsClassNames,
  sectionHeadingClassName,
  sectionClassName,
} from "../../cafe-config/cafeConstants";

const itemsSelector = Object.values(specialHeadingsClassNames)
  .map((value) => `h3.${value}`)
  .join(", ");

const wrapAssessmentSections = createWrapInSectionsPlugin(
  {
    delimiterNodeSelector: `h2.${sectionHeadingClassName}`,
    closeNodeSelector: "hr",
    sectionSelector: `section.${sectionClassName}`,
    alwaysOpen: true,
    keepClosingNode: false,
    startOpen: true,
    createId: true,
  },
  (sections) => {
    sections[0].properties = { className: "cafe-header" };
  }
);

const wrapAssessmentItems = createWrapInSectionsPlugin(
  {
    delimiterNodeSelector: itemsSelector,
    closeNodeSelector: "hr, h2.cafe-section-heading",
    sectionSelector: "section.cafe-assessment-item",
    keepClosingNode: true,
    createId: true,
  },
  (_) => {}
);

export { wrapAssessmentSections, wrapAssessmentItems };
