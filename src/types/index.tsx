import { CodedError } from "@govtechsg/oa-verify";

// verifying document statuses
export enum Status {
  IDLE,
  PENDING,
  RESOLVED,
  REJECTED,
}

// embedding secrets in anchor
export interface Anchor {
  key?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isCodedError = (e: any): e is CodedError =>
  typeof e.message === "string" && typeof e.code === "number" && typeof e.codeString === "string";
