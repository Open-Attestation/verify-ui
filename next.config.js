/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SITE_URL:
      process.env.URL || // Obtained from Netlify (https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata)
      "https://www.verify.gov.sg", // Fallback
    WOGAA_ENV: process.env.WOGAA_ENV,
  },
};

module.exports = nextConfig;
