# Verify.gov.sg

Verify certificates from any government agencies.

## Prerequisites

NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in Netlify's runtime.

## Getting Started

### Ensure environment variables are set

To run locally, ensure the required environment variables are set in `.env`. Refer to [.env.example](.env.example):

```text
NEXT_PUBLIC_GTAG_ID=G-xxx
NEXT_PUBLIC_WOGAA_ENV=development
NEXT_PUBLIC_API_VERIFY_URL=https://stg.api.verify.gov.sg/verify
NEXT_PUBLIC_INFURA_API_KEY=xxx
NEXT_PUBLIC_NETWORK_NAME=goerli
NEXT_PUBLIC_WHITELISTED_ISSUERS=gov.sg,openattestation.com
```

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
