import { getCollection, type CollectionEntry } from "astro:content";

type Plugin = CollectionEntry<"plugins">;

/**
 * The plugins that publish the project somewhere. Every other plugin is
 * listed under "Extra Functionality", so a new plugin shows up there until
 * it's added here.
 */
const packageManagers = new Set([
  "brew",
  "chrome",
  "cocoapods",
  "crates",
  "docker",
  "gem",
  "git-tag",
  "gradle",
  "maven",
  "npm",
  "sbt",
  "version-file",
  "vscode",
]);

/** A plugin's name in the sidebar and overview: "NPM Plugin" → "NPM" */
export const pluginLabel = (plugin: Plugin) =>
  plugin.data.title.replace(/ plugin$/i, "");

/** Every plugin README, by label, in the groups the overview and sidebar list */
export async function getPluginGroups() {
  const plugins = (await getCollection("plugins")).sort((a, b) =>
    pluginLabel(a).localeCompare(pluginLabel(b))
  );

  return [
    {
      label: "Package Managers",
      lede: "Publish your project. Use one at a time.",
      plugins: plugins.filter((plugin) => packageManagers.has(plugin.id)),
    },
    {
      label: "Extra Functionality",
      lede: "Use these alongside a package manager: they adjust the version and changelog, upload assets, comment on pull requests and announce the release.",
      plugins: plugins.filter((plugin) => !packageManagers.has(plugin.id)),
    },
  ];
}

/**
 * The sidebar on the plugins overview and every plugin's page, in place of
 * the docs sidebar: the overview, then each group's plugins
 */
export const pluginsSidebar = (
  groups: Awaited<ReturnType<typeof getPluginGroups>>
) => [
  { label: "Plugins", items: [{ label: "Overview", link: "/plugins" }] },
  ...groups.map(({ label, plugins }) => ({
    label,
    items: plugins.map((plugin) => ({
      label: pluginLabel(plugin),
      link: `/plugins/${plugin.id}`,
    })),
  })),
];
