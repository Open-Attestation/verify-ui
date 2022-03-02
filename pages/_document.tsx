import { Html, Head, Main, NextScript } from "next/document";

const isProduction = process.env.NODE_ENV === "production";

export default function Document() {
  return (
    <Html>
      <Head>
        {isProduction ? (
          <script src="https://assets.wogaa.sg/scripts/wogaa.js" async></script>
        ) : (
          <script src="https://assets.dcube.cloud/scripts/wogaa.js" async></script>
        )}
        <link
          href="https://fonts.googleapis.com/css2?family=Manjari:wght@400;700&family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-background text-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
