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

              --color-gray-100: #f1eef0;
              --color-gray-200: #e3dde0;
              --color-gray-300: #d5cdd1;
              --color-gray-400: #c7bcc1;
              --color-gray-500: #b9abb2;
              --color-gray-600: #94898e;
              --color-gray-700: #6f676b;
              --color-gray-800: #4a4447;
              --color-gray-900: #252224;
              --color-gray-1000: #181617;
            }
          `}</style>
          <link
            rel="stylesheet"
            href="https://www.unpkg.com/prism-themes@1.5.0/themes/prism-coldark-cold.css"
          />
          <link
            rel="stylesheet"
            href="https://www.unpkg.com/prism-themes@1.5.0/themes/prism-coldark-dark.css"
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
