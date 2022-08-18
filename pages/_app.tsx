import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { config } from "@fortawesome/fontawesome-svg-core";

import { useGoogleAnalytics } from "@utils/google-analytics";
import defaultSeoConfig from "../next-seo.config";
import "grapesjs/dist/css/grapes.min.css";

config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
  useGoogleAnalytics();
  return (
    <>
      <DefaultSeo {...defaultSeoConfig} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
