import { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { v2, v3 } from "@govtechsg/open-attestation";

import Layout from "@components/layout/Layout";
import StatusZone, { StatusProps } from "@components/figure/Status";
import Dropzone from "@components/verify/Dropzone";
import Verifier from "@components/verify/Verifier";
import { fetchAndDecryptDocument, getQueryAndHash } from "@utils/fetch-document";
import { verifyErrorHandler } from "@utils/error-handler";

const Verify: NextPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<StatusProps>({ type: "NIL" });
  const [document, setDocument] = useState<v2.WrappedDocument | v3.WrappedDocument | null>(null);

  /* Check for universal action in URL */
  useEffect(() => {
    (async () => {
      const encodedQ = router.query.q;
      const encodedHash = window.location.hash.substring(1) || undefined;

      // If no universal action in URL, skip function
      if (typeof encodedQ !== "string") {
        setDocument(null);
        return;
      }

      try {
        setStatus({ type: "LOADING", message: <>Loading document from action...</> });
        const { decodedQ, decodedHash } = getQueryAndHash(encodedQ, encodedHash);
        const document = await fetchAndDecryptDocument(decodedQ.payload.uri, decodedHash?.key || decodedQ.payload.key);
        setDocument(document);
        setStatus({ type: "NIL" });
      } catch (e) {
        console.error(e);
        setDocument(null);
        setStatus(verifyErrorHandler(e));
      }
    })();
  }, [router]);

  const handleDocumentDropped = useCallback((wrappedDocument) => {
    setDocument(wrappedDocument);
  }, []);

  return (
    <Layout>
      {<StatusZone {...status} />}
      {document === null && <Dropzone onDocumentDropped={handleDocumentDropped} />}
      {document !== null && <Verifier wrappedDocument={document} />}
    </Layout>
  );
};

export default Verify;
