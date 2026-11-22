import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// The libraries and the built auto packages are CommonJS
const require = createRequire(import.meta.url);
const endent = require("endent").default;
const glob = require("fast-glob");

const root = path.resolve(import.meta.dirname, "../..");
const outDir = path.resolve(import.meta.dirname, "content/docs/generated");
const builtSemver = path.join(root, "packages/core/dist/semver.js");

/** A page's "# Heading" as a title Starlight can render as plain text */
const plainTitle = (heading) => heading.replace("# ", "").replace(/`/g, "");

/** Front matter for a page with this title */
const frontMatter = (title) => endent`
  ---
  title: ${JSON.stringify(title)}
  ---
`;

/** Leading text that picks a callout's type, dropped since the callout has a title */
const calloutMarkers = [
  ["warning", /^(?::warning:|⚠️?)\s*(?:warning[!:]\s*)?/iu],
  ["warning", /^warning[!:]\s*/iu],
  ["tip", /^(?:ℹ️?|:information_source:)\s*tip:\s*/iu],
  ["note", /^(?::exclamation:\s*)?(?:\*\*note\*\*|note):\s*/iu],
];

/**
 * Make every blockquote a callout, the way the hand-written pages write them:
 * "> [!note]" on a line of its own, then the quote. READMEs are read on
 * GitHub and npm too, so they keep plain blockquotes and get the marker
 * here. A leading ":warning:" or
 * "WARNING:" makes a warning and "ℹ️ Tip:" a tip; anything else is a note.
 * Quotes that are already callouts are left as they are.
 */
const toCallouts = (markdown) => {
  let inFence = false;
  let inQuote = false;

  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        inQuote = false;
        return line;
      }

      const quote = !inFence && line.match(/^(\s*>\s?)(.*)$/);

      if (!quote) {
        inQuote = false;
        return line;
      }

      if (inQuote) {
        return line;
      }

      inQuote = true;
      const [, prefix, text] = quote;

      if (text.startsWith("[!")) {
        return line;
      }

      const [type, marker] = calloutMarkers.find(([, m]) => m.test(text)) || [
        "note",
      ];
      const rest = marker ? text.replace(marker, "") : text;
      const body = marker ? rest.charAt(0).toUpperCase() + rest.slice(1) : rest;

      return `${prefix.trimEnd()} [!${type}]\n${prefix}${body}`;
    })
    .join("\n");
};

/**
 * Write a page, leaving it alone when it hasn't changed so `astro dev`
 * doesn't reload pages nobody touched. Returns whether it wrote.
 */
const writePage = (name, content) => {
  const file = path.join(outDir, name);

  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === content) {
    return false;
  }

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(file, content);
  return true;
};

/**
 * A plugin's page, read from its README: the plugin folder's name, the
 * README's "# Heading" as the title, and the rest as the page's markdown.
 * The heading is left out of the markdown since Starlight prints the title.
 *
 * @param {string} readme The README's absolute path
 * @returns {{ name: string, title: string, markdown: string }} e.g. name "npm", title "NPM Plugin"
 */
const readmePage = (readme) => {
  const content = fs.readFileSync(readme, "utf8");
  const name = path.basename(path.dirname(readme));
  // Images next to a README only exist in the repo, so point at GitHub's copy
  const [heading, ...readmeDocs] = content
    .replace(
      /(!\[[^\]]*\]\()(?![a-z][a-z\d+.-]*:|\/)([^)]+\))/gi,
      `$1https://github.com/intuit/auto/raw/main/plugins/${name}/$2`
    )
    .split("\n");

  return {
    name,
    title: plainTitle(heading),
    markdown: toCallouts(readmeDocs.join("\n")),
  };
};

/** Every plugin's README */
const findReadmes = () =>
  glob.sync(path.join(root, "plugins/**/README.md"), {
    ignore: "**/node_modules",
  });

/** Write a plugin's page from its README */
const writeReadmePage = (readme) => {
  const { name, title, markdown } = readmePage(readme);

  return writePage(`${name}.md`, `${frontMatter(title)}\n${markdown}`);
};

/**
 * A content loader with an entry per plugin README, for the pages
 * src/pages/plugins/[id].astro builds. Each entry's id is the plugin's
 * folder name, and its title and markdown are the same as its page in
 * src/content/docs/generated. In dev, an entry reloads when its README changes.
 *
 * @returns {import("astro/loaders").Loader} The loader, for content.config.ts
 */
export function pluginReadmes() {
  return {
    name: "plugin-readmes",
    load: async (context) => {
      const { config, store } = context;

      /** Store a README's entry, unless it is already stored as it is */
      const load = async (readme) => {
        const { name: id, title, markdown } = readmePage(readme);
        const digest = context.generateDigest({ title, markdown });

        if (store.get(id)?.digest === digest) {
          return;
        }

        store.set({
          id,
          data: await context.parseData({
            id,
            data: { title },
            filePath: readme,
          }),
          body: markdown,
          filePath: path.relative(fileURLToPath(config.root), readme),
          digest,
          rendered: await context.renderMarkdown(markdown, {
            fileURL: pathToFileURL(readme),
          }),
        });
      };

      const readmes = findReadmes();
      const ids = new Set(
        readmes.map((readme) => path.basename(path.dirname(readme)))
      );

      // Drop the entries of plugins that have gone since the last build
      for (const id of store.keys()) {
        if (!ids.has(id)) {
          store.delete(id);
        }
      }

      await Promise.all(readmes.map(load));

      context.watcher?.add(readmes);
      context.watcher?.on("change", (file) => {
        if (readmes.includes(file)) {
          return load(file);
        }
      });
    },
  };
}

/** Write the page that lists auto's default labels */
const writeDefaultLabelsPage = (defaultLabels) => {
  writePage(
    "defaultLabelsRenderer.mdx",
    `---
title: "Default Labels"
slug: docs/generated/defaultLabelsRenderer
---

Here is the default label configuration

\`\`\`json
${JSON.stringify(defaultLabels, null, 2)}
\`\`\`

`
  );
};

/** auto's default labels, read from the built core package */
const loadDefaultLabels = () => {
  if (!fs.existsSync(builtSemver)) {
    throw new Error(endent`
      The default labels page reads the built core package, but ${path.relative(root, builtSemver)} is missing.

      Run "pnpm build" at the repo root first.
    `);
  }

  return require(builtSemver).defaultLabels;
};

/**
 * Write every generated page into src/content/docs/generated: one per plugin
 * README, and the default labels.
 */
export function generatePages() {
  const readmes = findReadmes();

  readmes.forEach(writeReadmePage);
  writeDefaultLabelsPage(loadDefaultLabels());

  return { readmes };
}

/**
 * Generate the pages whenever `astro dev` or `astro build` starts, before the
 * content is read, and in dev rewrite a page when its README changes.
 * `astro sync`, which `pnpm typecheck` runs, doesn't need the pages and skips
 * this, so it works without the built packages.
 *
 * @returns {import("astro").AstroIntegration} The integration, for astro.config.ts
 */
export function generatedPages() {
  /** @type {ReturnType<typeof generatePages> | undefined} */
  let generated;

  return {
    name: "generated-pages",
    hooks: {
      "astro:config:setup": ({ command, logger }) => {
        if (command !== "dev" && command !== "build") {
          return;
        }

        generated = generatePages();
        logger.info(`Generated ${generated.readmes.length} plugin pages`);
      },
      "astro:server:setup": ({ server, logger }) => {
        if (!generated) {
          return;
        }

        const readmes = new Set(generated.readmes);

        /** Rewrite the page of a changed README */
        const regenerate = (file) => {
          if (!readmes.has(file) || !writeReadmePage(file)) {
            return;
          }

          logger.info(`Regenerated the page for ${path.relative(root, file)}`);
        };

        server.watcher.add(generated.readmes);
        server.watcher.on("add", regenerate);
        server.watcher.on("change", regenerate);
      },
    },
  };
}
