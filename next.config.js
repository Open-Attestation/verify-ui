const { generateHeaders } = require("./next.headers");

// Env variables by Netlify (https://docs.netlify.com/configure-builds/environment-variables/#git-metadata)
const COMMIT_REF = process.env.COMMIT_REF || "v1.0.0";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: false,
  output: "standalone",
  env: {
    CONTEXT: process.env.CONTEXT,
    SITE_URL: process.env.SITE_URL,
    COMMIT_REF,
    BUILD_DATE: new Date().toISOString(),
  },
  headers: generateHeaders,
  transpilePackages: ["@govtechsg/sgds-masthead-react"],
};

module.exports = nextConfig;
