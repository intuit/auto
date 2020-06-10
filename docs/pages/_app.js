import React from "react";
import App from "next/app";
import { MDXProvider } from "@mdx-js/react";
import { igniteComponents } from "next-ignite";

import "prismjs/themes/prism.css";
import "next-ignite/dist/main.css";
import "../css/syntax-highlighting-overrides.css";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <MDXProvider components={igniteComponents}>
        <Component {...pageProps} />
      </MDXProvider>
    );
  }
}

export default MyApp;
