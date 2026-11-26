import path from "node:path";

const contentDir = path.resolve(import.meta.dirname, "../content/docs");
const pluginsDir = path.resolve(import.meta.dirname, "../../../plugins");
const hasScheme = /^[a-z][a-z\d+.-]*:/i;

/**
 * The URL path of a page in src/content/docs: its `slug`, or else its file
 * path, the way Starlight serves it
 *
 * @param {string} filePath The markdown file's absolute path
 * @param {Record<string, unknown>} [frontmatter] The file's frontmatter
 * @returns {string} e.g. "docs/welcome/getting-started", "docs", or "" for the home page
 */
const contentPagePath = (filePath, frontmatter) => {
  if (typeof frontmatter?.slug === "string") {
    return frontmatter.slug;
  }

  return path
    .relative(contentDir, filePath)
    .replace(/\.mdx?$/, "")
    .replace(/(^|\/)index$/, "");
};

/**
 * The URL path of a plugin's README page, which src/pages/plugins/[id].astro
 * builds at "plugins/<name>"
 *
 * @param {string} filePath The markdown file's absolute path
 * @returns {string | undefined} e.g. "plugins/npm", or nothing for other files
 */
const readmePagePath = (filePath) => {
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
 * The validator works out a page's URL from its file path, or a `slug` in its
 * frontmatter. A README's file path isn't its page's URL, so each README also
 * gets its page's path as its slug, or the validator wouldn't know the plugin
 * pages at all.
 */
export function remarkSiteLinks({ base }) {
  const prefix = base.replace(/\/$/, "");

  return (tree, file) => {
    if (!file.path) {
      return;
    }

    const frontmatter = file.data.astro?.frontmatter;
    const readme = readmePagePath(file.path);
    const page = file.path.startsWith(contentDir)
      ? contentPagePath(file.path, frontmatter)
      : readme;

    if (page === undefined) {
      return;
    }

    if (readme && frontmatter && !frontmatter.slug) {
      frontmatter.slug = readme;
    }

    const from = new URL(`${prefix}/${page}`, "https://site.invalid");

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
