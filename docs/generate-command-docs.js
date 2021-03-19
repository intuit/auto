#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { camelCase } = require("change-case");
const endent = require("endent").default;
const glob = require("fast-glob");
const docs = require("command-line-docs").default;
const { defaultLabels } = require("../packages/core/dist/semver");
const { commands } = require("../packages/cli/dist/parse-args");

try {
  fs.mkdirSync(path.join(__dirname, "./pages/docs/generated"));
} catch (error) {}

commands.forEach((command) => {
  const [title, ...docsForCommand] = docs(command)
    .replace(/{green \$} /g, "")
    .replace(/```sh\n/g, "```bash\n")
    .split("\n");
  const frontMatter = endent`
    ---
    title: ${title.replace("# ", "")}
    ---
  `.replace(/`/g, "\\`");

  const lines = [frontMatter, ...docsForCommand];
  const configOptions = (command.options || []).filter(
    (option) => option.config
  );
  const extra = path.join(__dirname, `./pages/docs/extras/${command.name}.md`);

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

  fs.writeFileSync(
    path.join(__dirname, `./pages/docs/generated/${command.name}.mdx`),
    lines.join("\n")
  );
});

glob
  .sync(path.join(__dirname, "../plugins/**/README.md"), {
    ignore: "**/node_modules",
  })
  .forEach((readme) => {
    console.log(readme);
    const content = fs.readFileSync(readme, "utf8");
    const [title, ...readmeDocs] = content.split("\n");
    const frontMatter = endent`
    ---
    title: ${title.replace("# ", "")}
    ---
  `.replace(/`/g, "\\`");
    const lines = [frontMatter, ...readmeDocs];
    const dir = path.dirname(readme).split("/");
    const name = dir[dir.length - 1];

    fs.writeFileSync(
      path.join(__dirname, `./pages/docs/generated/${name}.mdx`),
      lines.join("\n")
    );
  });

fs.writeFileSync(
  path.join(__dirname, "./pages/docs/generated/defaultLabelsRenderer.mdx"),
  `---
title: "Default Labels"
layout: 'none'
---

<details>

<summary>Click here to see the default label configuration</summary>

\`\`\`json
${JSON.stringify(defaultLabels, null, 2)}
\`\`\`

</details>
`
);
