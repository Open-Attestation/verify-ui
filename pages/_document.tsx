import { Html, Head, Main, NextScript } from "next/document";

const WOGAA_ENV = process.env.NEXT_PUBLIC_WOGAA_ENV === "production";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {WOGAA_ENV ? (
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
