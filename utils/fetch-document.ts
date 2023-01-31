import axios from "axios";
import { v2, v3, validateSchema } from "@govtechsg/open-attestation";
import { decryptString } from "@govtechsg/oa-encryption";
import { CodedError } from "@utils/coded-error";
import { Static, String, ValidationError } from "runtypes";
import { EncryptionDocumentRecord, ActionUrlQueryRecord, ActionUrlAnchorRecord } from "@types";

const decodeAndParseUri = (encoded: string) => {
  const decoded = decodeURIComponent(encoded);
  return JSON.parse(decoded);
};

/**
 * Helper function to validate and parse OA-embedded uri fragment
 */
export const decodeUriFragment = (encodedHash: string) => {
  let decoded: v2.WrappedDocument | v3.WrappedDocument;

  try {
    decoded = decodeAndParseUri(encodedHash);
  } catch (e) {
    console.error(e);
    throw new CodedError("QueryParamsError", "The URI fragment is malformed so the document cannot be loaded");
  }

  if (!validateSchema(decoded)) {
    throw new CodedError("InvalidDocumentError", "The URI fragment contains an invalid OpenAttestation document");
  }

  return decoded;
};

/**
 * Helper function to validate and parse query params + hash
 *
 * See more: https://github.com/Open-Attestation/adr/blob/master/universal_actions.md
 */
export const decodeQueryAndHash = (encodedQuery: string, encodedHash?: string) => {
  let decodedQ: Static<typeof ActionUrlQueryRecord>;
  let decodedHash: Static<typeof ActionUrlAnchorRecord>;

  try {
    decodedQ = decodeAndParseUri(encodedQuery);
    decodedHash = String.guard(encodedHash) ? decodeAndParseUri(encodedHash) : undefined;
  } catch (e) {
    console.error(e);
    throw new CodedError("QueryParamsError", "The URL is malformed so the document cannot be loaded");
  }

  try {
    ActionUrlQueryRecord.check(decodedQ);
    ActionUrlAnchorRecord.check(decodedHash);
  } catch (e) {
    const msg = "The provided action/anchor is unsupported";

    const details =
      e instanceof ValidationError
        ? Object.entries(e.details || {})
            .map(([key, value]) => `"${key}": ${value}`)
            .join(", ")
        : undefined;

    throw new CodedError("QueryParamsError", msg, details);
  }

  return { decodedQ, decodedHash };
};

/**
 * Helper function to fetch and decode document (if key is present)
 * @param uri
 * @param key
 * @returns
 */
export const fetchAndDecryptDocument = async (uri: string, key?: string) => {
  return await axios
    .get(uri)
    .then((res) => res.data)
    .then((obj) => decryptDoc(obj, key));
};

const decryptDoc = (doc: any, key?: string) => {
  // If OpenCerts, opencerts-function returns the document in a nested document object
  doc = doc.document || doc;

  // If encrypted document
  if (EncryptionDocumentRecord.guard(doc)) {
    // If key is missing, throw error
    if (!key) {
      throw new CodedError("DecryptionError", `Unable to decrypt certificate with key=${key} and type=${doc.type}`);
    }

    // Key is provided, decrypt it
    try {
      return JSON.parse(decryptString({ ...doc, key })) as v2.WrappedDocument | v3.WrappedDocument;
    } catch (e) {
      if (e instanceof Error) {
        throw new CodedError("DecryptionError", e.message);
      }
    }
  }

  // If invalid OpenAttestation document, throw error
  if (!validateSchema(doc)) {
    throw new CodedError("InvalidDocumentError", "An invalid OpenAttestation document has been fetched.");
  }

  // Return valid OpenAttestation document, no decryption needed
  return doc as v2.WrappedDocument | v3.WrappedDocument;
};
