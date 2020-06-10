#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const {camelCase} = require('change-case')
const endent = require("endent").default;
const glob = require("fast-glob");
const docs = require("command-line-docs").default;
const { commands } = require("../packages/cli/dist/parse-args");

// const initCommands = [
//   endent`
//     # Initialization

//     \`auto\` provides some tools to quickly set up your project. If you do not want to use the interactive experience all these options can be configured via the [.autorc](./autorc.md) and most can be configure via CLI options.\n
//   `,
// ];

try {
  fs.mkdirSync(path.join(__dirname, "./pages/docs/generated"));
} catch (error) {}

commands.map((command) => {
  const lines = [docs(command).replace(/{green \$} /g, "")];
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


glob.sync(path.join(__dirname, '../plugins/**/README.md')).forEach(readme => {
  const content = fs.readFileSync(readme, "utf8")
  const dir = path.dirname(readme).split('/')
  const name = dir[dir.length - 1]

  fs.writeFileSync(
    path.join(__dirname, `./pages/docs/generated/${name}.mdx`),
    content
  );
})