const { generateHeaders } = require("./next.headers");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: false,
  output: "standalone",
  env: {
    // Computed env variables that are exposed to browser goes here:
    // https://nextjs.org/docs/app/api-reference/next-config-js/env
    BUILD_DATE: new Date().toISOString(),
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    // Other env variables can be set in .env or .env.production (https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#default-environment-variables)
  },
  headers: generateHeaders,
  transpilePackages: ["@govtechsg/sgds-masthead-react"],
};

module.exports = nextConfig;
