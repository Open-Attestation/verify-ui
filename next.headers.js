/**
 * Note: Headers specified here will only work in (npm run dev) or (npm start)
 *
 * Since verify.gov.sg is deployed onto AWS CloudFront, production headers are overwritten/specified separately
 */

const prodCspValue = [
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.wogaa.sg https://*.dcube.cloud/ https://assets.adobedtm.com/ https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com",
  "object-src 'self'",
  "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/ https://unpkg.com/sgds-govtech@1.3.14/css/sgds.css https://fonts.googleapis.com/ https://assets.dcube.cloud/fonts/ https://assets.wogaa.sg/",
  "default-src 'self' https://*.dcube.cloud/ https://*.demdex.net/ https://cm.everesttech.net/ https://wogadobeanalytics.sc.omtrdc.net/ https://*.wogaa.sg",
  "base-uri 'self'",
  "form-action 'self'",
  "img-src 'self' https://wogadobeanalytics.sc.omtrdc.net/ https://cm.everesttech.net/ https://dpm.demdex.net/ www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' https://fonts.gstatic.com/s/ https://cdnjs.cloudflare.com/ajax/libs/font-awesome/ https://unpkg.com/sgds-govtech@1.3.14/ data: https://assets.dcube.cloud/fonts/ data: https://assets.wogaa.sg/fonts/",
  "manifest-src 'self'",
  "connect-src https://*.gov.sg/ https://dns.google/ https://mainnet.infura.io/v3/ https://sepolia.infura.io/v3/ https://dpm.demdex.net/ https://*.dcube.cloud/ https://*.wogaa.sg https://cm.everesttech.net/ https://wogadobeanalytics.sc.omtrdc.net/ https://*.notarise.io https://*.openattestation.com https://www.google-analytics.com",
  "frame-src https://*.openattestation.com https://*.gov.sg",
];

const prodVerifyCspValue = [
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.adobedtm.com/ https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com blob: https://*.wogaa.sg",
  "object-src 'self'",
  "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/ https://unpkg.com/sgds-govtech@1.3.14/css/sgds.css https://fonts.googleapis.com/ https://assets.dcube.cloud/fonts/ https://assets.wogaa.sg/",
  "default-src 'self' https://*.demdex.net/ https://cm.everesttech.net/ https://wogadobeanalytics.sc.omtrdc.net/ https://*.wogaa.sg",
  "base-uri 'self'",
  "form-action 'self'",
  "img-src 'self' https://wogadobeanalytics.sc.omtrdc.net/ https://cm.everesttech.net/ https://dpm.demdex.net/ www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' https://fonts.gstatic.com/s/ https://cdnjs.cloudflare.com/ajax/libs/font-awesome/ https://unpkg.com/sgds-govtech@1.3.14/ data: https://assets.dcube.cloud/fonts/ data: https://assets.wogaa.sg/fonts/",
  "manifest-src 'self'",
  "connect-src https://*.gov.sg/ https://dns.google/ https://mainnet.infura.io/v3/ https://sepolia.infura.io/v3/ https://dpm.demdex.net/ https://cm.everesttech.net/ https://wogadobeanalytics.sc.omtrdc.net/ https://*.notarise.io https://*.openattestation.com https://www.google-analytics.com https://*.wogaa.sg",
  "frame-src https://*.openattestation.com https://*.gov.sg",
];

const nonProdCspValue = [
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.wogaa.sg https://*.dcube.cloud/ https://assets.adobedtm.com/ https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com",
  "object-src 'self'",
  "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/ https://unpkg.com/sgds-govtech@1.3.14/css/sgds.css https://fonts.googleapis.com/ https://assets.dcube.cloud/fonts/ https://assets.wogaa.sg/",
  "default-src 'self' https://*.dcube.cloud/ https://*.demdex.net/ https://cm.everesttech.net/ https://wogadobeanalytics.sc.omtrdc.net/ https://*.wogaa.sg",
  "base-uri 'self'",
  "form-action 'self'",
  "img-src 'self' https://wogadobeanalytics.sc.omtrdc.net/ https://cm.everesttech.net/ https://dpm.demdex.net/ www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' https://fonts.gstatic.com/s/ https://cdnjs.cloudflare.com/ajax/libs/font-awesome/ https://unpkg.com/sgds-govtech@1.3.14/ data: https://assets.dcube.cloud/fonts/ data: https://assets.wogaa.sg/fonts/",
  "manifest-src 'self'",
  "connect-src https://gist.githubusercontent.com https://*.gov.sg/ https://dns.google/ https://mainnet.infura.io/v3/ https://sepolia.infura.io/v3/ https://dpm.demdex.net/ https://*.dcube.cloud/ https://*.wogaa.sg https://cm.everesttech.net/ https://wogadobeanalytics.sc.omtrdc.net/ https://*.openattestation.com https://www.google-analytics.com",
  "frame-src https://*.openattestation.com https://*.gov.sg",
];

const nonProdVerifyCspValue = [
  "frame-ancestors 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.adobedtm.com/ https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com blob: https://*.dcube.cloud",
  "object-src 'self'",
  "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com/ajax/libs/font-awesome/ https://unpkg.com/sgds-govtech@1.3.14/css/sgds.css https://fonts.googleapis.com/ https://assets.dcube.cloud/fonts/ https://assets.wogaa.sg/",
  "default-src 'self' https://*.demdex.net/ https://cm.everesttech.net/ https://wogadobeanalytics.sc.omtrdc.net/ https://*.dcube.cloud/",
  "base-uri 'self'",
  "form-action 'self'",
  "img-src 'self' https://wogadobeanalytics.sc.omtrdc.net/ https://cm.everesttech.net/ https://dpm.demdex.net/ www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' https://fonts.gstatic.com/s/ https://cdnjs.cloudflare.com/ajax/libs/font-awesome/ https://unpkg.com/sgds-govtech@1.3.14/ data: https://assets.dcube.cloud/fonts/ data: https://assets.wogaa.sg/fonts/",
  "manifest-src 'self'",
  "connect-src https://gist.githubusercontent.com https://*.gov.sg/ https://dns.google/ https://mainnet.infura.io/v3/ https://sepolia.infura.io/v3/ https://dpm.demdex.net/ https://cm.everesttech.net/ https://wogadobeanalytics.sc.omtrdc.net/ https://*.openattestation.com https://*.notarise.io https://www.google-analytics.com https://*.dcube.cloud",
  "frame-src https://*.openattestation.com https://*.gov.sg",
];

/** @type {import('next').NextConfig["headers"]} */
const generateHeaders = async () => {
  if (process.env.CONTEXT === "production") {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: prodCspValue.join("; "),
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        source: "/verify",
        headers: [
          {
            key: "Content-Security-Policy",
            value: prodVerifyCspValue.join("; "),
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  } else if (["deploy-preview", "branch-deploy", "staging"].includes(process.env.CONTEXT)) {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: nonProdCspValue.join("; "),
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/verify",
        headers: [
          {
            key: "Content-Security-Policy",
            value: nonProdVerifyCspValue.join("; "),
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  } else {
    return [];
  }
};

module.exports = { generateHeaders };
