import { defineEcConfig } from "@astrojs/starlight/expressive-code";

const ink = "#1c0a12";
const hairline = "rgba(255, 255, 255, 0.08)";

/**
 * Code blocks, as drawn in the "Docs — Getting Started" design: one dark
 * "ink" block in both colour schemes, with a quiet title bar. The language
 * label and the copy button's place in that bar are set in
 * src/styles/theme.css.
 */
export default defineEcConfig({
  themes: ["github-dark"],
  useStarlightDarkModeSwitch: false,
  useStarlightUiThemeColors: false,
  customizeTheme(theme) {
    // Commands in pink, comments in a muted plum; the rest keeps the theme's
    // colours. Expressive Code still lifts anything below its contrast floor.
    theme.settings.push(
      {
        scope: [
          "entity.name.command",
          "entity.name.function",
          "support.function",
        ],
        settings: { foreground: "#f5b8d0" },
      },
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: { foreground: "#7c6470" },
      }
    );
    return theme;
  },
  styleOverrides: {
    borderRadius: "12px",
    borderWidth: "0px",
    borderColor: "transparent",
    codeBackground: ink,
    codeForeground: "#f1e3e9",
    codeFontFamily: "var(--sl-font-mono)",
    codeFontSize: "0.75rem",
    codeLineHeight: "1.7",
    codePaddingBlock: "0.875rem",
    codePaddingInline: "1.125rem",
    frames: {
      frameBoxShadowCssValue: "none",
      terminalBackground: ink,
      terminalTitlebarBackground: ink,
      terminalTitlebarForeground: "#b08a99",
      terminalTitlebarBorderBottomColor: hairline,
      terminalTitlebarDotsOpacity: "0",
      editorBackground: ink,
      editorTabBarBackground: ink,
      editorTabBarBorderBottomColor: hairline,
      editorActiveTabBackground: ink,
      editorActiveTabForeground: "#b08a99",
      editorActiveTabBorderColor: "transparent",
      editorActiveTabIndicatorTopColor: "transparent",
      editorActiveTabIndicatorBottomColor: "transparent",
      inlineButtonForeground: "#d9bfcb",
      inlineButtonBorderOpacity: "0",
      inlineButtonBackgroundIdleOpacity: "0",
    },
  },
});
