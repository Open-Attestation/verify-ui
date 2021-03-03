import React, { Fragment } from "react";
import { Link } from "react-router-dom";

export const serviceDoc = {
  "Description of Service": [
    <Fragment key={0}>
      <b>Name of Service</b>: Verify
    </Fragment>,
  ],
  "Nature of Service and Special Terms": [
    "This Service facilitates the verification of any Singapore government agency-issued OpenAttestation document.",
    "To use the Service, you will need to upload a document onto the site.",
    "Verification is performed by accessing the Ethereum Distributed Ledger via endpoints hosted by Infura",
    "GovTech is NOT responsible for the fulfilment and response of Infura, or of the functioning of any third party software or technology (such as Ethereum).",
    "Please note that separate terms (and not these Terms of Use) may govern the relationship between you and the document issuer/verifier/presenter, or any person accessing or providing a copy of the relevant document. For the avoidance of doubt, GovTech is not responsible for the contents of the document or the legal acceptability of the document. GovTech makes no representations or warranties concerning the powers or authority of the document issuer/verifier/presenter.",
  ],
  "Third party software/services": [
    <a href="www.google.com/policies/privacy/partners/" className="underline text-blue-600" key={0}>
      Google Analytics
    </a>,
    "WoGAA",
    <a href="https://infura.io/terms" className="underline text-blue-600" key={1}>
      Infura
    </a>,
    <a href="https://aws.amazon.com/service-terms/" className="underline text-blue-600" key={2}>
      Terms relating to AWS Lambda
    </a>,
    <a href="https://www.netlify.com/tos/" className="underline text-blue-600" key={3}>
      Netlify
    </a>,
    <Link to="/credits.pdf" target="_blank" download className="underline text-blue-600" key={4}>
      List of open source software
    </Link>,
  ],
};
