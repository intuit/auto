/**
 * The id, and so the URL path, of a page in src/content/docs.
 *
 * The docs section's folders sit at the top of the collection but are served
 * under "/docs", the paths the old site used, so they don't need a second
 * "docs" folder of their own. Only the home page and the blog are served
 * where their files are.
 *
 * @param {string} entry The page's file path, relative to src/content/docs
 * @param {Record<string, unknown>} [frontmatter] A `slug` here is used as the id as it is
 * @returns {string} e.g. "docs/welcome/getting-started", "blog/v8" or "index"
 */
export function pageId(entry, frontmatter = {}) {
  if (typeof frontmatter.slug === "string" && frontmatter.slug) {
    return frontmatter.slug;
  }

  // Astro's default ids are lowercased too; file names are already kebab-case
  const path = entry
    .replace(/\.[^./]+$/, "")
    .replace(/(^|\/)index$/, "")
    .toLowerCase();

  if (!path) {
    return "index";
  }

  if (path === "blog" || path.startsWith("blog/")) {
    return path;
  }

  return `docs/${path}`;
}
