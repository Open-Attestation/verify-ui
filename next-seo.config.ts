import { DefaultSeoProps } from "next-seo";

const isProduction = process.env.NODE_ENV === "production";
const SITE_URL = isProduction
  ? process.env.siteUrl // See "next.config.js"
  : "http://localhost:3000";

const defaultSeo: DefaultSeoProps = {
  title: `Verify.gov.sg`,
  description: `We help you to verify the certificates you have of anyone from any government agencies. All in one place.`,
  openGraph: {
    type: `website`,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Verify.gov.sg",
      },
    ],
  },
  additionalLinkTags: [
    {
      rel: "apple-touch-icon",
      href: `${SITE_URL}/apple-touch-icon.png`,
      sizes: `180x180`,
    },
    {
      rel: `icon`,
      type: `image/png`,
      sizes: `32x32`,
      href: `${SITE_URL}/favicon-32x32.png`,
    },
    {
      rel: `icon`,
      type: `image/png`,
      sizes: `16x16`,
      href: `${SITE_URL}/favicon-16x16.png`,
    },
    {
      rel: `manifest`,
      href: `${SITE_URL}/manifest.json`,
    },
  ],
};

export default defaultSeo;
