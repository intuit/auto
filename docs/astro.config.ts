import fs from "node:fs/promises";

import type { AstroIntegration } from "astro";
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import starlight from "@astrojs/starlight";
import starlightBlog from "starlight-blog";
import starlightImageZoom from "starlight-image-zoom";
import starlightLinksValidator from "starlight-links-validator";
import remarkEmoji from "remark-emoji";
import rehypeCallouts from "rehype-callouts";

import { generatedPages } from "./src/generated-pages.mjs";
import { remarkSiteLinks } from "./src/plugins/remark-site-links.mjs";

const base = "/auto";

/** Icon for "[!note]" callouts: a circled "i", drawn in the callout's colour */
const noteIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';

/** Keep serving the blog's feed at the path the old site used */
const blogFeedAlias: AstroIntegration = {
  name: "blog-feed-alias",
  hooks: {
    "astro:build:done": async ({ dir }) => {
      await fs.copyFile(
        new URL("blog/rss.xml", dir),
        new URL("blog/feed.xml", dir)
      );
    },
  },
};

/** A sidebar link to an `auto` command's page */
const command = (name: string) => ({
  label: `auto ${name}`,
  slug: `docs/commands/${name}`,
});

/** A sidebar link to a plugin's page, generated from its README */
const plugin = (label: string, name: string) => ({
  label,
  slug: `docs/generated/${name}`,
});

/** The commands whose pages were generated into docs/generated before */
const movedCommands = [
  "init",
  "info",
  "create-labels",
  "label",
  "comment",
  "pr-check",
  "pr-status",
  "pr-body",
  "version",
  "changelog",
  "release",
  "shipit",
  "latest",
  "canary",
  "next",
];

export default defineConfig({
  site: "https://intuit.github.io",
  base,
  // "docs/welcome/getting-started.html", like the old Next export, so GitHub
  // Pages serves every page both with and without the ".html". Unlike "file",
  // "preserve" leaves the ".html" off the links Starlight writes.
  build: { format: "preserve" },
  trailingSlash: "never",
  // Links to the commands' old pages still land on them. Astro adds the base
  // to where a redirect is from, but not to where it goes.
  redirects: Object.fromEntries(
    movedCommands.map((name) => [
      `/docs/generated/${name}`,
      `${base}/docs/commands/${name}`,
    ])
  ),
  // Blog post covers are hosted remotely and sized at build time
  image: { domains: ["images.unsplash.com", "cdn-images-1.medium.com"] },
  // markdown: {
  //   processor: unified({
  //     remarkPlugins: [remarkEmoji, rehypeCallouts],
  //   }),
  // },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkEmoji, [remarkSiteLinks, { base }]],
      rehypePlugins: [
        [
          rehypeCallouts,
          // Notes use the design's circled "i" in place of the default pencil
          { callouts: { note: { indicator: noteIcon } } },
        ],
      ],
    }),
  },
  integrations: [
    // The plugin and default labels pages, written into src/content/docs/generated
    generatedPages(),
    starlight({
      title: "auto",
      description:
        "Generate releases based on semantic version labels on pull requests.",
      logo: {
        light: "./src/assets/logo-light.svg",
        dark: "./src/assets/logo-dark.svg",
        replacesTitle: true,
      },
      favicon: "/favicon.png",
      head: [
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: `${base}/favicon-dark.png`,
            media: "(prefers-color-scheme: dark)",
          },
        },
        {
          tag: "link",
          attrs: { rel: "manifest", href: `${base}/manifest.json` },
        },
        { tag: "meta", attrs: { name: "theme-color", content: "#7A0041" } },
        // Site type: DM Sans (body), DM Serif Display (landing headings),
        // JetBrains Mono (code)
        {
          tag: "link",
          attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" },
        },
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossorigin: true,
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap",
          },
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/intuit/auto",
        },
      ],
      customCss: ["./src/styles/theme.css"],
      markdown: {
        // The plugin pages render the READMEs in ../plugins, which need
        // Starlight's heading links and code markup like the docs pages
        processedDirs: ["../plugins"],
      },
      routeMiddleware: "./src/route-data.mjs",
      // The docs design has no "On this page" column
      tableOfContents: false,
      components: {
        MarkdownContent: "./src/components/overrides/MarkdownContent.astro",
        Hero: "./src/components/overrides/Hero.astro",
        Header: "./src/components/overrides/Header.astro",
      },
      plugins: [
        starlightBlog({
          postCount: Infinity,
          authors: {
            andrew: { name: "Andrew Lisowski" },
            adam: {
              name: "Adam Dierkens",
              url: "https://github.intuit.com/adierkens",
            },
          },
        }),
        starlightImageZoom(),
        starlightLinksValidator({ sameSitePolicy: "validate" }),
      ],
      sidebar: [
        {
          label: "Welcome",
          items: [
            { label: "Introduction", slug: "docs" },
            { autogenerate: { directory: "welcome" } },
          ],
        },
        {
          // A new plugin's page is generated from its README, but only shows
          // here once it's added to one of these lists
          label: "Plugins",
          items: [
            {
              label: "Package Managers",
              items: [
                plugin("Homebrew", "brew"),
                plugin("Chrome Web Store", "chrome"),
                plugin("Cocoapod", "cocoapods"),
                plugin("Crates", "crates"),
                plugin("Docker", "docker"),
                plugin("Gem", "gem"),
                plugin("Git Tag", "git-tag"),
                plugin("Gradle", "gradle"),
                plugin("Maven", "maven"),
                plugin("NPM", "npm"),
                plugin("sbt", "sbt"),
                plugin("Version File", "version-file"),
                plugin("VSCode", "vscode"),
              ],
            },
            {
              label: "Extra Functionality",
              items: [
                plugin("All Contributors", "all-contributors"),
                plugin("Amazon S3", "s3"),
                plugin("Conventional Commits", "conventional-commits"),
                plugin("Exec", "exec"),
                plugin("First Time Contributor", "first-time-contributor"),
                plugin("GitHub Pages", "gh-pages"),
                plugin("Jira", "jira"),
                plugin("Magic Zero", "magic-zero"),
                plugin("Microsoft Teams", "microsoft-teams"),
                plugin("Omit Commits", "omit-commits"),
                plugin("Omit Release Notes", "omit-release-notes"),
                plugin("PR Body Labels", "pr-body-labels"),
                plugin("Protected Branch", "protected-branch"),
                plugin("Released", "released"),
                plugin("Slack", "slack"),
                plugin("Twitter", "twitter"),
                plugin("Upload Assets", "upload-assets"),
              ],
            },
          ],
        },
        {
          label: "Configuration",
          items: [{ autogenerate: { directory: "configuration" } }],
        },
        {
          label: "CLI Commands",
          items: [
            {
              label: "Setup",
              items: [
                command("init"),
                command("create-labels"),
                command("info"),
              ],
            },
            {
              label: "Publishing",
              items: [
                command("version"),
                command("changelog"),
                command("release"),
                command("shipit"),
                command("latest"),
                command("next"),
                command("canary"),
              ],
            },
            {
              label: "PR Interaction",
              items: [
                command("label"),
                command("pr-status"),
                command("pr-check"),
                command("pr-body"),
                command("comment"),
              ],
            },
          ],
        },
        {
          label: "Plugin Authoring",
          items: [
            "docs/authoring/writing-plugins",
            "docs/authoring/writing-publishing-plugins",
            {
              label: "Hook APIs",
              items: [
                "docs/authoring/hook-api-docs",
                "docs/authoring/configuration-hooks",
                "docs/authoring/init-hooks",
                "docs/authoring/log-parse-hooks",
                "docs/authoring/changelog-hooks",
                "docs/authoring/release-lifecycle-hooks",
              ],
            },
          ],
        },
        {
          label: "Continuous Integration",
          items: [{ autogenerate: { directory: "build-platforms" } }],
        },
      ],
    }),
    blogFeedAlias,
  ],
});
