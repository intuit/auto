import { igniteComponents } from "next-ignite";
// eslint-disable-next-line import/no-extraneous-dependencies
import { defaultLabels } from "@auto-it/core/dist/semver";
import Highlight, { defaultProps } from "prism-react-renderer";

/** Render the current default labels in a details element */
export const DefaultLabelRenderer = () => (
  <details>
    <summary>Click here to see the default label configuration</summary>

    <Highlight
      Prism={defaultProps.Prism}
      code={JSON.stringify(defaultLabels, null, 2)}
      language="json"
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <igniteComponents.pre className={className} style={style}>
          <igniteComponents.code className="language-json">
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </igniteComponents.code>
        </igniteComponents.pre>
      )}
    </Highlight>
  </details>
);
