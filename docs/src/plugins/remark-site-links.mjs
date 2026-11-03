import path from "node:path";

const contentDir = path.resolve(import.meta.dirname, "../content/docs");
const hasScheme = /^[a-z][a-z\d+.-]*:/i;

/** The URL path a content file is served at, e.g. "/auto/docs/welcome/getting-started" */
const pageUrl = (file, base) => {
  const slug = path
    .relative(contentDir, file)
    .replace(/\.mdx?$/, "")
    .replace(/(^|\/)index$/, "");

  return slug ? `${base}/${slug}` : `${base}/`;
};

/**
 * Rewrite content links the way the old Ignite site served them, so the
 * links validator can check every one:
 * - relative links resolve against the page's own URL
 * - root links ("/hook-overview.png") get the site base in front
 */
export function remarkSiteLinks({ base }) {
  const prefix = base.replace(/\/$/, "");

  return (tree, file) => {
    if (!file.path?.startsWith(contentDir)) {
      return;
    }

    const from = new URL(pageUrl(file.path, prefix), "https://site.invalid");

    const rewrite = (url, { relative }) => {
      if (!url || url.startsWith("#") || url.startsWith("//") || hasScheme.test(url)) {
        return url;
      }

      if (url.startsWith("/")) {
        return url === prefix || url.startsWith(`${prefix}/`) ? url : `${prefix}${url}`;
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
