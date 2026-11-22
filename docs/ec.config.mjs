import { defineEcConfig } from "@astrojs/starlight/expressive-code";

const ink = "#1c0a12";
const cream = "#fbf7f8";
const rose = "#ead9df";

/** A value per colour scheme: the dark "ink" block, or the light cream one */
const pick =
  (dark, light) =>
  ({ theme }) =>
    theme.type === "dark" ? dark : light;

const ground = pick(ink, cream);
const hairline = pick("rgba(255, 255, 255, 0.08)", rose);
const quiet = pick("#b08a99", "#5c4650");

/**
 * Code blocks, as drawn in the docs designs, with a quiet title bar.
 * - Dark mode: the dark "ink" block, no border.
 * - Light mode: the step cards' cream ground with a rose border, and the text
 *   recoloured to suit ("Docs — centered, no right sidebar").
 * The language label and the copy button's place in the title bar are set in
 * src/styles/theme.css.
 */
export default defineEcConfig({
  themes: ["github-dark", "github-light"],
  useStarlightUiThemeColors: false,
  customizeTheme(theme) {
    const dark = theme.type === "dark";

    // Plain code text: warm off-white on ink, ink on cream
    theme.fg = dark ? "#f1e3e9" : ink;
    theme.colors["editor.foreground"] = theme.fg;

    // Commands in the brand colour, comments in a muted plum; the rest keeps
    // the theme's colours. Expressive Code still lifts anything below its
    // contrast floor.
    theme.settings.push(
      {
        scope: [
          "entity.name.command",
          "entity.name.function",
          "support.function",
        ],
        settings: { foreground: dark ? "#f5b8d0" : "#7a0041" },
      },
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: { foreground: dark ? "#7c6470" : "#7a6570" },
      }
    );

    // On cream, a command's flags and arguments ("--help", "add") read as
    // plain ink, not the theme's blues, so a shell line is maroon then ink
    if (!dark) {
      theme.settings.push({
        scope: [
          "constant.other.option",
          "string.unquoted.argument.shell",
          "string.unquoted.shell",
        ],
        settings: { foreground: ink },
      });
    }

    return theme;
  },
  styleOverrides: {
    borderRadius: "12px",
    borderWidth: "1px",
    borderColor: pick("transparent", rose),
    codeBackground: ground,
    codeForeground: pick("#f1e3e9", ink),
    codeFontFamily: "var(--sl-font-mono)",
    codeFontSize: "0.75rem",
    codeLineHeight: "1.7",
    codePaddingBlock: "0.875rem",
    codePaddingInline: "1.125rem",
    frames: {
      frameBoxShadowCssValue: "none",
      terminalBackground: ground,
      terminalTitlebarBackground: ground,
      terminalTitlebarForeground: quiet,
      terminalTitlebarBorderBottomColor: hairline,
      terminalTitlebarDotsOpacity: "0",
      editorBackground: ground,
      editorTabBarBackground: ground,
      editorTabBarBorderBottomColor: hairline,
      editorActiveTabBackground: ground,
      editorActiveTabForeground: quiet,
      editorActiveTabBorderColor: "transparent",
      editorActiveTabIndicatorTopColor: "transparent",
      editorActiveTabIndicatorBottomColor: "transparent",
      inlineButtonForeground: pick("#d9bfcb", "#5c4650"),
      inlineButtonBorderOpacity: "0",
      inlineButtonBackgroundIdleOpacity: "0",
    },
  },
});
