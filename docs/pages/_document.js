import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { formatPath } from "next-ignite";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <script src={formatPath('attach-dark-mode.js')} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
