import { defineType, defineField } from "sanity";

/**
 * Category label shown on cards/slides (e.g. "News", "Blog",
 * "Announcement"). Keep the list short.
 */
export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
  ],
  preview: { select: { title: "title" } },
});
