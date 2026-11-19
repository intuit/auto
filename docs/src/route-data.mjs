import { defineRouteMiddleware } from "@astrojs/starlight/route-data";

/** "/auto/docs/welcome/getting-started.html" → "/auto/docs/welcome/getting-started", "/auto/index.html" → "/auto/" */
const bare = (url) => url.replace(/\/index\.html$/, "/").replace(/\.html$/, "");

/**
 * Starlight takes a page's own URL from the file it is built to, so the
 * canonical link, og:url and Pagefind's search results end in ".html", unlike
 * every link on the site. Drop the extension, and tell Pagefind the bare URL.
 */
export const onRequest = defineRouteMiddleware(({ locals, url }) => {
  const { head } = locals.starlightRoute;

  for (const { tag, attrs } of head) {
    if (tag === "link" && attrs?.rel === "canonical") {
      attrs.href = bare(String(attrs.href));
    } else if (tag === "meta" && attrs?.property === "og:url") {
      attrs.content = bare(String(attrs.content));
    }
  }

  head.push({
    tag: "meta",
    attrs: { "data-pagefind-meta": `url:${bare(url.pathname)}` },
    content: "",
  });
});
