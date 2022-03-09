import { Record, String } from "runtypes";

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
  payload: Record({
    uri: String,
    key: String.optional(),
  }),
});

// https://github.com/Open-Attestation/adr/blob/master/universal_actions.md
export const ActionUrlAnchorRecord = Record({
  key: String,
}).optional();
