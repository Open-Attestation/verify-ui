/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    siteUrl:
      process.env.URL || // Obtained from Netlify (https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata)
      "https://www.verify.gov.sg", // Fallback
  },
};

module.exports = nextConfig;
