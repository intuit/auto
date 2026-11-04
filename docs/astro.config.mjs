import fs from "node:fs/promises";

import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import starlight from "@astrojs/starlight";
import starlightBlog from "starlight-blog";
import starlightImageZoom from "starlight-image-zoom";
import starlightLinksValidator from "starlight-links-validator";
import remarkEmoji from "remark-emoji";

import { remarkSiteLinks } from "./src/plugins/remark-site-links.mjs";

const base = "/auto";

/** Keep serving the blog's feed at the path the old site used */
const blogFeedAlias = {
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

/** A sidebar link to a generated command or plugin page */
const generated = (label, name) => ({ label, slug: `docs/generated/${name}` });

export default defineConfig({
  site: "https://intuit.github.io",
  base,
  // "docs/welcome/getting-started.html", like the old Next export, so GitHub
  // Pages serves every page both with and without the ".html"
  build: { format: "file" },
  trailingSlash: "never",
  // Blog post covers are hosted remotely and sized at build time
  image: { domains: ["images.unsplash.com", "cdn-images-1.medium.com"] },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkEmoji, [remarkSiteLinks, { base }]],
    }),
  },
  integrations: [
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
            { label: "Getting Started", slug: "docs/welcome/getting-started" },
            { label: "Merging Quickly", slug: "docs/welcome/quick-merge" },
          ],
        },
        {
          label: "Configuration",
          items: [
            { label: ".autorc", slug: "docs/configuration/autorc" },
            { label: "Plugins", slug: "docs/configuration/plugins" },
            { label: "Non-npm Usage", slug: "docs/configuration/non-npm" },
            {
              label: "Troubleshooting",
              slug: "docs/configuration/troubleshooting",
            },
          ],
        },
        {
          label: "Tool APIs",
          items: [
            {
              label: "Setup",
              items: [
                generated("auto init", "init"),
                generated("auto create-labels", "create-labels"),
                generated("auto info", "info"),
              ],
            },
            {
              label: "Publishing",
              items: [
                generated("auto version", "version"),
                generated("auto changelog", "changelog"),
                generated("auto release", "release"),
                generated("auto shipit", "shipit"),
                generated("auto latest", "latest"),
                generated("auto next", "next"),
                generated("auto canary", "canary"),
              ],
            },
            {
              label: "PR Interaction",
              items: [
                generated("auto label", "label"),
                generated("auto pr-status", "pr-status"),
                generated("auto pr-check", "pr-check"),
                generated("auto pr-body", "pr-body"),
                generated("auto comment", "comment"),
              ],
            },
          ],
        },
        {
          label: "Package Manager Plugins",
          items: [
            generated("Homebrew", "brew"),
            generated("Chrome Web Store", "chrome"),
            generated("Cocoapod", "cocoapods"),
            generated("Crates", "crates"),
            generated("Docker", "docker"),
            generated("Gem", "gem"),
            generated("Git Tag", "git-tag"),
            generated("Gradle", "gradle"),
            generated("Maven", "maven"),
            generated("NPM", "npm"),
            generated("sbt", "sbt"),
            generated("VSCode", "vscode"),
          ],
        },
        {
          label: "Functionality Plugins",
          items: [
            generated("All Contributors", "all-contributors"),
            generated("Amazon S3", "s3"),
            generated("Conventional Commits", "conventional-commits"),
            generated("Exec", "exec"),
            generated("First Time Contributor", "first-time-contributor"),
            generated("GitHub Pages", "gh-pages"),
            generated("Jira", "jira"),
            generated("Magic Zero", "magic-zero"),
            generated("Microsoft Teams", "microsoft-teams"),
            generated("Omit Commits", "omit-commits"),
            generated("Omit Release Notes", "omit-release-notes"),
            generated("PR Body Labels", "pr-body-labels"),
            generated("Protected Branch", "protected-branch"),
            generated("Released", "released"),
            generated("Slack", "slack"),
            generated("Twitter", "twitter"),
            generated("Upload Assets", "upload-assets"),
          ],
        },
        {
          label: "Plugin Authoring",
          items: [
            { label: "Writing Plugins", slug: "docs/plugins/writing-plugins" },
            {
              label: "Creating Publishing Plugins",
              slug: "docs/plugins/writing-publishing-plugins",
            },
            {
              label: "Hook APIs",
              items: [
                { label: "Overview", slug: "docs/plugins/hook-api-docs" },
                {
                  label: "Configuration Hooks",
                  slug: "docs/plugins/configuration-hooks",
                },
                { label: "Init Hooks", slug: "docs/plugins/init-hooks" },
                {
                  label: "Log Parser Hooks",
                  slug: "docs/plugins/log-parse-hooks",
                },
                {
                  label: "Changelog Hooks",
                  slug: "docs/plugins/changelog-hooks",
                },
                {
                  label: "Release Lifecycle Hooks",
                  slug: "docs/plugins/release-lifecycle-hooks",
                },
              ],
            },
          ],
        },
        {
          label: "Continuous Integration",
          items: [
            { label: "CircleCI", slug: "docs/build-platforms/circleci" },
            { label: "Travis CI", slug: "docs/build-platforms/travis" },
            {
              label: "GitHub Actions",
              slug: "docs/build-platforms/github-actions",
            },
            { label: "Jenkins 2", slug: "docs/build-platforms/jenkins" },
          ],
        },
      ],
    }),
    blogFeedAlias,
  ],
});
