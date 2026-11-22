import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { blogSchema } from "starlight-blog/schema";

import { pluginReadmes } from "./generated-pages.mjs";
import { pageId } from "./page-ids.mjs";

export const collections = {
  docs: defineCollection({
    loader: docsLoader({
      generateId: ({ entry, data }) => pageId(entry, data),
    }),
    schema: docsSchema({ extend: (context) => blogSchema(context) }),
  }),
  // A page per plugin README, built by src/pages/plugins/[id].astro
  plugins: defineCollection({
    loader: pluginReadmes(),
    schema: z.object({ title: z.string() }),
  }),
};
