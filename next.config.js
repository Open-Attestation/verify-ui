let SITE_URL = "https://www.verify.gov.sg"; // Default

// Env variables by Netlify (https://docs.netlify.com/configure-builds/environment-variables/#build-metadata)
if (process.env.CONTEXT !== "production" && process.env.DEPLOY_PRIME_URL) {
  SITE_URL = process.env.DEPLOY_PRIME_URL;
} else if (process.env.NODE_ENV !== "production") {
  SITE_URL = `http://localhost:3000`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SITE_URL,
    WOGAA_ENV: process.env.WOGAA_ENV,
  },
};

module.exports = nextConfig;
