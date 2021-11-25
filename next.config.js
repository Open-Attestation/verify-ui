module.exports = {
  target: "serverless", // for https://github.com/netlify/netlify-plugin-nextjs/tree/v3#readme
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
};
