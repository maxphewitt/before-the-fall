import { defineType, defineField } from "sanity";

/**
 * Reusable SEO object. Falls back to the post's title/excerpt/cover in
 * the app when these are left blank, so the agency only fills them when
 * they want to override.
 */
export default defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description:
        "Overrides the browser/Google title. Aim for ~50–60 characters. Blank = use the article title.",
      validation: (r) => r.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      description:
        "The search-result snippet. Aim for ~150–160 characters. Blank = use the excerpt.",
      validation: (r) => r.max(180),
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description:
        "Shown when the article is shared on social. 1200×630 works best. Blank = use the cover image.",
    }),
  ],
});
