let SITE_URL = "https://www.verify.gov.sg"; // Default

// Env variables by Netlify (https://docs.netlify.com/configure-builds/environment-variables/#build-metadata)
if (process.env.CONTEXT !== "production" && process.env.DEPLOY_PRIME_URL) {
  SITE_URL = process.env.DEPLOY_PRIME_URL;
} else if (process.env.NODE_ENV !== "production") {
  SITE_URL = `http://localhost:3000`;
}

// Env variables by Netlify (https://docs.netlify.com/configure-builds/environment-variables/#git-metadata)
const COMMIT_REF = process.env.COMMIT_REF || "v1.0.0";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SITE_URL,
    COMMIT_REF,
    BUILD_DATE: new Date().toISOString(),
  },
};

module.exports = nextConfig;
