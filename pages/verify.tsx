import { useCallback, useEffect, useReducer, useState, Reducer } from "react";
import type { NextPage, InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { v2, v3 } from "@govtechsg/open-attestation";

import Layout from "@components/layout/Layout";
import Status, { StatusProps } from "@components/figure/StatusMessage";
import Dropzone from "@components/verify/Dropzone";
import { fetchAndDecryptDocument, getQueryAndHash } from "@utils/fetch-document";
import { verifyErrorHandler } from "@utils/error-handler";
import { CodedError } from "@utils/coded-error";

const Verifier = dynamic(() => import("@components/verify/Verifier"), { ssr: false });

interface State {
  status: StatusProps;
  document: v2.WrappedDocument | v3.WrappedDocument | null;
  showDropzone: boolean;
}

const defaultState: State = {
  status: { type: "NIL" },
  document: null,
  showDropzone: true,
};

type Action =
  | { type: "INITIAL" }
  | { type: "VERIFY_DOCUMENT"; document: State["document"] }
  | { type: "STATUS_MESSAGE"; status: StatusProps }
  | { type: "STATUS_ERROR"; status: StatusProps };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "VERIFY_DOCUMENT":
      return { ...defaultState, document: action.document, showDropzone: false };
    case "STATUS_MESSAGE":
      const showDropzone = action.status.type !== "LOADING";
      return { ...state, status: action.status, showDropzone };
    case "STATUS_ERROR":
      return { ...defaultState, status: action.status };
    default:
      return defaultState;
  }
};

const Verify: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  const router = useRouter();
  const { hasUniversalAction, hasEmbedded } = props;
  const initialState: State = { ...defaultState, showDropzone: !hasUniversalAction && !hasEmbedded };
  const [{ status, document, showDropzone }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      // Possibility 1: There is an embedded OA in HTML
      if (hasEmbedded) {
        try {
          dispatch({
            type: "STATUS_MESSAGE",
            status: { type: "LOADING", message: <>Loading document from HTML element...</> },
          });
          // await new Promise((resolve) => setTimeout(resolve, 1000));
          const xOa = window.document.getElementsByTagName("x-oa")[0];
          if (!xOa) throw new CodedError("EmbedOaError", "Element 'x-oa' cannot be found");
          const encodedOa = xOa.getAttribute("data-encoded-oa-doc");
          if (!encodedOa) throw new CodedError("EmbedOaError", "Attribute 'data-encoded-oa-doc' cannot be found");
          const document = JSON.parse(decodeURIComponent(encodedOa));
          dispatch({ type: "VERIFY_DOCUMENT", document });
          return;
        } catch (e) {
          console.error(e);
          dispatch({ type: "INITIAL" });
          dispatch({ type: "STATUS_MESSAGE", status: verifyErrorHandler(e) });
          return;
        }
      }

      // Possibility 2: There is universal action in URL
      const encodedQ = router.query.q;
      if (typeof encodedQ === "string") {
        try {
          dispatch({
            type: "STATUS_MESSAGE",
            status: { type: "LOADING", message: <>Loading document from action...</> },
          });
          const encodedHash = window.location.hash.substring(1) || undefined;
          const { decodedQ, decodedHash } = getQueryAndHash(encodedQ, encodedHash);
          const document = await fetchAndDecryptDocument(
            decodedQ.payload.uri,
            decodedHash?.key || decodedQ.payload.key
          );
          dispatch({ type: "VERIFY_DOCUMENT", document });
          return;
        } catch (e) {
          console.error(e);
          dispatch({ type: "INITIAL" });
          dispatch({ type: "STATUS_MESSAGE", status: verifyErrorHandler(e) });
          return;
        }
      }

      // Possibility 3: User visits /verify directly, just show dropzone
      return dispatch({ type: "INITIAL" });
    })();
  }, [router]);

  const handleDocumentDropped = useCallback((wrappedDocument: State["document"]) => {
    dispatch({ type: "VERIFY_DOCUMENT", document: wrappedDocument });
  }, []);

  const handleDocumentError = useCallback((e: StatusProps) => {
    dispatch({ type: "STATUS_ERROR", status: e });
  }, []);

  return (
    <Layout>
      {<Status {...status} />}
      {showDropzone && <Dropzone onDocumentDropped={handleDocumentDropped} onDocumentError={handleDocumentError} />}
      {document !== null && <Verifier wrappedDocument={document} />}
    </Layout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const hasUniversalAction = typeof context.query.q === "string";
  const hasEmbedded = context.query.embedded === "true";

  return {
    props: {
      hasUniversalAction,
      hasEmbedded,
    },
  };
};

export default Verify;
