type SpecialHeadings = {
  "#?": string;
  "#??": string;
  "#???": string;
};

/* these names are important because then we can use them in the css using the attribute selector [class*="cafe-question-heading-"]
 */

const specialHeadingsClassNames: SpecialHeadings = {
  "#?": "cafe-question-heading-generic",
  "#??": "cafe-question-heading-CR-short",
  "#???": "cafe-question-heading-CR-long",
};

const choicesClassName = "cafe-MC-item-choices";
const answerBoxClassName = "cafe-answerbox";

const sectionHeadingClassName = "cafe-section-heading";
const sectionClassName = "cafe-assessment-section";

export {
  specialHeadingsClassNames,
  choicesClassName,
  sectionHeadingClassName,
  answerBoxClassName,
  sectionClassName,
};
export type { SpecialHeadings };
