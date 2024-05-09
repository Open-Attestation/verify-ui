import { useCallback, useEffect, useReducer, Reducer } from "react";
import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { v2, v3 } from "@govtechsg/open-attestation";

import Layout from "@components/layout/Layout";
import Status, { StatusProps } from "@components/figure/StatusMessage";
import Dropzone from "@components/verify/Dropzone";
import { fetchAndDecryptDocument, decodeQueryAndHash, decodeUriFragment } from "@utils/fetch-document";
import { verifyErrorHandler } from "@utils/error-handler";
import { getUniversalActionType } from "@utils/get-universal-action-type";
import { useUrlParamsThenScrubUrl } from "@utils/use-frag-then-scrub-url";
import WogaaScript from "@components/layout/WogaaScript";
import { isNotariseSpmTransientStorage, isNotariseTransientStorage } from "@utils/notarise-healthcerts";
import { CodedError } from "@utils/coded-error";

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

  const urlParams = useUrlParamsThenScrubUrl({ enabled: props.universalActionType !== "NONE" });

  useEffect(() => {
    (async () => {
      try {
        if (props.universalActionType === "HOSTED_URL") {
          if (urlParams?.uriFragment === undefined) {
            return;
          }
          const encodedQ = typeof urlParams?.query.q === "string" ? urlParams.query.q : "";
          const encodedHash = urlParams?.uriFragment;
          const { decodedQ, decodedHash } = decodeQueryAndHash(encodedQ, encodedHash);

          if (isNotariseSpmTransientStorage(decodedQ.payload.uri) || isNotariseTransientStorage(decodedQ.payload.uri)) {
            // Error component is customized in error-handler.tsx, hence message is empty
            throw new CodedError("HealthCertsTransientStorageDecommError", "");
          }

          const document = await fetchAndDecryptDocument(
            decodedQ.payload.uri,
            decodedHash?.key || decodedQ.payload.key
          );
          return dispatch({ type: "VERIFY_DOCUMENT", document });
        } else if (props.universalActionType === "EMBEDDED_URI_FRAGMENT") {
          if (urlParams?.uriFragment === undefined) {
            return;
          }
          const encodedHash = urlParams?.uriFragment;
          const document = decodeUriFragment(encodedHash);
          return dispatch({ type: "VERIFY_DOCUMENT", document });
        } else {
          return dispatch({ type: "INITIAL" });
        }
      } catch (e) {
        console.error(e);
        dispatch({ type: "INITIAL" });
        dispatch({ type: "STATUS_MESSAGE", status: verifyErrorHandler(e) });
      }
    })();
  }, [router, props.universalActionType, urlParams?.uriFragment, urlParams?.query.q]);

  const handleDocumentDropped = useCallback((wrappedDocument: any) => {
    dispatch({ type: "VERIFY_DOCUMENT", document: wrappedDocument });
  }, []);

  const handleDocumentError = useCallback((e: StatusProps) => {
    dispatch({ type: "STATUS_ERROR", status: e });
  }, []);

  return (
    <Layout>
      {urlParams !== undefined && (
        <>
          <WogaaScript />
          <Status {...status} />
          {showDropzone && <Dropzone onDocumentDropped={handleDocumentDropped} onDocumentError={handleDocumentError} />}
          {document !== null && <Verifier wrappedDocument={document} />}
        </>
      )}
    </Layout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return {
    props: {
      universalActionType: getUniversalActionType(context.query),
    },
  };
};

export default Verify;
