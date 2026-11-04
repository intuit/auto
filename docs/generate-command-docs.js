#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { camelCase } = require("change-case");
const endent = require("endent").default;
const glob = require("fast-glob");
const docs = require("command-line-docs").default;

const builtEntries = [
  path.join(__dirname, "../packages/cli/dist/index.js"),
  path.join(__dirname, "../packages/core/dist/semver.js"),
];
const missing = builtEntries.filter((entry) => !fs.existsSync(entry));

if (missing.length) {
  console.error(endent`
    The docs generator reads the built auto packages, but these are missing:

    ${missing.map((entry) => `- ${path.relative(process.cwd(), entry)}`).join("\n")}

    Run "pnpm build" at the repo root first.
  `);
  process.exit(1);
}

const { defaultLabels } = require("../packages/core/dist/semver");
const { commands } = require("../packages/cli/dist");

const outDir = path.join(__dirname, "./src/content/docs/docs/generated");

/** Front matter with a title Starlight can render as plain text */
const frontMatter = (title) => endent`
  ---
  title: ${JSON.stringify(title.replace("# ", "").replace(/`/g, ""))}
  ---
`;

fs.mkdirSync(outDir, { recursive: true });

commands.forEach((command) => {
  const [title, ...docsForCommand] = docs(command)
    .replace(/{green \$} /g, "")
    .replace(/```sh\n/g, "```bash\n")
    .split("\n");
  const lines = [frontMatter(title), ...docsForCommand];
  const configOptions = (command.options || []).filter(
    (option) => option.config
  );
  const extra = path.join(__dirname, `./extras/${command.name}.md`);

  if (configOptions.length) {
    lines.push(endent`
      ## Configurable Options

      You can configure some of the options for the \`${
        command.name
      }\` command in the \`.autorc\`.

      ${configOptions.map((o) => `- \`${o.name}\``).join("\n")}

      **Example \`.autorc\`:**

      \`\`\`json
      {
        "${command.name}": {
          ${configOptions
            .map((o) => {
              let value;

              if (o.defaultValue) {
                value =
                  (o.type === String && `"${o.defaultValue}"`) ||
                  o.defaultValue;
              } else {
                value =
                  (o.type === String && '"string"') ||
                  (o.type === Boolean && true) ||
                  (o.type === Number && 123);
              }

              return `"${camelCase(o.name)}": ${value}`;
            })
            .join(",\n")}
        }
      }
      \`\`\`
    `);
  }

  if (fs.existsSync(extra)) {
    lines.push(fs.readFileSync(extra, "utf8"));
  }

  fs.writeFileSync(path.join(outDir, `${command.name}.md`), lines.join("\n"));
});

glob
  .sync(path.join(__dirname, "../plugins/**/README.md"), {
    ignore: "**/node_modules",
  })
  .forEach((readme) => {
    console.log(readme);
    const content = fs.readFileSync(readme, "utf8");
    const dir = path.dirname(readme).split("/");
    const name = dir[dir.length - 1];
    // Images next to a README only exist in the repo, so point at GitHub's copy
    const [title, ...readmeDocs] = content
      .replace(
        /(!\[[^\]]*\]\()(?![a-z][a-z\d+.-]*:|\/)([^)]+\))/gi,
        `$1https://github.com/intuit/auto/raw/main/plugins/${name}/$2`
      )
      .split("\n");
    const lines = [frontMatter(title), ...readmeDocs];

    fs.writeFileSync(path.join(outDir, `${name}.md`), lines.join("\n"));
  });

fs.writeFileSync(
  path.join(outDir, "defaultLabelsRenderer.mdx"),
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
