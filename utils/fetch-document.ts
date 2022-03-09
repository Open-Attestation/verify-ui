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
 * Helper function to validate and parse query params + hash
 *
 * See more: https://github.com/Open-Attestation/adr/blob/master/universal_actions.md
 * @param encodedQuery ActionUrlQueryRecord
 * @param encodedHash ActionUrlAnchorRecord
 * @returns [ParsedQuery, ParsedAnchor]
 */
export const getQueryAndHash = (encodedQuery: string, encodedHash: string | undefined) => {
  let decodedQ: Static<typeof ActionUrlQueryRecord>;
  let decodedHash: Static<typeof ActionUrlAnchorRecord>;

  try {
    decodedQ = decodeAndParseUri(encodedQuery);
    decodedHash = String.guard(encodedHash) ? decodeAndParseUri(encodedHash) : undefined;
  } catch (e) {
    throw new CodedError(
      "QueryParamsError",
      "Unable to parse query/hash parameters",
      e instanceof Error ? e.message : JSON.stringify(e)
    );
  }

  try {
    ActionUrlQueryRecord.check(decodedQ);
    ActionUrlAnchorRecord.check(decodedHash);
  } catch (e) {
    throw new CodedError(
      "QueryParamsError",
      e instanceof ValidationError ? JSON.stringify(e.details) : "Unable to parse query/hash parameters",
      e instanceof Error ? e.message : JSON.stringify(e)
    );
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
  // If encrypted document
  if (EncryptionDocumentRecord.guard(doc)) {
    // If key is missing, throw error
    if (!key) {
      throw new CodedError(
        "DecryptionError",
        "An encrypted document has been fetched without specifying the decrypting key in the query parameters."
      );
    }

    // Key is provided, decrypt it
    return JSON.parse(decryptString({ ...doc, key })) as v2.WrappedDocument | v3.WrappedDocument;
  }

  // If invalid OpenAttestation document, throw error
  if (!validateSchema(doc)) {
    throw new CodedError("InvalidDocumentError", "An invalid OpenAttestation document has been fetched.");
  }

  // Return valid OpenAttestation document, no decryption needed
  return doc as v2.WrappedDocument | v3.WrappedDocument;
};
