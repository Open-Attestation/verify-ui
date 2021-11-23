import "../index.css";
import Head from "next/head";
import { Layout } from "../src/components/shared/layout";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>verify.gov.sg</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
