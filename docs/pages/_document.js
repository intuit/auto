import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <style>{`
            :root {
              --color-primary-100: #F3E6ED;
              --color-primary-200: #E1BFD1;
              --color-primary-300: #CF99B6;
              --color-primary-400: #AB4D7F;
              --color-primary-500: #870048;
              --color-primary-600: #7A0041;
              --color-primary-700: #51002B;
              --color-primary-800: #3D0020;
              --color-primary-900: #290016;

              --color-gray-100: #f6f7f5;
              --color-gray-200: #eaeae7;
              --color-gray-300: #dcd5d4;
              --color-gray-400: #c0aeb1;
              --color-gray-500: #9c8586;
              --color-gray-600: #735f5e;
              --color-gray-700: #53484a;
              --color-gray-800: #3c373a;
              --color-gray-900: #2e2c2f;
              --color-gray-1000: #181617;
            }
          `}</style>
          <link
            rel="stylesheet"
            href="https://www.unpkg.com/prismjs@1.19.0/themes/prism.css"
          />
          <link
            rel="stylesheet"
            href="https://www.unpkg.com/prismjs@1.19.0/themes/prism-tomorrow.css"
            media="(prefers-color-scheme: dark)"
          />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-142981718-4"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];

                function gtag() { dataLayer.push(arguments) }

                gtag('js', new Date());
                gtag('config', 'UA-142981718-4', {
                  anonymize_ip: true,
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
