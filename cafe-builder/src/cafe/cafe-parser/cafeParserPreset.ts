import { Preset } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkAttributeList from "remark-attribute-list";

import transformSpecialHeadings from "./cafe-plugins/transformSpecialHeadings";
import {
  wrapAssessmentSections,
  wrapAssessmentItems,
} from "./cafe-plugins/wrapInSections";

const preset: Preset = {
  plugins: [
    remarkParse,
    remarkAttributeList,
    remarkGfm,
    remarkMath,
    remarkRehype,
    transformSpecialHeadings,
    wrapAssessmentItems,
    wrapAssessmentSections,
    rehypeFormat,
    rehypeKatex,
    rehypeStringify,
  ],
};

export default preset;
