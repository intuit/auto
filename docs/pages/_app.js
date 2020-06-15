import React from "react";
import App from "next/app";
import { MDXProvider } from "@mdx-js/react";
import { igniteComponents } from "next-ignite";
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";

import "prismjs/themes/prism.css";
import "next-ignite/dist/main.css";
import "../css/syntax-highlighting-overrides.css";

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
