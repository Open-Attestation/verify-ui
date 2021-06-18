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
