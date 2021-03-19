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
              --color-gray-400: #c2bdbd;
              --color-gray-500: #9f9697;
              --color-gray-600: #706a69;
              --color-gray-700: #534e4f;
              --color-gray-800: #3c383b;
              --color-gray-900: #2e2c2f;
              --color-gray-1000: #181517;
            }
          `}</style>
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
