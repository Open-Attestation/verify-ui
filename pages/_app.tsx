import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { config } from "@fortawesome/fontawesome-svg-core";

import { useGoogleAnalytics } from "@utils/google-analytics";
import defaultSeoConfig from "../next-seo.config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Script from "next/script";

config.autoAddCss = false;

const WOGAA_ENV = process.env.NEXT_PUBLIC_WOGAA_ENV === "production";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [path, setPath] = useState<string>("");

  useEffect(() => {
    const { asPath } = router;
    setPath(asPath);
  }, [router]);

  useGoogleAnalytics();
  return (
    <>
      {/* /verify has to scrub URI fragments before loading wogaa */}

      {path !== "/verify" &&
        (WOGAA_ENV ? (
          <Script src="https://assets.wogaa.sg/scripts/wogaa.js" async />
        ) : (
          <Script src="https://assets.dcube.cloud/scripts/wogaa.js" async />
        ))}
      <DefaultSeo {...defaultSeoConfig} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
