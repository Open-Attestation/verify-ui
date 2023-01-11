import { useCallback, useEffect, useReducer, useState, Reducer } from "react";
import type { NextPage, InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { v2, v3 } from "@govtechsg/open-attestation";

import Layout from "@components/layout/Layout";
import Status, { StatusProps } from "@components/figure/StatusMessage";
import Dropzone from "@components/verify/Dropzone";
import { fetchAndDecryptDocument, decodeQueryAndHash } from "@utils/fetch-document";
import { verifyErrorHandler } from "@utils/error-handler";

const Verifier = dynamic(() => import("@components/verify/Verifier"), { ssr: false });

interface State {
  status: StatusProps;
  document: v2.WrappedDocument | v3.WrappedDocument | null;
  showDropzone: boolean;
}

type Action =
  | { type: "INITIAL" }
  | { type: "VERIFY_DOCUMENT"; document: State["document"] }
  | { type: "STATUS_MESSAGE"; status: StatusProps }
  | { type: "STATUS_ERROR"; status: StatusProps };

const defaultState: State = {
  status: { type: "NIL" },
  document: null,
  showDropzone: true,
};

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
  const initialState: State = {
    ...defaultState,
    showDropzone: props.universalActionType === "NONE",
    status:
      props.universalActionType !== "NONE"
        ? { type: "LOADING", message: <>Loading document from universal actions...</> }
        : { type: "NIL" },
  };
  const router = useRouter();
  const [{ status, document, showDropzone }, dispatch] = useReducer(reducer, initialState);

  /* Check for universal action in URL */
  useEffect(() => {
    (async () => {
      // If no universal action in URL, skip function
      if (props.universalActionType === "NONE") {
        dispatch({ type: "INITIAL" });
        return;
      }

      try {
        if (props.universalActionType === "HOSTED_URL") {
          const encodedQ = router.query.q?.toString() || "";
          const encodedHash = window.location.hash.substring(1) || undefined;
          const { decodedQ, decodedHash } = decodeQueryAndHash(encodedQ, encodedHash);
          const document = await fetchAndDecryptDocument(
            decodedQ.payload.uri,
            decodedHash?.key || decodedQ.payload.key
          );
          dispatch({ type: "VERIFY_DOCUMENT", document });
        } else {
          const encodedHash = window.location.hash.substring(1);
          // TODO: Tidy up with util functions
          const decodedHash = decodeURIComponent(encodedHash);
          const document = JSON.parse(decodedHash);
          dispatch({ type: "VERIFY_DOCUMENT", document });
        }
      } catch (e) {
        console.error(e);
        dispatch({ type: "INITIAL" });
        dispatch({ type: "STATUS_MESSAGE", status: verifyErrorHandler(e) });
      }
    })();
  }, [router]);

  const handleDocumentDropped = useCallback((wrappedDocument) => {
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
  type UniversalActionType = "NONE" | "HOSTED_URL" | "EMBEDDED_URI_FRAGMENT";

  const hasHostedUrl = typeof context.query.q === "string";
  const hasUriFragment = context.query.uriFragment === "true";

  const universalActionType: UniversalActionType = hasUriFragment
    ? "EMBEDDED_URI_FRAGMENT"
    : hasHostedUrl
    ? "HOSTED_URL"
    : "NONE";

  return {
    props: {
      universalActionType,
    },
  };
};

export default Verify;
