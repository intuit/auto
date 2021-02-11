/* eslint-disable @typescript-eslint/no-var-requires */
const toc = require("@atomictech/rehype-toc");

const withIgnite = require("next-ignite/next")({
  repo: "intuit/auto",
  name: "auto",
  url: "https://intuit.github.io/auto",
  rehypePlugins: [[toc, { placeholder: "{{TOC}}" }]],
});

module.exports = withIgnite();
