import post from "./post";
import author from "./author";
import category from "./category";
import blockContent from "./blockContent";
import seo from "./seo";

/**
 * Register every schema type. In a fresh `npm create sanity` project,
 * replace the generated schemaTypes/index.ts with this file (and drop
 * the sibling files in this folder alongside it).
 */
export const schemaTypes = [post, author, category, blockContent, seo];
