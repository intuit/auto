import path from "node:path";

import { pageId } from "../page-ids.mjs";

const contentDir = path.resolve(import.meta.dirname, "../content/docs");
const pluginsDir = path.resolve(import.meta.dirname, "../../../plugins");
const hasScheme = /^[a-z][a-z\d+.-]*:/i;

/**
 * The id, and so the URL path, of the page a markdown file is built into: a
 * page in src/content/docs, or a plugin's README, which
 * src/pages/plugins/[id].astro builds at "plugins/<name>"
 *
 * @param {string} filePath The markdown file's absolute path
 * @param {Record<string, unknown>} [frontmatter] The file's frontmatter
 * @returns {string | undefined} e.g. "docs/welcome/getting-started" or "plugins/npm", or nothing for other files
 */
const sitePageId = (filePath, frontmatter) => {
  if (filePath.startsWith(contentDir)) {
    return pageId(path.relative(contentDir, filePath), frontmatter);
  }

  const readme = path
    .relative(pluginsDir, filePath)
    .match(/^(?!\.\.)([^/\\]+)[/\\]README\.md$/);

  return readme ? `plugins/${readme[1]}` : undefined;
};

/**
 * Rewrite the links in the docs pages and the plugin READMEs the way the old
 * Ignite site served them, so the links validator can check every one:
 * - relative links resolve against the page's own URL
 * - root links ("/hook-overview.png") get the site base in front
 *
 * The validator works out a page's URL from its file path, not from the
 * collection's ids, and only listens to a `slug` in the frontmatter. So each
 * page also gets its id as its slug, or the validator would look for the docs
 * section's pages outside "/docs", or not know the plugin pages at all.
 */
export function remarkSiteLinks({ base }) {
  const prefix = base.replace(/\/$/, "");

  return (tree, file) => {
    const frontmatter = file.data.astro?.frontmatter;
    const id = file.path && sitePageId(file.path, frontmatter);

    if (!id) {
      return;
    }

    // The validator would read a slug of "index" as "/index"
    if (frontmatter && !frontmatter.slug && id !== "index") {
      frontmatter.slug = id;
    }

    const from = new URL(
      id === "index" ? `${prefix}/` : `${prefix}/${id}`,
      "https://site.invalid"
    );

    const rewrite = (url, { relative }) => {
      if (
        !url ||
        url.startsWith("#") ||
        url.startsWith("//") ||
        hasScheme.test(url)
      ) {
        return url;
      }

      if (url.startsWith("/")) {
        return url === prefix || url.startsWith(`${prefix}/`)
          ? url
          : `${prefix}${url}`;
      }

      if (!relative) {
        return url;
      }

      const resolved = new URL(url, from);
      return `${resolved.pathname}${resolved.search}${resolved.hash}`;
    };

    const visit = (node) => {
      if (node.type === "link" || node.type === "definition") {
        node.url = rewrite(node.url, { relative: true });
      } else if (node.type === "image") {
        // Relative images were written for GitHub and are left as they are
        node.url = rewrite(node.url, { relative: false });
      }

      node.children?.forEach(visit);
    };

    visit(tree);
  };
}
