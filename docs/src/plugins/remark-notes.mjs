const warning = /^\s*(?:⚠️?|:warning:)\s*/u;
const info = /^\s*(?:ℹ️?|:information_source:)\s*/u;

/**
 * Turn the docs' blockquote notes into callouts.
 *
 * The content writes notes as plain blockquotes, some led by an emoji:
 * "> :warning: …" is a warning, anything else is an info note. This gives
 * each blockquote a `note` class (plus `note-warning`) for theme.css to draw,
 * and drops the leading emoji, since the callout has its own icon.
 *
 * Run it after remark-emoji, which has turned ":warning:" into "⚠️" by then;
 * the shortcode is matched as well so the order isn't load-bearing.
 */
export function remarkNotes() {
  const visit = (node) => {
    if (node.type === "blockquote") {
      console.log(node);
      const classes = ["note"];
      const first = node.children[0]?.children?.[0];

      if (first?.type === "text") {
        if (warning.test(first.value)) {
          classes.push("note-warning");
          first.value = first.value.replace(warning, "");
        } else {
          first.value = first.value.replace(info, "");
        }
      }

      node.data = {
        ...node.data,
        hProperties: { ...node.data?.hProperties, className: classes },
      };
    }

    node.children?.forEach(visit);
  };

  return visit;
}
