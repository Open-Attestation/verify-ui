import Script from "next/script";

const WOGAA_ENV = process.env.NEXT_PUBLIC_WOGAA_ENV === "production";

function WogaaScript() {
  return (
    <>
      {WOGAA_ENV ? (
        <Script src="https://assets.wogaa.sg/scripts/wogaa.js" async />
      ) : (
        <Script src="https://assets.dcube.cloud/scripts/wogaa.js" async />
      )}
    </>
  );
}

export default WogaaScript;
