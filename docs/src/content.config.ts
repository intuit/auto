import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { blogSchema } from "starlight-blog/schema";

import { pageId } from "./page-ids.mjs";

export const collections = {
  docs: defineCollection({
    loader: docsLoader({
      generateId: ({ entry, data }) => pageId(entry, data),
    }),
    schema: docsSchema({ extend: (context) => blogSchema(context) }),
  }),
};
