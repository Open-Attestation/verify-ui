import { Literal, Record, String } from "runtypes";
import { CodedError } from "@govtechsg/oa-verify";

export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export const EncryptionDocumentRecord = Record({
  cipherText: String,
  iv: String,
  tag: String,
  type: String,
  key: String.optional(),
});

// https://github.com/Open-Attestation/adr/blob/master/universal_actions.md
export const ActionUrlQueryRecord = Record({
  type: Literal("DOCUMENT").optional(),
  payload: Record({
    uri: String,
    key: String.optional(),
  }),
});

// https://github.com/Open-Attestation/adr/blob/master/universal_actions.md
export const ActionUrlAnchorRecord = Record({
  key: String,
}).optional();

/**
 * Type guard for CodedError from oa-verify
 * @param e
 * @returns
 */
export const isVerifyCodedError = (e: any): e is CodedError =>
  typeof e.message === "string" && typeof e.code === "number" && typeof e.codeString === "string" && e instanceof Error;
