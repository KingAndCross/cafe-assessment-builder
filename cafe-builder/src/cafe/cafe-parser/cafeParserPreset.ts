import { Preset } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkAttributeList from "remark-attribute-list";

import {
  transformSpecialHeadings,
  transformSectionHeadings,
} from "./cafe-plugins/transformSpecialHeadings";
import {
  wrapAssessmentSections,
  wrapAssessmentItems,
} from "./cafe-plugins/wrapInSections";

const cafePlugins = [
  transformSpecialHeadings,
  transformSectionHeadings,
  wrapAssessmentItems,
  wrapAssessmentSections,
];

const preset: Preset = {
  plugins: [
    remarkParse,
    remarkGfm,
    remarkMath,
    remarkAttributeList,
    remarkRehype,
    ...cafePlugins,
    rehypeFormat,
    rehypeKatex,
    rehypeStringify,
  ],
};

export default preset;
