import React from "react";
import App from "next/app";
import { MDXProvider } from "@mdx-js/react";
import { igniteComponents } from "next-ignite";
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import "prismjs/themes/prism.css";
import "next-ignite/dist/main.css";
import "../css/syntax-highlighting-overrides.css";

// Tell Font Awesome to skip adding the CSS automatically since it's being imported above
config.autoAddCss = false;

const components = {
  ...igniteComponents,
  img: (props) => {
    if (props.alt && props.alt.includes("Logo")) {
      return <igniteComponents.img {...props} />;
    }

    return (
      <SimpleReactLightbox>
        <SRLWrapper
          options={{
            thumbnails: {
              showThumbnails: false,
            },
            buttons: {
              showAutoplayButton: false,
              showNextButton: false,
              showPrevButton: false,
            },
          }}
        >
          <igniteComponents.img
            {...props}
            style={{ ...props.style, cursor: "pointer" }}
          />
        </SRLWrapper>
      </SimpleReactLightbox>
    );
  },
};

class MyApp extends App {
  /** Attach docsearch */
  componentDidMount() {
    if (window.docsearch) {
      window.docsearch({
        apiKey: "9a3222c3fb6678852549109b167d0cef",
        indexName: "intuit_auto",
        inputSelector: "#search",
        debug: false,
      });
    } else {
      console.warn("Search has failed to load");
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <MDXProvider components={components}>
        <Component {...pageProps} />
      </MDXProvider>
    );
  }
}

export default MyApp;
