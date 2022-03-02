import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { config } from "@fortawesome/fontawesome-svg-core";

import defaultSeoConfig from "../next-seo.config";

config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...defaultSeoConfig} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
