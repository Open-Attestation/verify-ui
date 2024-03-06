# Verify.gov.sg

Verify certificates from any government agencies.

## Prerequisites

NodeJS `v.18.17.0`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version.

## Getting Started

### Ensure environment variables are set

Environment variables are defined accordingly:

- `.env.development` (npm run dev)
- `.env.production` (npm start)

> **Note**: Non-`NEXT_PUBLIC_` environment variables are [only available in the Node.js environment](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser), meaning they aren't accessible to the browser.
>
> In order to make the value of an environment variable accessible in the browser, add a prefix the variable with `NEXT_PUBLIC_`.

To run locally (npm run dev), ensure the required environment variables are set correctly in `.env.development`:

```text
# Server-side only
CONTEXT=development
COMMIT_REF=v1.0.0

# Exposed to browsers
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GTAG_ID=G-xxx
NEXT_PUBLIC_WOGAA_ENV=$CONTEXT
NEXT_PUBLIC_API_VERIFY_URL=https://stg.api.verify.gov.sg/verify
NEXT_PUBLIC_INFURA_API_KEY=xxx
NEXT_PUBLIC_NETWORK_NAME=sepolia
NEXT_PUBLIC_WHITELISTED_ISSUERS=gov.sg,openattestation.com
```

> Learn more about loading environment variables in Next.js: <https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables>

### Run a local instance

```bash
npm i
npm run dev
```

### Run a production instance

```bash
npm run build
npm start
```
