# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary:** an engineer who owns the release process for a library or monorepo. They come to the site comparing auto with other release tools (semantic-release, changesets, release-please), then use it to wire auto into CI and configure it. They work in any ecosystem auto publishes to. Non-npm users (Gradle, Maven, CocoaPods, Homebrew, Docker, crates, gems, sbt, VS Code and Chrome Web Store extensions) matter as much as npm users.

**Secondary:** plugin authors writing hooks into the release lifecycle, and contributors to auto itself.

Teams inside Intuit are not a separate audience. They read the same site as everyone else.

## Product Purpose

auto automates releases from pull request labels. When a PR with a semver label merges, auto calculates the version bump, writes the changelog, publishes the package and creates the GitHub release. It also works with pull requests directly: reading labels, setting statuses, checking for a semver label, commenting and updating the PR body.

The docs site at intuit.github.io/auto explains what auto does, takes a reader from a first visit to a working release in CI, and then serves as the reference for commands, configuration, plugins and hook APIs. It also hosts the auto blog.

Success means fewer setup questions arriving as GitHub issues: a reader can set up and configure auto from the docs alone.

## Positioning

Releases are driven by labels on pull requests, so contributors don't change how they write commits. This is the claim auto defends against commit-convention release tools.

Supporting it:

- Atomic commands: each command does one thing, and they compose to fit any build process.
- A plugin and hook system that reaches every step of a release.
- Release types for every situation: canary (per-PR previews), next (pre-releases from a branch) and latest. `auto shipit` picks the right one from context.

## Operating Context

- auto runs in CI (the docs cover GitHub Actions, CircleCI, Jenkins and Travis), but every command also works locally.
- The workflow happens on GitHub: open a pull request, add a label, merge, and CI releases. GitHub's PR, label, merge and release screens are where readers will recognise what the docs describe.
- Configuration lives in `.autorc`. Plugins are named there and take their own options.
- Readers arrive from the README, npm, GitHub issues and old links into the site, some dating from the 2021 site.

## Capabilities and Constraints

- The site is an Astro Starlight app, a private workspace package in `docs/`. CI builds it on every PR and deploys it to GitHub Pages from `main`, under the base path `/auto`.
- Every path in `docs/url-baseline.txt` must keep resolving, with and without `.html`. The build fails if one is missing. New pages are allowed.
- The build checks every internal link and anchor.
- Plugin pages are generated from each plugin's README, and the default-labels fragment from the core package, into `docs/src/content/docs/generated/`. That folder is gitignored and never edited by hand. The site doesn't change plugin READMEs to suit itself.
- No analytics or tracking scripts.
- Reading works without client-side JavaScript. There is no React or other client framework runtime.
- Search runs locally with Pagefind, not an external service.
- Light and dark themes, following the system setting by default.
- The layout is responsive, with a collapsible sidebar on small screens.
- Terminology: the product is `auto`. Commands are written `auto <command>` (for example `auto shipit`). The release types are canary, next and latest. Labels include major, minor, patch, `skip-release` and `release`. See the repo's `CONTEXT.md` for domain terms such as "options schema".

## Brand Commitments

- The name is **auto**, written in lowercase.
- The existing light, dark and monochrome logos (`docs/src/assets/`, `docs/public/`), the favicons and auto's maroon brand colour carry over.
- The footer credit reads "MIT License · Built at Intuit".
- Voice: plain, direct and a little cheeky ("Yup!", "Stop babysitting releases").
- The site makes no claim that auto is "actively maintained again", and doesn't frame the relaunch as a comeback.

## Evidence on Hand

- **Real sources for examples:** auto's own `CHANGELOG.md` and GitHub releases (latest: v11.3.6, Nov 14 2025), real PRs and contributors in intuit/auto, and the CLI's own output and command definitions. Terminal runs, changelog samples, version numbers, PR numbers and author names should come from these.
- **Plugin READMEs** in `plugins/*/README.md`, the source of the generated plugin pages.
- **Blog:** six posts in `docs/src/content/docs/blog/` by Andrew Lisowski and Adam Dierkens, including the origin story ("Death to Monotony").
- **Screenshots** in `docs/public/`: adding a label, a changelog example, a release example, PR and merge steps, next branches, the hook overview.
- **Not used:** download counts, adopter lists, testimonials or quotes. Future work must not invent them.
- **Known gap:** the home page's terminal run and changelog card use invented data: v11.2.0, PRs #2491, #2487 and #2483, and the date "Tue Nov 3 2026". The PRs are attributed to real contributors. Replace these with entries from a real auto release.

## Product Principles

1. **Answer setup questions before they become issues.** A page earns its place by getting a reader to a working, correctly configured release without having to ask.
2. **Every ecosystem is first-class.** Setup paths and examples don't assume npm. A Gradle, Maven, CocoaPods or Homebrew user gets an equally clear path.
3. **Show the real thing.** Examples come from auto's actual releases, changelogs and CLI, never invented data.
4. **Lead with labels.** The label-driven workflow, where contributors keep how they commit, is the claim. Everything else supports it.
5. **Links outlive redesigns.** Old URLs keep working, and plugin reference pages are generated from source so they can't drift.

## Accessibility & Inclusion

Target: WCAG 2.2 AA across the whole site, in both light and dark themes, including the home page's brand-coloured sections. Reading must keep working without JavaScript.
