import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charset="utf-8" />
          <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta
            name="description"
            content="We help you to verify the certificates you have of anyone from any government agencies. All in one place."
          />

          <meta
            name="og:description"
            content="We help you to verify the certificates you have of anyone from any government agencies. All in one place."
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="%PUBLIC_URL%/share.jpg" />
          <meta property="og:image:alt" content="verify.gov.sg" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          <link rel="stylesheet" href="https://unpkg.com/sgds-govtech@1.3.14/css/sgds.css" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css" />
          <link
            href="https://fonts.googleapis.com/css2?family=Manjari:wght@400;700&family=Roboto:wght@400;700&display=swap"
            rel="stylesheet"
          />

          <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
          {/* 
    manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    
   */}
          <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
          {/* 
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
   */}
          <title>verify.gov.sg</title>
          {/* wogaa youpi .. :) */}
          {/* <% if (process.env.REACT_APP_WOGAA === 'production') { %>
    <script src="https://assets.wogaa.sg/scripts/wogaa.js"></script>
    <% } else { %>
    <script src="https://assets.dcube.cloud/scripts/wogaa.js"></script>
    <% } %> */}
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
