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
    showDropzone: !props.hasUniversalAction,
    status: props.hasUniversalAction
      ? { type: "LOADING", message: <>Loading document from action...</> }
      : { type: "NIL" },
  };
  const router = useRouter();
  const [{ status, document, showDropzone }, dispatch] = useReducer(reducer, initialState);

  /* Check for universal action in URL */
  useEffect(() => {
    (async () => {
      const encodedQ = router.query.q;
      const encodedHash = window.location.hash.substring(1) || undefined;

      // If no universal action in URL, skip function
      if (typeof encodedQ !== "string") {
        dispatch({ type: "INITIAL" });
        return;
      }

      try {
        const { decodedQ, decodedHash } = getQueryAndHash(encodedQ, encodedHash);
        const document = await fetchAndDecryptDocument(decodedQ.payload.uri, decodedHash?.key || decodedQ.payload.key);
        dispatch({ type: "VERIFY_DOCUMENT", document });
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
  const hasUniversalAction = typeof context.query.q === "string";

  return {
    props: {
      hasUniversalAction,
    },
  };
};

export default Verify;
